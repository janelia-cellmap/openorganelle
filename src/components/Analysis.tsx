import React, { useEffect, useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AnalysisResults from "./AnalysisResults";
import cypherBuilder, { getContacts } from "../utils/cypherBuilder";

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
  { value: "ribo", label: "Ribosome" },
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
      if (action.payload === "jrc_macrophage-2") {
        measurements = measurements.filter((m: string) => m !== "length");
      }
      const updated = { ...state, dataset: action.payload, measurements };
      return updated;
    case "setMeasurements":
      return { ...state, measurements: action.payload };
    case "setOrganelles":
      // if mitochondria is not selected remove length from measurements
      if (action.payload.indexOf("mito") < 0) {
        measurements = measurements.filter((m: string) => m !== "length");
      }
      // if ER is not selected, make sure to remove planarity from measurements
      if (action.payload.indexOf("er") < 0 || action.payload.length <= 1) {
        measurements = measurements.filter((m: string) => m !== "planarity");
      }
      const updatedOg = {
        ...state,
        organelleA: action.payload,
        organelleB: "",
        measurements
      };
      return updatedOg;
    case "setOrganelleB":
      const updatedOgB = { ...state, organelleB: action.payload, measurements };
      return updatedOgB;
    default:
      throw new Error();
  }
}

const initialState = {
  dataset: "",
  organelleA: "",
  organelleB: "",
  measurements: []
};

const initialOrganelleBoptions: any[] = [];

export default function Analysis() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [measurementOptions, setMeasurementOptions] = useState(
    defaultMeasurementOptions
  );

  const [organelleBoptions, setOrganelleBoptions] = useState(
    initialOrganelleBoptions
  );

  useEffect(() => {
    const updatedOptions = [...defaultMeasurementOptions];
    // length measurement is only for mitochondria in any dataset apart from
    // macrophage
    if (state.organelleA === "mito" && state.dataset !== "jrc_macrophage-2") {
      updatedOptions.push({ value: "length", label: "Length (nm)" });
    }

    if (state.organelleA === "er" && state.organelleA.length > 1) {
      updatedOptions.push({ value: "planarity", label: "Planarity (0-1)" });
    }
    setMeasurementOptions(updatedOptions);
  }, [state]);

  // update organelleB choices based on organelleA choice
  useEffect(() => {
    if (state.organelleA) {
      // grab the organelle and find all other organelleA that share a connection
      const contacts = getContacts(state.organelleA);

      const organelleItems = contacts.map(organelle => {
        const organelleMeta = organelleNames.filter(
          org => org.value === organelle
        )[0];
        return (
          <MenuItem key={organelleMeta.value} value={organelleMeta.value}>
            {organelleMeta.label}
          </MenuItem>
        );
      });
      organelleItems.unshift(
        <MenuItem key="none" value="">---</MenuItem>
      );
      setOrganelleBoptions(organelleItems);
    }
  }, [state]);

  const measurementItems = measurementOptions.map(measurement => (
    <MenuItem key={measurement.value} value={measurement.value}>
      {measurement.label}
    </MenuItem>
  ));

  const cypher = cypherBuilder(state);

  return (
    <div className="content">
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="datasetLabel">
          Dataset Selection ({dataSetItems.length})
        </InputLabel>
        <Select
          labelId="datasetLabel"
          id="dataset"
          value={state.dataset}
          onChange={e =>
            dispatch({ type: "setDataset", payload: e.target.value })
          }
        >
          {dataSetItems}
        </Select>
      </FormControl>

      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="organelleALabel">
          Organelle Selection ({organelleItems.length})
        </InputLabel>
        <Select
          labelId="organelleALabel"
          id="organelleA"
          value={state.organelleA}
          onChange={e =>
            dispatch({ type: "setOrganelles", payload: e.target.value })
          }
        >
          {organelleItems}
        </Select>
      </FormControl>

      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="organelleBLabel">
          Organelle Selection ({organelleBoptions.length})
        </InputLabel>
        <Select
          labelId="organelleBLabel"
          id="organelleB"
          value={state.organelleB}
          onChange={e =>
            dispatch({ type: "setOrganelleB", payload: e.target.value })
          }
        >
          {organelleBoptions}
        </Select>
      </FormControl>

      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="measurementLabel">
          Measurement Selection ({measurementItems.length})
        </InputLabel>
        <Select
          labelId="measurementLabel"
          id="measurement"
          multiple
          value={state.measurements}
          onChange={e =>
            dispatch({ type: "setMeasurements", payload: e.target.value })
          }
        >
          {measurementItems}
        </Select>
      </FormControl>
      {cypher ? (
        <AnalysisResults
          cypher={cypher}
          organelleA={state.organelleA}
          organelleB={state.organelleB}
        />
      ) : (
        ""
      )}
    </div>
  );
}
