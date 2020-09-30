import {
  urlSafeStringify,
  encodeFragment,
  CoordinateSpaceTransform,
  CoordinateSpace,
  ViewerState,
  ImageLayer,
  LayerDataSource,
} from "@janelia-cosem/neuroglancer-url-tools";
import { s3ls, getObjectFromJSON, bucketNameToURL } from "./datasources";
import * as Path from "path";
import {DatasetDescription} from "./dataset_description"
const IMAGE_DTYPES = ['int8', 'uint8', 'uint16'];
const SEGMENTATION_DTYPES = ['uint64'];
type LayerTypes = 'image' | 'segmentation' | 'annotation' | 'mesh';

type VolumeStores = "n5" | "precomputed" | "zarr";
export type ContentType = "em" | "segmentation";

interface DisplaySettings {
  contrastMin: number;
  contrastMax: number;
  gamma: number;
  invertColormap: bool;
  color: string;
}

export class DatasetView {
    constructor(
    public name: string, 
    public description: string, 
    public position?: number, 
    public scale?: number, 
    public volumeKeys: string[]){
        
        this.name = name;
        this.description = description;

        if (position === null) {this.position = undefined}
        else (this.position = position)

        if (scale === null) {this.scale = undefined}
        else (this.scale = scale)

        this.volumeKeys = volumeKeys;
    }
  }

interface DatasetIndex {
  name: string;
  volumes: { [key: string]: VolumeMeta };
  views: DatasetView[]
}

interface SpatialTransform {
  axes: string[];
  units: string[];
  translate: number[];
  scale: number[];
}

interface VolumeMeta {
  name: string;
  dataType: string;
  dimensions: number[];
  transform: SpatialTransform;
  contentType: ContentType;
  description: string;
  alignment: string;
  roi: Array<any>;
  tags: Array<any>;
  displaySettings: DisplaySettings;
  store: VolumeStores;
}

interface N5PixelResolution {
  dimensions: number[];
  unit: string;
}

interface N5ArrayAttrs {
    name: string
    dimensions: number[]
    dataType: string
    pixelResolution: N5PixelResolution
    offset?: number[]
}

interface NeuroglancerPrecomputedScaleAttrs {
  chunk_sizes: number[];
  encoding: string;
  key: string;
  resolution: number[];
  size: number[];
  voxel_offset: number[];
  jpeg_quality?: number;
}

interface NeuroglancerPrecomputedAttrs {
    at_type: string
    data_type: string
    type: string
    scales: NeuroglancerPrecomputedScaleAttrs[]
    num_channels: number
}

const displayDefaults: DisplaySettings = {
  contrastMin: 0,
  contrastMax: 1,
  gamma: 1,
  invertColormap: false,
  color: "white",
};

// one nanometer, expressed as a scaled meter
const nm: [number, string] = [1e-9, "m"];

// the axis order for neuroglancer is x y z
const axisOrder = new Map([
  ["x", 0],
  ["y", 1],
  ["z", 2],
]);

// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
const outputDimensions: CoordinateSpace = { x: nm, y: nm, z: nm };

function makeShader(shaderArgs: DisplaySettings, contentType: ContentType): string{
    switch (contentType) {
    case 'em':
        return `#uicontrol float min slider(min=0, max=1, step=0.001, default=${shaderArgs.contrastMin})
                #uicontrol float max slider(min=0, max=1, step=0.001, default=${shaderArgs.contrastMax})
                #uicontrol float gamma slider(min=0, max=3, step=0.001, default=${shaderArgs.gamma})
                #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invertColormap? 1: 0})
                #uicontrol vec3 color color(default="${shaderArgs.color}")
                float inverter(float val, int invert) {return 0.5 + ((2.0 * (-float(invert) + 0.5)) * (val - 0.5));}
                float normer(float val) {return (clamp(val, min, max) - min) / (max-min);}
                void main() {emitRGB(color * pow(inverter(normer(toNormalized(getDataValue())), invertColormap), gamma));}`;
    case "segmentation":
      return `#uicontrol vec3 color color(default="${shaderArgs.color}")
                void main() {emitRGB(color * ceil(float(getDataValue().value[0]) / 4294967295.0));}`;
  }
  return "";
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
        public store: VolumeStores,
        public contentType: ContentType,
    ) {
        this.path = path;
        this.name = name;
        this.dtype = dtype;
        this.dimensions = dimensions;
        this.origin = origin;
        this.gridSpacing = gridSpacing;
        this.unit = unit;
        this.displaySettings = displaySettings;
        this.store = store;
        this.contentType = contentType;
     }

    // Convert n5 attributes to an internal representation of the volume
    // todo: remove handling of spatial metadata, or at least don't pass it on to the neuroglancer
    // viewer state construction

    static fromVolumeMeta(outerPath:string, innerPath: string, volumeMeta: VolumeMeta): Volume {
        // convert relative path to absolute path
        //const absPath = Path.resolve(outerPath, innerPath);
        const absPath = new URL(outerPath);
        absPath.pathname = Path.resolve(absPath.pathname, innerPath);
        // reorder the transform parameters as needed
        const axisIndices: Array<any> = volumeMeta.transform.axes.map(v => axisOrder.get(v));
        const reorder = (arg: Array<any>) => axisIndices.map(v => arg[v])
        return new Volume(absPath.toString(),
                         volumeMeta.description,
                         volumeMeta.dataType,
                         reorder(volumeMeta.dimensions),
                         reorder(volumeMeta.transform.translate),
                         reorder(volumeMeta.transform.scale),
                         reorder(volumeMeta.transform.units)[0],
                         volumeMeta.displaySettings,
                         volumeMeta.store,
                         volumeMeta.contentType)
    }

    toLayer(layerType: LayerTypes): ImageLayer {
        const srcURL = `${this.store}://${this.path}`;
        const inputDimensions: CoordinateSpace = {
            x: [1e-9 * this.gridSpacing[0], "m"],
            y: [1e-9 * this.gridSpacing[1], "m"],
            z: [1e-9 * this.gridSpacing[2], "m"]
        };
        const transform: CoordinateSpaceTransform = {matrix:
            [
                [1, 0, 0, this.origin[0]],
                [0, 1, 0, this.origin[1]],
                [0, 0, 1, this.origin[2]]
            ],
            outputDimensions: outputDimensions,
            inputDimensions: inputDimensions}

        const source: LayerDataSource = {url: srcURL,
                                        CoordinateSpaceTransform: transform};
        let shader = '';
        if (SEGMENTATION_DTYPES.includes(this.dtype)){
            shader = makeShader(this.displaySettings, 'segmentation');
        }
        else if (IMAGE_DTYPES.includes(this.dtype)) {
            shader = makeShader(this.displaySettings, 'em');
        }
        else {
            console.log(`Datatype ${this.dtype} not recognized`)
        }
        const layer = new ImageLayer('rendering',
                               undefined,
                               undefined,
                               source,
                               0.75,
                               'additive',
                               shader,
                               undefined,
                               undefined);
        layer.name = this.name;
        return layer;
    }
}

