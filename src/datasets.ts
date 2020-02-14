import { Transform, ViewerState, LayerDataSource, Space, Layer, skeletonRendering } from "@janelia-cosem/neuroglancer-url-tools";

const nm: [number, string] = [1e-9, 'm']
// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
const outputDimensions: Space = { 'x': nm, 'y': nm, 'z': nm };

export class Dataset {
    constructor(
        public path: string,
        public name: string,
        public dtype: string,
        public dimensions: number[],
        public origin: number[],
        public gridSpacing: number[],
        public unit: string,
    ) { }

    static DatasetFromN5Attrs(attrs: any): Dataset {
        return new Dataset(attrs.path,
            attrs.name,
            attrs.dataType,
            attrs.dimensions,
            attrs.offset,
            attrs.pixelResolution["dimensions"],
            attrs.pixelResolution["unit"])
    }
}

function datasetToLayer(dataset: Dataset): Layer {
    const srcURL = `n5://${dataset.path}`;
    const inputDimensions: Space = {
        x: [1e-9 * dataset.gridSpacing[0], "m"],
        y: [1e-9 * dataset.gridSpacing[1], "m"],
        z: [1e-9 * dataset.gridSpacing[2], "m"]
    };
    const transform = new Transform(
        [
            [1, 0, 0, dataset.origin[0]],
            [0, 1, 0, dataset.origin[1]],
            [0, 0, 1, dataset.origin[2]]
        ],
        outputDimensions,
        inputDimensions)

    const source = new LayerDataSource(srcURL, transform);
    const defaultShader = "void main() {\\n  emitGrayscale(pow(toNormalized(getDataValue()), 6.0));\\n}\\n";
    const defaultSkeletonRendering: skeletonRendering = { mode2d: "lines_and_points", mode3d: "lines" };
    let layer: Layer | null;
    if (dataset.dtype == 'uint8') {
        layer = new Layer("image", source,
            undefined, dataset.name, undefined, undefined, defaultShader)
    } else if (dataset.dtype == "uint64") {
        layer = new Layer("image", source,
            undefined, dataset.name, undefined, defaultSkeletonRendering, undefined)
    } else { layer = null };

    return layer;
}

function calculateViewerPosition() { return [0, 0, 0] }


export function datasetsToViewerState(datasets: Dataset[]) {
    const position = [0, 0, 0];
    const projectionOrientation = undefined;
    const crossSectionOrientation = undefined;
    const projectionScale = undefined;
    const crossSectionScale = undefined;
    const defaultShader = "void main() {\\n  emitGrayscale(pow(toNormalized(getDataValue()), 6.0));\\n}\\n";
    const defaultSkeletonRendering: skeletonRendering = { mode2d: "lines_and_points", mode3d: "lines" };



    return ViewerState(outputDimensions,
    )
}