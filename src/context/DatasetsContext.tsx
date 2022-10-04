import {createContext, useContext, useEffect, useReducer } from 'react'
import React from 'react'
import {components} from "../api/datasets_api"
import { getObjectFromJSON } from '../api/dataset_metadata'
import { OSet } from '../api/tagging'
import { DatasetTag } from '../api/datasets'

type Action = {type: 'set-datasets', payload: any}
type Dispatch = (action : Action) => void

type Dataset = components["schemas"]["Dataset"]
export type TaggedDataset = Dataset & {tags: OSet<DatasetTag>}

type DatasetsState = {api: string
                     datasets: Map<string, TaggedDataset>
                     }

const initialState = {api: 'https://fct5d83geg.execute-api.us-east-1.amazonaws.com/api/v1/datasets/',
                      datasets: new Map()}

const DatasetsContext = createContext<
{state: DatasetsState, dispatch: Dispatch} | undefined>(undefined)

const resolutionTagThreshold = 6;
function makeTags({acquisition, institutions, sample, software_availability}: Dataset): OSet<DatasetTag> {
    const tags: OSet<DatasetTag> = new OSet();
    let latvox = undefined;
    if (acquisition !== undefined) {
    if (acquisition.institution !== undefined) {
        tags.add({value: acquisition?.institution, category: 'Acquisition institution'});
        const axvox = acquisition.grid_spacing.values.z
        if (axvox !== undefined) {
          let value = ''
          if (axvox <= resolutionTagThreshold)
          {value = `<= ${resolutionTagThreshold} nm`}
          else {
            value = `> ${resolutionTagThreshold} nm`
          }
          tags.add({value: value, category: 'Axial voxel size'});
        }
        if ((acquisition.grid_spacing.values.y !== undefined) || (acquisition.grid_spacing.values.x !== undefined)) {
         latvox =  Math.min(acquisition.grid_spacing.values.y, acquisition.grid_spacing.values.x!);
         tags.add({value: latvox.toString(), category: 'Lateral voxel size'});
        }
    }
}
    for (let val of institutions) {tags.add({value: val, category: 'Contributing institution'})}
    if (sample !== undefined) {
    for (let val of sample.organism) {tags.add({value: val, category: 'Sample: Organism'})}
    for (let val of sample.type) {tags.add({value: val, category: 'Sample: Type'})}
    for (let val of sample.subtype) {tags.add({value: val, category: 'Sample: Subtype'})}
    for (let val of sample.treatment) {tags.add({value: val, category: 'Sample: Treatment'})}
    }
    tags.add({value: software_availability, category: 'Software Availability'});
    return tags
  }

function datasetsReducer(state: DatasetsState, action: Action) {
    switch (action.type) {
        case 'set-datasets': {
            return {...initialState, datasets: action.payload}
        }
}
}

function setDatasets(data: Map<string, Dataset>): Action {
    return {
    type: 'set-datasets',
    payload: data}
}

export async function getDatasets(metadataEndpoint: string): Promise<Map<string, Dataset>> {
    const datasets = await getObjectFromJSON<Dataset[]>(new URL(metadataEndpoint));
    const taggedDatasets = datasets.map((d) => {
        return {...d, tags: makeTags(d)}
        })
    return new Map<string, TaggedDataset>(taggedDatasets.map((d) => [d.name, d]));
  }

export function DatasetsProvider({children}: any) {
    const [state, dispatch] = useReducer(datasetsReducer, initialState)
    useEffect(() => {
        async function fetchData() {
            console.log('fetching...')
            const data = await getDatasets(state.api);
            dispatch(setDatasets(data!))
        }
        fetchData();
    }, [])
    const value = {state, dispatch}
    return <DatasetsContext.Provider value={value}>{children}</DatasetsContext.Provider>
}

export function useDatasets() {
    const context = useContext(DatasetsContext)
    if (context === undefined) {
        throw new Error('useDatasets must be used within a DatasetsProvider')
    }
    return context
}