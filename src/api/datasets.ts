import { urlSafeStringify, encodeFragment, Transform, ViewerState, LayerDataSource, Space, Layer, skeletonRendering } from "@janelia-cosem/neuroglancer-url-tools";
import { s3ls, getObjectFromJSON, bucketNameToURL} from "./datasources"
import * as Path from "path"
import { bool } from "aws-sdk/clients/signer";

const IMAGE_DTYPES = ['int8', 'uint8', 'uint16'];

interface DisplaySettings {
    contrastMin: number
    contrastMax: number
    gamma: number
    invertColormap: bool
    color: string
}

const displayDefaults: DisplaySettings = {contrastMin: 0, contrastMax: 1, gamma: 1, invertColormap: false, color: "white"};

const readmeFileName: string = 'README.md';
const nm: [number, string] = [1e-9, 'm']
// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
const outputDimensions: Space = { 'x': nm, 'y': nm, 'z': nm };
const sep = "/";
// the field in the top-level metadata of an n5 container that lists all the datasets for display
const targetVolumesKey = "export"
// the name of the base resolution; technically this can now be inferred from the multiscale metadata...
const baseResolutionName = 's0'

// Check whether a path represents a prediction volume. This is a hack and should be done with a proper
// path parsing library

function isPrediction(path: string, sep: string='/'): boolean {
    let parts = path.split(sep);    
    return (parts[parts.length - 3] === 'prediction');
}


function makeShader(shaderArgs: DisplaySettings): string{    
    return `#uicontrol float min slider(min=0, max=1, step=0.001, default=${shaderArgs.contrastMin})
            #uicontrol float max slider(min=0, max=1, step=0.001, default=${shaderArgs.contrastMax})
            #uicontrol float gamma slider(min=0, max=3, step=0.001, default=${shaderArgs.gamma})
            #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invertColormap? 1: 0})
            #uicontrol vec3 color color(default="${shaderArgs.color}")
            float inverter(float val, int invert) {return 0.5 + ((2.0 * (-float(invert) + 0.5)) * (val - 0.5));}
            float normer(float val) {return (clamp(val, min, max) - min) / (max-min);}
            void main() {emitRGB(color * pow(inverter(normer(toNormalized(getDataValue())), invertColormap), gamma));}`
}

async function getText(url: string): Promise<string> {
    const response = await fetch(url);
    let text: string = '';
    try{text = await response.text();}
    catch (ex) {}
    if (!response.ok) {text = `Nothing found at ${url}`}
    return text
}

class readme{public path: string;
             public format: string         
             public content: string;
         
             constructor(path: string, format: string, content: string){
                this.path = path;
                this.format = format;
                this.content = content;
             }
}

async function readmeFactory(path: string){
    const [format] = path.split('.').slice(-1);
    const content = await getText(path);
    return new readme(path, format, content)
}

// A single n-dimensional array
export class Volume {
    constructor(
        public path: string,
        public name: string,
        public dtype: string,
        public dimensions: number[],
        public origin: number[],
        public gridSpacing: number[],
        public unit: string,
        public displaySettings: DisplaySettings,
    ) { }

    // Convert n5 attributes to an internal representation of the volume
    // todo: remove handling of spatial metadata, or at least don't pass it on to the neuroglancer 
    // viewer state construction
    static fromN5Attrs(attrs: any): Volume {
        // warning: this is a stupid hack
        const offset = (attrs.offset? attrs.offset : [0,0,0]);       
        const displaySettings: DisplaySettings = (attrs.displaySettings? attrs.displaySettings: displayDefaults); 
        return new Volume(attrs.path,
            attrs.name,
            attrs.dataType,
            attrs.dimensions,
            offset,
            attrs.pixelResolution["dimensions"],
            attrs.pixelResolution["unit"],
            displaySettings)
    }