// a collection of volumes, i.e. a collection of ndimensional arrays
export class Dataset {
    public key: string;
    public space: CoordinateSpace;
    public volumes: Map<string, Volume>;
    public description: DatasetDescription
    public thumbnailPath: string
    public views: DatasetView[]
    constructor(key: string, space: CoordinateSpace, volumes: Map<string, Volume>, description: DatasetDescription,
    thumbnailPath: string, views: DatasetView[]) {
        this.key = key;
        this.space = space;
        this.volumes = volumes;
        this.description = description;
        this.thumbnailPath = thumbnailPath;
        this.views = views;
    }

    makeNeuroglancerViewerState(view: DatasetView): string {        
        const layers = [...this.volumes.keys()].filter(a => view.volumeKeys.includes(a)).map(a => this.volumes.get(a).toLayer('image'));
        // hack to post-hoc adjust alpha if there is only 1 layer selected
        if (layers.length  === 1) {layers[0].opacity = 1.0}
        const viewerPosition = view.position;
        let crossSectionScale = view.scale;
        const projectionOrientation = undefined;
        const crossSectionOrientation = undefined;
        const projectionScale = 65536;
        if (crossSectionScale === undefined) {
          crossSectionScale = 50.0;
        }
        // the first layer is the selected layer; consider making this a kwarg
        const selectedLayer = {'layer': layers[0].name, 'visible': true};

        const vState = new ViewerState(
            outputDimensions,
            viewerPosition,
            layers,
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
  }


async function getDatasetKeys(bucket: string): Promise<string[]> {
    // get all the folders in the bucket
    let datasetKeys = (await s3ls(bucket, '', '/', '', false)).folders;
    //remove trailing "/" character
    datasetKeys = datasetKeys.map((k) => k.replace(/\/$/, ""));
    return datasetKeys
}

async function getDatasetIndex(
  bucket: string,
  datasetKey: string
): Promise<DatasetIndex> {
  const bucketURL = bucketNameToURL(bucket);
  const indexFile = `${bucketURL}/${datasetKey}/index.json`;
  return getObjectFromJSON(indexFile);
}

async function getDescription(
  bucket: string,
  key: string
): Promise<DatasetDescription> {
  const bucketURL = bucketNameToURL(bucket);
  const descriptionURL = `${bucketURL}/${key}/README.json`;
  return getObjectFromJSON(descriptionURL);
}

export async function makeDatasets(bucket: string): Promise<Map<string, Dataset>> {
    // get the keys to the datasets
    const datasetKeys: string[] = await getDatasetKeys(bucket);
    // Get a list of volume metadata specifications, represented instances of Map<string, VolumeMeta>
    const datasets: Map<string, Dataset> = new Map();
    for (const key of datasetKeys) {
        const outerPath: string = `${bucketNameToURL(bucket)}/${key}`;
        const description = await getDescription(bucket, key);
        const thumbnailPath: string =  `${outerPath}/thumbnail.jpg`
        const index = await getDatasetIndex(bucket, key);
        const views: DatasetView[] = index.views.map(v => new DatasetView(v.name, v.description, v.position, v.scale, v.volumeKeys));

        if (index !== undefined){
            try {
            const volumeMeta = new Map(Object.entries(index.volumes));
            const volumes: Map<string, Volume> = new Map();
            volumeMeta.forEach((v,k) => volumes.set(k, Volume.fromVolumeMeta(outerPath, k, v)));
            datasets.set(key, new Dataset(key, outputDimensions, volumes, description, thumbnailPath, views));
        }
        catch (error) {
            console.log(error)
        }
        }
        else {console.log(`Could not load index.json from ${outerPath}`)}
    }
    return datasets
}
