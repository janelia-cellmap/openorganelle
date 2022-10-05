import { CoordinateSpace, CoordinateSpaceTransform, encodeFragment, ImageLayer, Layer, LayerDataSource, SegmentationLayer, urlSafeStringify, ViewerState } from "@janelia-cosem/neuroglancer-url-tools";
import { LayerTypes } from "./datasets";
import { DisplaySettings, SpatialTransform, VolumeSource } from "./manifest";
import {components} from "../api/datasets_api"

type Image = components["schemas"]["Volume"]
type SampleType = components["schemas"]["SampleTypeEnum"]
type DisplaySettings = components["schemas"]["DisplaySettings"]

// one nanometer, expressed as a scaled meter
const nm: [number, string] = [1e-9, "m"];

// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
export const outputDimensions: CoordinateSpace = { x: nm, y: nm, z: nm };

interface LayerDataSource2 extends LayerDataSource {
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
            let lower = shaderArgs.contrastLimits.min;
            let upper = shaderArgs.contrastLimits.max;
            let cmin = shaderArgs.contrastLimits.start;
            let cmax = shaderArgs.contrastLimits.end;
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

export function makeShaderV2(shaderArgs: DisplaySettings, sampleType: SampleType): string | undefined {
    switch (sampleType) {
        case 'scalar': {
            let lower = shaderArgs.contrast_limits.min;
            let upper = shaderArgs.contrast_limits.max;
            let cmin = shaderArgs.contrast_limits.start;
            let cmax = shaderArgs.contrast_limits.end;
            return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${lower}, ${upper}])
          #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invert_lut ? 1 : 0})
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

export function makeLayer(volume: VolumeSource,
    layerType: LayerTypes,
    outputDimensions: CoordinateSpace): Layer | undefined {
    const srcURL = `${volume.format}://${volume.url}`;

    // need to update the layerdatasource object to have a transform property
    const source: LayerDataSource2 = {
        url: srcURL,
        transform: SpatialTransformToNeuroglancer(volume.transform, outputDimensions),
        CoordinateSpaceTransform: SpatialTransformToNeuroglancer(volume.transform, outputDimensions)
    };

    const subsources = volume.subsources.map(subsource => {
        return { url: `precomputed://${subsource.url}`, transform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions), CoordinateSpaceTransform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions) }
    });
    let layer: Layer | undefined = undefined;
    const color = volume.displaySettings.color ?? undefined;
    if (layerType === 'image') {
        let shader: string | undefined = undefined;
        shader = makeShader(volume.displaySettings, volume.sampleType);
        layer = new ImageLayer('rendering',
            undefined,
            undefined,
            volume.name,
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
                volume.name,
                [source, ...subsources],
                volume.subsources[0].ids,
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
                volume.name,
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

export function makeLayerV2(image: Image,
    layerType: LayerTypes,
    outputDimensions: CoordinateSpace): Layer | undefined {
    const srcURL = `${image.format}://${image.url}`;

    // need to update the layerdatasource object to have a transform property
    const source: LayerDataSource2 = {
        url: srcURL,
        transform: SpatialTransformToNeuroglancer(image.transform, outputDimensions),
        CoordinateSpaceTransform: SpatialTransformToNeuroglancer(image.transform, outputDimensions)
    };

    const subsources = image.subsources.map(subsource => {
        return { url: `precomputed://${subsource.url}`, transform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions), CoordinateSpaceTransform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions) }
    });
    let layer: Layer | undefined = undefined;
    const color = image.display_settings.color ?? undefined;
    if (layerType === 'image') {
        let shader: string | undefined = undefined;
        shader = makeShaderV2(image.display_settings, image.sample_type);
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
                image.subsources[0].ids,
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
