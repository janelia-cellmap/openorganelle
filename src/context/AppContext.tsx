import React, { useState } from "react";
import PropTypes from "prop-types";
import {checkWebGL2} from "../api/util"
import { Dataset} from "../api/datasets";

export interface ContextProps {
  neuroglancerAddress: string,
  dataBucket: string,
  webGL2Enabled: boolean,
  datasetsLoading: boolean,
  datasets: Map<string, Dataset>
}

interface AppContext {
  appState: ContextProps
  setAppState: (appState: ContextProps) => null | void
}

const contextDefault: ContextProps = {
  neuroglancerAddress: "https://neuroglancer-demo.appspot.com/#!",
  dataBucket: 'janelia-cosem',
  webGL2Enabled: checkWebGL2(),
  datasetsLoading: false,
  datasets: new Map()
}

export const AppContext = React.createContext<AppContext>({
  appState: contextDefault,
  setAppState: () => null,
});

export const AppProvider = (props: any) => {

  const [appState, setAppState] = useState<ContextProps>(contextDefault);
  const { children } = props;
  return (
    <AppContext.Provider value={{appState, setAppState}}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.object.isRequired
}
