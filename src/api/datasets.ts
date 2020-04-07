import { urlSafeStringify, encodeFragment, Transform, ViewerState, LayerDataSource, Space, Layer, skeletonRendering } from "@janelia-cosem/neuroglancer-url-tools";
import { s3ls, getObjectFromJSON, bucketNameToURL} from "./datasources"
import * as path from "path"

// Check whether a path represents a prediction volume. This is a hack and should be done with a proper
// path parsing library

function isPrediction(path: string, sep: string='/') {
    let parts = path.split(sep);    
    return (parts[parts.length - 3] === 'prediction');
}
const readmeFileName: string = 'README.md';
const nm: [number, string] = [1e-9, 'm']
// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
const outputDimensions: Space = { 'x': nm, 'y': nm, 'z': nm };

function makeShader(contrastLimits: [Number, Number], gamma: Number, color: string){
    return `#uicontrol float min slider(min=0, max=1, step=0.001, default=${contrastLimits[0]})
            #uicontrol float max slider(min=0, max=1, step=0.001, default=${contrastLimits[1]})
            #uicontrol float gamma slider(min=0, max=3, step=0.001, default=${gamma})
            #uicontrol vec3 color color(default="${color}")
            void main() {emitRGB(color * (clamp(pow(toNormalized(getDataValue()), gamma), min, max) - min) / (max - min));}`
}

// a collection of volumes, i.e. a collection of ndimensional arrays 
export class Dataset {
    public path: string;
    public name: string;
    public space: Space;
    public volumes: Volume[];
    public neuroglancerURLFragment?: string;
    public readmeURL?: string;
    constructor(path: string, name: string, space: Space, volumes: Volume[], readmeURL: string
    ) {
        this.path = path;
        this.name = name;
        this.space = space;
        this.volumes = volumes;
        this.neuroglancerURLFragment = encodeFragment(urlSafeStringify(this.makeNeuroglancerViewerState())); 
        this.readmeURL = readmeURL;
    }

    makeNeuroglancerViewerState(): ViewerState {
        // take an array of dataset objects and generate the correct viewer state
        /*
        const viewerPosition = calculateViewerPosition(
            this.volumes.map(a => a.dimensions),
            this.volumes.map(a => a.origin)
        );
        */
       const viewerPosition = undefined;
        const layers = this.volumes.map(a => a.toLayer());

        const projectionOrientation = undefined;
        const crossSectionOrientation = undefined;
        const projectionScale = undefined;
        const crossSectionScale = 15.0;
        const selectedLayer = undefined;

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

        return vState;
    }
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
    ) { }

    // Convert n5 attributes to an internal representation of the volume
    // todo: remove handling of spatial metadata, or at least don't pass it on to the neuroglancer 
    // viewer state construction
    static fromN5Attrs(attrs: any): Volume {
        // warning: this is a stupid hack
        let offset = (attrs.offset? attrs.offset : [0,0,0]);
        return new Volume(attrs.path,
            attrs.name,
            attrs.dataType,
            attrs.dimensions,
            offset,
            attrs.pixelResolution["dimensions"],
            attrs.pixelResolution["unit"])
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
        const defaultShader = makeShader([0,1], 1, "white");
        const predictionShader = makeShader([0,1], 1,"red");

        const defaultSkeletonRendering: skeletonRendering = { mode2d: "lines_and_points", mode3d: "lines" };
        let layer: Layer | null;
        if (this.dtype === 'uint8') {
            layer = new Layer("image", source,
                undefined, this.name, undefined, undefined, defaultShader);
                layer.blend = 'additive'
                layer.opacity = 1;
            if (isPrediction(this.path)){layer.shader = predictionShader;}
        } else if (this.dtype === "uint64") {
            layer = new Layer("segmentation", source,
                undefined, this.name, undefined, defaultSkeletonRendering, undefined)
        } else { throw `Something went wrong constructing layers from ${this}!` }

        return layer;
    }
}

async function makeVolumes(rootAttrs: any) {
    let sep = "/";
    let targetVolumesKey = "multiscale_data"
    let baseResolutionName = 's0'

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
    let n5Containers = prefixes.map(f => `${bucketNameToURL(bucket)}/${f}${path.basename(f)}.n5/`);    
    // for each n5 container, get the root attributes
    let rootAttrs = await Promise.all(n5Containers.map(async container => {
        let rootAttrs = await getObjectFromJSON(`${container}attributes.json`);
        if (rootAttrs !== undefined){rootAttrs.root = container;}
        return rootAttrs;
    }));

    if (rootAttrs.length === 0){alert(`No n5 containers found in ${bucket}`)}

    // for each volume described in the root attributes, instantiate an object for the metadata of that volume
    let volumes = await Promise.all(rootAttrs.map(makeVolumes));    
    let datasets = volumes.map((vol, idx) => {        
        if (vol !== null) {
            let dset = new Dataset(n5Containers[idx],
                                   n5Containers[idx].split('/').slice(-2,-1).pop()?.split('.')[0],
                                   outputDimensions,
                                   vol,
                                   path.join(path.dirname(n5Containers[idx]), readmeFileName))
            return dset;}
        else return null
        }
    )
    // filter out the null datasets
    datasets = datasets.filter(a => a !== null)
    return datasets

}