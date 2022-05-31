import React, { useState } from "react";
import PropTypes from "prop-types";
import {checkWebGL2} from "../api/util"
import { ITag} from "../api/datasets";
import {components} from "../api/schema"
import { IFoob } from "../api/datasets2";

type IDataset = components["schemas"]["Dataset"]

export interface ContextProps {
  neuroglancerAddress: string,
  metadataEndpoint: string,
  webGL2Enabled: boolean,
  datasetsLoading: boolean,
  datasets: Map<string, IFoob>,
  datasetGrid: boolean,
  showFilters: boolean,
  sortBy: string,
  datasetFilter: Array<ITag> | undefined,
  [key: string]: any
}

interface AppContext {
  appState: ContextProps
  setAppState: (appState: ContextProps) => null | void
  setPermanent: (action: any) => null | void
}

const contextDefault: ContextProps = {
  neuroglancerAddress: "https://neuroglancer-demo.appspot.com/#!",
  metadataEndpoint: 'http://localhost:8001',
  webGL2Enabled: checkWebGL2(),
  datasetsLoading: false,
  datasets: new Map(),
  datasetGrid: true,
  datasetFilter: [],
  showFilters: false,
  sortBy: 'size'
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
