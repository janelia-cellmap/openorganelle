import React, { useEffect, useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AnalysisResults from "./AnalysisResults";
import cypherBuilder from "../utils/cypherBuilder";

const defaultMeasurementOptions = [
  { value: "surfaceArea", label: "Surface Area (nm^2)" },
  { value: "volume", label: "Volume (nm^3)" },
  { value: "ID", label: "ID" }
];

const dataSets = [
  { value: "jrc_hela-2", label: "Interphase HeLa cell (jrc_hela-2)" },
  { value: "jrc_hela-3", label: "Interphase Hela cell (jrc_hela-3)" },
  { value: "jrc_macrophage-2", label: "Macrophage cell (jrc_macrophage-2)" },
  { value: "jrc_jurkat-1", label: "Immortalized T-Cells (jrc_jurkat-1)" }
];

const measurement = "";

const dataSetItems = dataSets.map(dataset => (
  <MenuItem key={dataset.value} value={dataset.value}>
    {dataset.label}
  </MenuItem>
));

const organelleNames = [
  { value: "endo", label: "Endosome" },
  { value: "er", label: "ER" },
  { value: "golgi", label: "Golgi" },
  { value: "mt", label: "Microtubule" },
  { value: "mito", label: "Mitochondria" },
  { value: "nucleus", label: "Nucleus" },
  { value: "er-periph", label: "Peripheral ER" },
  { value: "pm", label: "Plasma Membrane" },
  { value: "vesicle", label: "Vesicle" }
];

const organelleItems = organelleNames.map(organelle => (
  <MenuItem key={organelle.value} value={organelle.value}>
    {organelle.label}
  </MenuItem>
));

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  }
}));

function reducer(state: any, action: any) {
  let { measurements } = state;
  switch (action.type) {
    case "setDataset":
      // if machrophage dataset selected remove length from measurements
      if (action.payload === 'jrc_macrophage-2') {
        measurements = measurements.filter((m: string) => m !== 'length');
      }
      const updated = { ...state, dataset: action.payload, measurements };
      return updated;
    case "setMeasurements":
      return { ...state, measurements: action.payload };
    case "setOrganelles":
      // limit the number of organelles chosen to two.
      if (action.payload.length > 2) {
        return state;
      }
      // if mitochondria is not selected remove length from measurements
      if (action.payload.indexOf('mito') < 0) {
        measurements = measurements.filter((m: string) => m !== 'length');
      }
      // if ER is not selected, make sure to remove planarity from measurements
      if (action.payload.indexOf("er") < 0 || action.payload.length <= 1) {
        measurements = measurements.filter((m: string) => m !== 'planarity');
      }
      const updatedOg = { ...state, organelles: action.payload, measurements };
      return updatedOg;
    default:
      throw new Error();
  }
}

const initialState = {
  dataset: "",
  organelles: [],
  measurements: []
};

export default function Analysis() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [measurementOptions, setMeasurementOptions] = useState(
    defaultMeasurementOptions
  );

  useEffect(() => {
    const updatedOptions = [...defaultMeasurementOptions];
    // length measurement is only for mitochondria in any dataset apart from
    // macrophage
    if (
      state.organelles.indexOf("mito") >= 0 &&
      state.dataset !== "jrc_macrophage-2"
    ) {
      updatedOptions.push({ value: "length", label: "Length (nm)" });
    }

    if (state.organelles.indexOf("er") >= 0 && state.organelles.length > 1) {
      updatedOptions.push({ value: "planarity", label: "Planarity (0-1)" });
    }
    setMeasurementOptions(updatedOptions);
  }, [state]);

  const measurementItems = measurementOptions.map(measurement => (
    <MenuItem key={measurement.value} value={measurement.value}>
      {measurement.label}
    </MenuItem>
  ));

  return (
    <div className="content">
      <p>Analysis portal</p>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Dataset Selection ({dataSetItems.length})</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state.dataset}
          onChange={e =>
            dispatch({ type: "setDataset", payload: e.target.value })
          }
        >
          {dataSetItems}
        </Select>
      </FormControl>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">
          Organelle Selection ({organelleItems.length})
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple
          value={state.organelles}
          onChange={e =>
            dispatch({ type: "setOrganelles", payload: e.target.value })
          }
        >
          {organelleItems}
        </Select>
      </FormControl>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">
          Measurement Selection ({measurementItems.length})
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple
          value={state.measurements}
          onChange={e =>
            dispatch({ type: "setMeasurements", payload: e.target.value })
          }
        >
          {measurementItems}
        </Select>
      </FormControl>

      <AnalysisResults cypher={cypherBuilder(state)} />
    </div>
  );
}
