import { CoordinateSpace, CoordinateSpaceTransform, encodeFragment, ImageLayer, Layer, LayerDataSource as LayerDataSource1, SegmentationLayer, urlSafeStringify, ViewerState } from "@janelia-cosem/neuroglancer-url-tools";
import {Image, SampleType, LayerType, SpatialTransform, View } from "../types/datasets";

// one nanometer, expressed as a scaled meter
const nm: [number, string] = [1e-9, "m"];

// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
export const outputDimensions: CoordinateSpace = { x: nm, y: nm, z: nm };

export interface LayerDataSource extends LayerDataSource1 {
    transform: any
}

export function SpatialTransformToNeuroglancer(transform: SpatialTransform, outputDimensions: CoordinateSpace): CoordinateSpaceTransform {

    const inputDimensions: CoordinateSpace = {
        x: [1e-9 * Math.abs(transform.scale[transform.axes.indexOf('x')]), "m"],
        y: [1e-9 * Math.abs(transform.scale[transform.axes.indexOf('y')]), "m"],
        z: [1e-9 * Math.abs(transform.scale[transform.axes.indexOf('z')]), "m"]
    };

    const layerTransform: CoordinateSpaceTransform = {
        matrix:
            [
                [(transform.scale[transform.axes.indexOf('x')] < 0) ? -1 : 1, 0, 0, transform.translate[transform.axes.indexOf('x')]],
                [0, (transform.scale[transform.axes.indexOf('y')] < 0) ? -1 : 1, 0, transform.translate[transform.axes.indexOf('y')]],
                [0, 0, (transform.scale[transform.axes.indexOf('z')] < 0) ? -1 : 1, transform.translate[transform.axes.indexOf('z')]]
            ],
        outputDimensions: outputDimensions,
        inputDimensions: inputDimensions
    }
    return layerTransform
}

export function makeShader(shaderArgs: any, sampleType: SampleType): string | undefined {
    switch (sampleType) {
        case 'scalar': {
            const lower = shaderArgs.contrastLimits.min;
            const upper = shaderArgs.contrastLimits.max;
            const cmin = shaderArgs.contrastLimits.start;
            const cmax = shaderArgs.contrastLimits.end;
            return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${lower}, ${upper}])
          #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invertLUT ? 1 : 0})
          #uicontrol vec3 color color(default="${shaderArgs.color}")
          float inverter(float val, int invert) {return 0.5 + ((2.0 * (-float(invert) + 0.5)) * (val - 0.5));}
            void main() {
            emitRGB(color * inverter(normalized(), invertColormap));
          }`
        }
        case "label":
            return '';
        default:
            return undefined;
    }
}

export function makeLayer(image: Image,
    layerType: LayerType,
    outputDimensions: CoordinateSpace): Layer | undefined {

    const srcURL = `${image.format}://${image.url}`;

    // need to update the layerdatasource object to have a transform property
    const source: LayerDataSource2 = {
        url: srcURL,
        transform: SpatialTransformToNeuroglancer(image.transform, outputDimensions),
        CoordinateSpaceTransform: SpatialTransformToNeuroglancer(image.transform, outputDimensions)
    };

    const subsources = image.meshes.map(mesh => {
        return { url: `precomputed://${mesh.url}`,
                 transform: SpatialTransformToNeuroglancer(mesh.transform, outputDimensions),
                 CoordinateSpaceTransform: SpatialTransformToNeuroglancer(mesh.transform, outputDimensions) 
                }
    });
    let layer: Layer | undefined = undefined;
    const color = image.displaySettings.color ?? undefined;
    if (layerType === 'image') {
        let shader: string | undefined = undefined;
        shader = makeShader(image.displaySettings, image.sampleType);
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
        if (subsources.length > 0) {
            layer = new SegmentationLayer('source',
                true,
                undefined,
                image.name,
                [source, ...subsources],
                image.meshes[0].ids,
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
        else {
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
    }
    return layer
}

export function makeNeuroglancerViewerState(layers: SegmentationLayer[] | ImageLayer[],
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


export function viewToNeuroglancerUrl(view: View,
                                      outputDimensions: CoordinateSpace,
                                      host: string) {
    const layers = view.images.map(im => {
        const layerType = im.sampleType === 'scalar' ? 'image' : 'segmentation';
        return makeLayer(im, layerType, outputDimensions);
      });

    return `${host}${makeNeuroglancerViewerState(
        layers as SegmentationLayer[] | ImageLayer[],
        view.position,
        view.scale,
        view.orientation,
        outputDimensions)}`;
    }