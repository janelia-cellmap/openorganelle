import React, { useState } from "react";
import PropTypes from "prop-types";
import {checkWebGL2} from "../api/util"
import {DatasetTag} from "../types/tags";

export interface ContextProps {
  neuroglancerAddress: string,
  metadataEndpoint: string,
  webGL2Enabled: boolean,
  datasetGrid: boolean,
  showFilters: boolean,
  sortBy: string,
  datasetFilter: Array<DatasetTag> | undefined,
  searchFilter: string | null,
  [key: string]: any
}

interface AppContext {
  appState: ContextProps
  setAppState: (appState: ContextProps) => null | void
  setPermanent: (action: any) => null | void
}

const contextDefault: ContextProps = {
  neuroglancerAddress: "https://neuroglancer-demo.appspot.com/#!",
  metadataEndpoint: 'https://github.com/janelia-cosem/fibsem-metadata/blob/stable/api',
  webGL2Enabled: checkWebGL2(),
  datasetGrid: true,
  datasetFilter: [],
  showFilters: false,
  sortBy: 'size',
  searchFilter: ""
}

const allowedPermanent = ['datasetGrid'];

const localStorageProps = JSON.parse(localStorage.getItem("appState") || "{}");

const combinedState = {...contextDefault, ...localStorageProps};

const AppContext = React.createContext<AppContext>({
  appState: combinedState,
  setAppState: () => null,
  setPermanent: () => null,
});

const AppProvider = (props: any) => {
  const [appState, setAppState] = useState<ContextProps>(combinedState);
  const { children } = props;

  const setPermanent = (action: any) => {
    const filteredState = Object.keys(appState)
      .filter(key => allowedPermanent.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: appState[key]
        }
      }, {});
    const updatedState = { ...filteredState, ...action};
    localStorage.setItem("appState", JSON.stringify(updatedState));
    setAppState({ ...appState, ...action });
  }

  return (
    <AppContext.Provider value={{appState, setAppState, setPermanent}}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.object.isRequired
}

export { AppContext, AppProvider };
