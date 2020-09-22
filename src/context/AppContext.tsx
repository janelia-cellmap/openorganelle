import React, { useState } from "react";
import PropTypes from "prop-types";
import {checkWebGL2} from "../api/util"
import { Dataset} from "../api/datasets";

export interface ContextProps {
  neuroglancerAddress: string,
  dataBucket: string,
  webGL2Enabled: boolean,
  datasetsLoading: false,
  datasets: Map<string, Dataset>
}

interface IAppContext {
  appState: ContextProps
  setAppstate: () => null
}

const contextDefault: ContextProps = {
  neuroglancerAddress: "http://neuroglancer-demo.appspot.com/#!",
  dataBucket: 'janelia-cosem-datasets',
  webGL2Enabled: checkWebGL2(),
  datasets: new Map()
}

export const AppContext = React.createContext<IAppContext>({
  appState: contextDefault,
  setAppstate: () => null
});

export const AppProvider = (props: any) => {

  const [state, setState] = useState<ContextProps>(contextDefault);
  const { children } = props;
  return (
    <AppContext.Provider value={[state, setState]}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.object.isRequired
}
