import { urlSafeStringify, encodeFragment, Transform, ViewerState, LayerDataSource, Space, Layer, skeletonRendering } from "@janelia-cosem/neuroglancer-url-tools";
import { s3ls, getObjectFromJSON } from "./datasources"

// Check whether a path points to an n5 container
function isN5Container(arg: string) { return arg.split(".").pop() === "n5/" }

const nm: [number, string] = [1e-9, 'm']
// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
const outputDimensions: Space = { 'x': nm, 'y': nm, 'z': nm };


// a collection of volumes, i.e. a collection of ndimensional arrays 
export class Dataset {
    public path: string;
    public name: string;
    public space: Space;
    public volumes: Volume[];
    public neuroglancerURLFragment?: string;
    public readmeURL?: string;
    constructor(path: string, name: string, space: Space, volumes: Volume[]
    ) {
        this.path = path;
        this.name = name;
        this.space = space;
        this.volumes = volumes;
        this.neuroglancerURLFragment = encodeFragment(urlSafeStringify(this.makeNeuroglancerViewerState())); //yuck 
    }

    makeNeuroglancerViewerState(): ViewerState {
        // take an array of dataset objects and generate the correct viewer state

        const viewerPosition = calculateViewerPosition(
            this.volumes.map(a => a.dimensions),
            this.volumes.map(a => a.origin)
        );

        const layers = this.volumes.map(a => a.toLayer());

        const projectionOrientation = undefined;
        const crossSectionOrientation = undefined;
        const projectionScale = undefined;
        const crossSectionScale = 3.0;
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


// A single ndimensional array
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
    static fromN5Attrs(attrs: any): Volume {
        return new Volume(attrs.path,
            attrs.name,
            attrs.dataType,
            attrs.dimensions,
            attrs.offset,
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
        const defaultShader = "void main() {\\n  emitGrayscale(toNormalized(getDataValue()));\\n}\\n";
        const defaultSkeletonRendering: skeletonRendering = { mode2d: "lines_and_points", mode3d: "lines" };
        let layer: Layer | null;
        if (this.dtype === 'uint8') {
            layer = new Layer("image", source,
                undefined, this.name, undefined, undefined, defaultShader)
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
    let rootPath = rAttrs.root;
    let volumeNames = rAttrs[targetVolumesKey];

    let volumes: Promise<Volume>[] = volumeNames.map(async (name: any) => {
        let path = `${rootPath}${name}${sep}`;
        // get the attributes of the individual volumes
        let attr = await getObjectFromJSON(
            `${path}${baseResolutionName}${sep}attributes.json`
        );
        // add the full path as a property
        attr.path = path;
        let volume = Volume.fromN5Attrs(attr);
        return volume;
    });
    return Promise.all(volumes);
}


function calculateViewerPosition(dimensions: number[][], origins: number[][]): number[] {
    // get the largest volume, then return the middle coordinate of that volume shifted by the origin
    let position = [];
    let volumes = dimensions.map(d => d.reduce((a, b) => a * b));
    let max_volume = Math.max.apply(null, volumes);
    let index = volumes.indexOf(max_volume);
    position = origins[index].map(
        (val, idx) => val + dimensions[index][idx] / 2
    );
    return position;
};

export async function makeDatasets(bucket: string): Promise<Dataset[]> {
    let lsresult = await s3ls(bucket, '', '/', '', true);

    let n5Containers = lsresult.folders.filter(isN5Container);

    // for each n5 container, get the root attributes
    let rootAttrs = await Promise.all(n5Containers.map(async container => {
        let rootAttrs = await getObjectFromJSON(`${container}attributes.json`);
        rootAttrs.root = container;
        return rootAttrs;
    }));

    // for each volume described in the root attributes, instantiate an object for the metadata of that volume
    let volumes = await Promise.all(rootAttrs.map(makeVolumes));
    let datasets = volumes.map((v, idx) => new Dataset(n5Containers[idx], 'DatasetName', outputDimensions, v))
    // turn the dataset objects into a viewer state
    //let viewerStates = datasets.map(volumesToViewerState);
    //let urls = viewerStates.map(state => `${neuroglancerAddress}${encodeFragment(urlSafeStringify(state))}`);

    return datasets

}