    toLayer(): Layer {
        const srcURL = `n5://${this.path}`;
        const inputDimensions: Space = {
            x: [1e-9 * this.gridSpacing[0], "m"],
            y: [1e-9 * this.gridSpacing[1], "m"],
            z: [1e-9 * this.gridSpacing[2], "m"]
        };
        const transform = new Transform(
            [
                [1, 0, 0, this.origin[0]],
                [0, 1, 0, this.origin[1]],
                [0, 0, 1, this.origin[2]]
            ],
            outputDimensions,
            inputDimensions)

        const source = new LayerDataSource(srcURL, transform);
        const shader: string = makeShader(this.displaySettings);

        const defaultSkeletonRendering: skeletonRendering = { mode2d: "lines_and_points", mode3d: "lines" };
        let layer: Layer | null;
        if (IMAGE_DTYPES.includes(this.dtype)) {
            layer = new Layer("image", source,
                undefined, this.name, undefined, undefined, shader);
                layer.blend = 'additive'
                layer.opacity = 1;
            if (isPrediction(this.path)){layer.shader = shader;}
        } else if (this.dtype === "uint64") {
            layer = new Layer("segmentation", source,
                undefined, this.name, undefined, defaultSkeletonRendering, undefined)
        } else { throw `Something went wrong constructing layers from ${this}!` }

        return layer;
    }
}

// a collection of volumes, i.e. a collection of ndimensional arrays 
export class Dataset {
    public path: string;
    public name: string;
    public space: Space;
    public volumes: Map<string, Volume>;   
    public readme?: readme;
    constructor(path: string, name: string, space: Space, volumes: Volume[], readme: readme
    ) {
        this.path = path;
        this.name = name;
        this.space = space;
        this.volumes = new Map(volumes.map(v => [v.name, v]));
        this.readme = readme;
    }

    makeNeuroglancerViewerState(volumes: Volume[]): string {
        const viewerPosition = undefined;
        const layers = volumes.map(a => a.toLayer());
        const projectionOrientation = undefined;
        const crossSectionOrientation = undefined;
        const projectionScale = undefined;
        const crossSectionScale = 30.0;
        // the first layer is the selected layer; consider making this a kwarg
        const selectedLayer = {'layer': layers[0].name, 'visible': true};

        const vState = new ViewerState(
            outputDimensions,
            viewerPosition,
            crossSectionOrientation,
            crossSectionScale,
            projectionOrientation,
            projectionScale,
            layers,
            selectedLayer
        );
        return encodeFragment(urlSafeStringify(vState));
    }
}

async function makeVolumes(rootAttrs: any) {
    let rAttrs = await rootAttrs;
    if (rootAttrs === undefined){return null};
    let rootPath = rAttrs['root'];
    let volumeNames = rAttrs[targetVolumesKey];
    // In lieu of proper metadata validation, return null if the `multiscale_data` key is missing
    if (volumeNames === undefined) {return Promise.resolve(null)}

    let volumes: Promise<Volume>[] = volumeNames.map(async (name: string) => {
        let path = `${rootPath}${name}${sep}`;
        // get the attributes of the individual volumes
        let attr = await getObjectFromJSON(
            `${path}${baseResolutionName}${sep}attributes.json`
        );
        // add the full path as a property
        if (attr !== undefined)
            attr.path = path;
            let volume = Volume.fromN5Attrs(attr);
        
        return volume;
    });
    return Promise.all(volumes);
}

export async function makeDatasets(bucket: string): Promise<Dataset[]> {   
    // get all the folders in the bucket
    let prefixes = (await s3ls(bucket, '', '/', '', false)).folders; 
    // datasets will be stored as follows: <bucket name>/<dataset name>/<dataset name.n5>/*
    let n5Containers = prefixes.map(f => `${bucketNameToURL(bucket)}/${f}${Path.basename(f)}.n5/`);    
    // for each n5 container, get the root attributes
    let rootAttrs = await Promise.all(n5Containers.map(async container => {
        let rootAttrs = await getObjectFromJSON(`${container}attributes.json`);        
        if (rootAttrs !== undefined){rootAttrs.root = container;}
        return rootAttrs;
    }));

    if (rootAttrs.length === 0){alert(`No n5 containers found in ${bucket}`)}
    // for each volume described in the root attributes, instantiate an object for the metadata of that volume
    let volumes = await Promise.all(rootAttrs.map(makeVolumes));    
    let datasets = Promise.all(volumes.map(async (vol, idx) => {        
        if (vol !== null) {
            let readmeURL = new URL(readmeFileName, Path.dirname(n5Containers[idx])+'/').href;
            let readme = await readmeFactory(readmeURL);
            let dset = new Dataset(n5Containers[idx],
                                   n5Containers[idx].split('/').slice(-2,-1).pop()?.split('.')[0],
                                   outputDimensions,
                                   vol,
                                   readme)
            return dset;}
        else {           
            return null
        }
        }
    ))
    // filter out the null datasets
    datasets = datasets.then(d => d.filter(a => a !== null))
    
    return datasets

}