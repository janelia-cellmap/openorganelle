import { components } from "./schema"
import { getObjectFromJSON } from "./dataset_metadata"
import { ITag, LayerTypes, OSet } from "./datasets";
import { encodeFragment, urlSafeStringify } from "@janelia-cosem/neuroglancer-url-tools";
import { SegmentationLayer, ImageLayer, Outputdimensions as CoordinateSpace, CoordinateSpaceTransform } from "./neuroglancer";

export type IDataset = components["schemas"]["Dataset"]
export type IVolume = components["schemas"]["Volume"]
export type IView = components["schemas"]["View"]
export type ContentType = components["schemas"]["ContentTypeEnum"]
export type SpatialTransform = components["schemas"]["SpatialTransform"]
export type SampleType = components["schemas"]["SampleTypeEnum"]

// one nanometer, expressed as a scaled meter

const nm: [number, string] = [1e-9, "m"];
const outputDimensions = { x: nm, y: nm, z: nm };
const resolutionTagThreshold = 6;

export interface NameDescription {
    name: string
    description: string
}

export const contentTypeDescriptions = new Map<ContentType, NameDescription>();
contentTypeDescriptions.set('em', { name: "EM Layers", description: "Raw FIB-SEM data." });
contentTypeDescriptions.set('lm', { name: "LM Layers", description: "Light microscopy data." });
contentTypeDescriptions.set('segmentation', { name: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis. In neuroglancer, left click twice on a segmentation to turn on/off a 3D rendering." });
contentTypeDescriptions.set('prediction', { name: "Prediction Layers", description: "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm." });
contentTypeDescriptions.set('analysis', { name: "Analysis Layers", description: "Results of applying various analysis routines on raw data, predictions, or segmentations." });


function makeShader(shaderArgs: IVolume["display_settings"], sampleType: SampleType): string | undefined{
    switch (sampleType) {
      case 'scalar':{
        let lower = shaderArgs.contrast_limits.min;
        let upper = shaderArgs.contrast_limits.max;
        let cmin = shaderArgs.contrast_limits.start;
        let cmax = shaderArgs.contrast_limits.end;
          return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${lower}, ${upper}])
          #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invert_lut? 1: 0})
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

function SpatialTransformToNeuroglancer(transform: SpatialTransform,
    outputDimensions: CoordinateSpace): CoordinateSpaceTransform {

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


const makeTags = (dataset: IDataset, resolutionTagThreshold: number): OSet<ITag> => {

    const tags: OSet<ITag> = new OSet();
    let latvox = undefined;

    for (let val of dataset.institutions) {
        tags.add({ value: val, category: 'Contributing institution' })
    }
    if (dataset.sample !== undefined) {
        for (let val of dataset.sample.organism) {
            tags.add({ value: val, category: 'Sample: Organism' })
        }

        for (let val of dataset.sample.type) {
            tags.add({ value: val, category: 'Sample: Type' })
        }
        for (let val of dataset.sample.subtype) {
            tags.add({ value: val, category: 'Sample: Subtype' })
        }
        for (let val of dataset.sample.treatment) {
            tags.add({ value: val, category: 'Sample: Treatment' })
        }
    }
    if (dataset.acquisition !== undefined) {
        tags.add({ value: dataset.acquisition.institution, category: 'Acquisition institution' });
        const axvox = dataset.acquisition.grid_spacing.values.z
        if (axvox !== undefined) {
            let value = ''
            if (axvox <= resolutionTagThreshold) { value = `<= ${resolutionTagThreshold} nm` }
            else {
                value = `> ${resolutionTagThreshold} nm`
            }
            tags.add({ value: value, category: 'Axial voxel size' });
        }
        if ((dataset.acquisition.grid_spacing.values.y !== undefined) || (dataset.acquisition.grid_spacing.values.x !== undefined)) {
            latvox = Math.min(dataset.acquisition.grid_spacing.values.y, dataset.acquisition.grid_spacing.values.x!);
            tags.add({ value: latvox.toString(), category: 'Lateral voxel size' });
        }
    }
    tags.add({ value: dataset.software_availability, category: 'Software Availability' });
    return tags
}

function isImageLayer(layer: ImageLayer | SegmentationLayer): layer is ImageLayer {
    return Object.keys(layer).includes("opacity")
}

export function makeNeuroglancerViewerState(layers: SegmentationLayer[] | ImageLayer[],
    viewerPosition: number[] | undefined,
    crossSectionScale: number | undefined,
    crossSectionOrientation: number[] | undefined
): string {
    // hack to post-hoc adjust alpha if there is only 1 layer selected
    if ((layers.length === 1) && (isImageLayer(layers[0]))) { layers[0].opacity = 1.0 }
    const projectionOrientation = crossSectionOrientation;
    crossSectionScale = crossSectionScale ? crossSectionScale : 50;
    const projectionScale = 65536;
    // the first layer is the selected layer; consider making this a kwarg
    const selectedLayer = { 'layer': layers[0]!.name, 'visible': true };
    const viewerState = {
        dimensions: outputDimensions,
        position: viewerPosition,
        layers: layers,
        layout: '4panel',
        crossSectionScale: crossSectionScale,
        crossSectionOrientation: crossSectionOrientation,
        projectionScale: projectionScale,
        projectionOrientation: projectionOrientation,
        selectedLayer: selectedLayer,
    };
    return encodeFragment(urlSafeStringify(viewerState));
}

export function makeLayer(volume: IVolume,
    layerType: LayerTypes): ImageLayer | SegmentationLayer {
    const srcURL = `${volume.format}://${volume.url}`;

    const source = {
        url: srcURL,
        transform: SpatialTransformToNeuroglancer(volume.transform, outputDimensions),
        CoordinateSpaceTransform: SpatialTransformToNeuroglancer(volume.transform, outputDimensions)
    };

    const subsources = volume.subsources.map(subsource => {
        return { url: `precomputed://${subsource.url}`, transform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions), CoordinateSpaceTransform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions) }
    });
    let shader: string | undefined = undefined;
    let layer: ImageLayer | SegmentationLayer;
    const color = volume.display_settings.color ?? undefined;
    if (layerType === 'image') {    
        shader = makeShader(volume.display_settings, volume.sample_type);
        layer = {type: 'image', tab: 'rendering',
            name: volume.name,
            source: source,
            opacity: 0.75,
            blend: 'additive',
            shader: shader}
    }
    else  {
            layer = {type: 'segmentation', tab: 'source',
                pick: true,
                name: volume.name,
                source: [source, ...subsources],
                hideSegmentZero: true,
                segmentDefaultColor: color};
    }
    return layer
}


export async function getDatasets(apiUrl: string): Promise<IDataset[]> {
    return getObjectFromJSON<IDataset[]>(new URL("datasets", apiUrl));
}

export interface IFoob extends IDataset {
    tags: OSet<ITag>
    volume_map: Map<string, IVolume>
    space: CoordinateSpace
    thumbnailURL: string
}


export async function makeDatasets(metadataEndpoint: string): Promise<Map<string, IFoob>> {
    const datasets = await getDatasets(metadataEndpoint);
    const result = new Map()
    for (let dataset of datasets) {
        result.set(dataset.name, {
            ...dataset,
            volume_map: new Map(dataset.volumes.map(v => [v.name, v])),
            space: outputDimensions,
            tags: makeTags(dataset, resolutionTagThreshold),
            thumbnailURL: ''
        });
        console.log(dataset.views)
    }
    return result
}