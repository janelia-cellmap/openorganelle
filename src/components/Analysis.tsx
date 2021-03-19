import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import cypherBuilder from "../utils/cypherBuilder";

const dataSets = [
  { value: "jrc_hela-2", label: "Interphase HeLa cell" },
  { value: "jrc_hela-3", label: "Interphase Hela cell" },
  { value: "jrc_macrophage-2", label: "Macrophage cell" },
  { value: "jrc_jurkat-1", label: "Immortalized T-Cells (Jurkat)" }
];

const measurement = "";

const dataSetItems = dataSets.map(dataset => (
  <MenuItem key={dataset.value} value={dataset.value}>
    {dataset.label}
  </MenuItem>
));


const organelleNames = [
  { value: "endosome", label: "Endosome" },
  { value: "er", label: "ER" },
  { value: "golgi", label: "Golgi" },
  { value: "microtubule", label: "Microtubule" },
  { value: "mitochondria", label: "Mitochondria" },
  { value: "nucleus", label: "Nucleus" },
  { value: "peripheral_er", label: "Peripheral ER" },
  { value: "plasma_membrane", label: "Plasma Membrane" },
  { value: "vesicle", label: "Vesicle" },
];

const organelleItems = organelleNames.map(organelle => (
  <MenuItem key={organelle.value} value={organelle.value}>
    {organelle.label}
  </MenuItem>
));

const measurementOptions = [
  { value: "planarity", label: "Planarity (0-1)"},
  { value: "surfaceArea", label: "Surface Area (nm^2)"},
  { value: "volume", label: "Volume (nm^3)"},
  { value: "length", label: "Length (nm)"},
  { value: "id", label: "ID"},
];

const measurementItems = measurementOptions.map(measurement => (
  <MenuItem key={measurement.value} value={measurement.value}>
    {measurement.label}
  </MenuItem>
));

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  }
}));

export default function Analysis() {
  const [dataset, setDataSet] = useState("");
  const [organelles, setOrganelles] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const classes = useStyles();

  return (
    <div className="content">
      <p>Analysis portal</p>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Dataset Selection</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dataset}
          onChange={(e: any) => setDataSet(e.target.value)}
        >
          {dataSetItems}
        </Select>
      </FormControl>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">
          Organelle Selection
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple
          value={organelles}
          onChange={(e: any) => setOrganelles(e.target.value)}
        >
          {organelleItems}
        </Select>
      </FormControl>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">
          Measurement Selection
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple
          value={measurements}
          onChange={e => setMeasurements(e.target.value)}
        >
          {measurementItems}
        </Select>
      </FormControl>


      <p>execute a query</p>
      {cypherBuilder({dataset, organelles, measurement})}
    </div>
  );
}
