import React, { useState } from "react";
import PropTypes from "prop-types";
import {checkWebGL2} from "../api/util"

interface IAppState {
  neuroglancerAddress: string,
  dataBucket: string,
  webGL2Enabled: boolean
}

const AppContext = React.createContext([{}, () => {}]);

const AppProvider = (props: any) => {
  const [state, setState] = useState<IAppState>({
    neuroglancerAddress: "http://neuroglancer-demo.appspot.com/#!",
    dataBucket: 'janelia-cosem-datasets-dev',
    webGL2Enabled: checkWebGL2()
  });
  console.log(state)
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

export {AppContext, AppProvider };
