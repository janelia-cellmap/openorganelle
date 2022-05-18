import {components} from "./schema"
import {getObjectFromJSON} from "./dataset_metadata"
import { makeDatasets } from "./datasets";

type IDataset = components["schemas"]["Dataset"]

export async function getDatasets(apiUrl: string): Promise<IDataset[]> {
    return getObjectFromJSON<IDataset[]>(new URL("datasets", apiUrl));
  }

export async function makeDatasets(metadataEndpoint: string): Promise<Map<string, IDataset>> {
    const datasets = await getDatasets(metadataEndpoint);
    const result = new Map()
    for (let dataset of datasets) {
        result.set(dataset.name, dataset);
    }
    return result
}