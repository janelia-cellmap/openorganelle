import {createContext, useContext, useEffect, useReducer } from 'react'
import React from 'react'
import { TaggedDataset, Dataset, makeTags } from '../api/datasets'
import {getObjectFromJSON} from "../api/util"

type Action = {type: 'set-datasets', payload: Map<string, TaggedDataset>} | {type: 'set-loading', payload: boolean}
type Dispatch = (action : Action) => void

type DatasetsState = {api: string
                      datasetsLoading: boolean
                     datasets: Map<string, TaggedDataset>
                     }

const initialState: DatasetsState = {api: 'https://fct5d83geg.execute-api.us-east-1.amazonaws.com/api/v1/datasets/',
                                     datasetsLoading: false,
                                     datasets: new Map()}

const DatasetsContext = createContext<{state: DatasetsState, dispatch: Dispatch} | undefined>(undefined)

function datasetsReducer(state: DatasetsState, action: Action) {
    switch (action.type) {
        case 'set-datasets': {
            return {...state, datasets: action.payload, datasetsLoading: false}
        }
        case 'set-loading':
            return {...state, datasetLoading: action.payload}
}
}

function setDatasets(data: Map<string, TaggedDataset>): Action {
    return {
    type: 'set-datasets',
    payload: data}
}

function setLoading(data: boolean): Action {
    return {
    type: 'set-loading',
    payload: data}
}

export async function getDatasets(metadataEndpoint: string) {
    const datasets: Dataset[] = await getObjectFromJSON<Dataset[]>(new URL(metadataEndpoint));
    const taggedDatasets = datasets.map((d) => {
        return {...d, tags: makeTags(d)}
        })
    return new Map<string, TaggedDataset>(taggedDatasets.map((d) => [d.name, d]));
  }

export function DatasetsProvider({children}: any) {
    const [state, dispatch] = useReducer(datasetsReducer, initialState)
    useEffect(() => {
        async function fetchData() {
            console.log('begin fetching datasets')
            dispatch(setLoading(true))
            const data = await getDatasets(state.api);
            dispatch(setDatasets(data!))
            console.log('done fetching datasets')
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