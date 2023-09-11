import { CoordinateSpace,
         CoordinateSpaceTransform,
         encodeFragment,
         ImageLayer,
         Layer,
         LayerDataSource as LayerDataSource1,
         SegmentationLayer,
         urlSafeStringify,
         ViewerState } from "@janelia-cosem/neuroglancer-url-tools";
import {DisplaySettings, Imagery, isDisplayEmpty, MaybeDisplaySettings, SampleType, STTransform } from "../types/database";

export type LayerType = "image" | "segmentation" | "annotation"

// one nanometer, expressed as a scaled meter
const nm: [number, string] = [1e-9, "m"];

// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
export const outputDimensions: CoordinateSpace = { x: nm, y: nm, z: nm };

export interface LayerDataSource extends LayerDataSource1 {
    transform: any
}

export function STTransformToNeuroglancer({dims, translation, scale, units}: STTransform, 
                                               outputDimensions: CoordinateSpace): CoordinateSpaceTransform {
        const inputDimensions: CoordinateSpace = {
        x: [Math.abs(scale[dims.indexOf('x')]), units[dims.indexOf('x')]],
        y: [Math.abs(scale[dims.indexOf('y')]), units[dims.indexOf('y')]],
        z: [Math.abs(scale[dims.indexOf('z')]), units[dims.indexOf('z')]]
    };

    const layerTransform: CoordinateSpaceTransform = {
        matrix:
            [
                [(scale[dims.indexOf('x')] < 0) ? -1 : 1, 0, 0, translation[dims.indexOf('x')]],
                [0, (scale[dims.indexOf('y')] < 0) ? -1 : 1, 0, translation[dims.indexOf('y')]],
                [0, 0, (scale[dims.indexOf('z')] < 0) ? -1 : 1, translation[dims.indexOf('z')]]
            ],
        outputDimensions: outputDimensions,
        inputDimensions: inputDimensions
    }
    return layerTransform
}

export function makeScalarShader({color, invertLUT, contrastLimits}: DisplaySettings): string {
        const window = [contrastLimits.min, contrastLimits.max]
        const range = [contrastLimits.start, contrastLimits.end]
        if (invertLUT) {range.reverse()}
        return `#uicontrol invlerp normalized(range=[${range[0]}, ${range[1]}], window=[${window[0]}, ${window[1]}])\n#uicontrol vec3 color color(default="${color}")\nvoid main(){emitRGB(color * normalized());}`
    }

type makeLayerProps = {
    image: Imagery
    displaySettings: MaybeDisplaySettings
    outputDimensions: CoordinateSpace,
    layerType: LayerType,
}

export function makeLayer({image, displaySettings, outputDimensions, layerType}: makeLayerProps) {
    const tform = {scale: image.gridScale, translation: image.gridTranslation, dims: image.gridDims, units : image.gridUnits}
    const srcURL = `${image.format}://${image.url}`;

    // need to update the layerdatasource object to have a transform property
    const source: LayerDataSource = {
        url: srcURL,
        transform: STTransformToNeuroglancer(tform, outputDimensions),
        CoordinateSpaceTransform: STTransformToNeuroglancer(tform, outputDimensions)
    };
    const subsources: any[] = []
    /*
    const subsources = image.meshes.map(mesh => {
        const tform = {
            scale: mesh.gridScale, 
            translation: mesh.gridTranslation, 
            dims: mesh.gridDims, 
            units : mesh.gridUnits}

        return { url: `precomputed://${mesh.url}`,
                 transform: STTransformToNeuroglancer(tform, 
                                                          outputDimensions),
                 CoordinateSpaceTransform: STTransformToNeuroglancer(tform, outputDimensions) 
                }
    });
    */
    let layer;
    let color: string | undefined
    if (Object.keys(displaySettings).length > 0) {
        color = displaySettings.color
    } 
    if (layerType === 'image') {
        let shader: undefined | string
        if (isDisplayEmpty(displaySettings)) {
            shader = undefined
        }
        else {
            shader = makeScalarShader(displaySettings)
        }
        layer = new ImageLayer('rendering',
            undefined,
            undefined,
            image.name,
            source,
            0.75,
            'additive',
            shader,
            undefined,
            undefined);
    }
    else if (layerType === 'segmentation') {
            layer = new SegmentationLayer('source',
                true,
                undefined,
                image.name,
                source,
                undefined,
                undefined,
                true,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                color);
        }
    return layer
}

export function makeNeuroglancerViewerState(layers: (SegmentationLayer | ImageLayer)[],
    viewerPosition: number[] | undefined,
    crossSectionScale: number | undefined,
    crossSectionOrientation: number[] | undefined,
    outputDimensions: CoordinateSpace) {
    // hack to post-hoc adjust alpha if there is only 1 layer selected
    if (layers.length === 1 && layers[0] instanceof ImageLayer) { layers[0].opacity = 1.0 }
    const projectionOrientation = crossSectionOrientation;
    crossSectionScale = crossSectionScale ? crossSectionScale : 50;
    const projectionScale = 65536;
    // the first layer is the selected layer; consider making this a kwarg
    const selectedLayer = { 'layer': layers[0]!.name, 'visible': true };
    const vState = new ViewerState(
        outputDimensions,
        viewerPosition,
        layers as Layer[],
        '4panel',
        undefined,
        crossSectionScale,
        undefined,
        crossSectionOrientation,
        projectionScale,
        undefined,
        projectionOrientation,
        true,
        true,
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        'black',
        'black',
        selectedLayer,
        undefined
    );
    return encodeFragment(urlSafeStringify(vState));
}


type viewToNeuroglancerUrlProps = {
    position: number[] | undefined | null
    scale: number | undefined | null
    orientation: number[] | undefined | null
    imagery: Imagery[]
    outputDimensions: CoordinateSpace,
    host: string
}

export function makeNeuroglancerUrl({position,
                                      scale,
                                      orientation,
                                      imagery,
                                      outputDimensions,
                                      host} : viewToNeuroglancerUrlProps) {
    const layers = imagery.map(image => {
        const layerType = (image.sampleType === 'scalar') ? 'image' : 'segmentation';
        return makeLayer({image, image.displaySettings, outputDimensions, layerType});
      });

    return `${host}${makeNeuroglancerViewerState(
        layers as SegmentationLayer[] | ImageLayer[],
        position ?? undefined,
        scale ?? undefined,
        orientation ?? undefined,
        outputDimensions)}`;
    }