import React, { useState } from "react";
import PropTypes from "prop-types";
import {checkWebGL2} from "../api/util"
import { Dataset} from "../api/datasets";

export interface ContextProps {
  neuroglancerAddress: string,
  dataBucket: string,
  webGL2Enabled: boolean,
  datasetsLoading: boolean,
  datasets: Map<string, Dataset>,
  datasetGrid: boolean,
  [key: string]: any
}

interface AppContext {
  appState: ContextProps
  setAppState: (appState: ContextProps) => null | void
  setPermanent: (action: any) => null | void
}

const contextDefault: ContextProps = {
  neuroglancerAddress: "https://neuroglancer-demo.appspot.com/#!",
  dataBucket: 'janelia-cosem-datasets',
  webGL2Enabled: checkWebGL2(),
  datasetsLoading: false,
  datasets: new Map(),
  datasetGrid: true
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
