import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import { getContacts } from "../utils/cypherBuilder";
import { organelleNames } from "../utils/organelles";
import { useQuery } from "../utils/customHooks";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  }
}));

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

const defaultMeasurementOptions = [
  { value: "surfaceArea", label: "Surface Area (nm^2)" },
  { value: "volume", label: "Volume (nm^3)" },
  { value: "ID", label: "ID" }
];

const organelleItems = organelleNames.map(organelle => (
  <MenuItem key={organelle.value} value={organelle.value}>
    {organelle.label}
  </MenuItem>
));

const initialOrganelleBoptions: any[] = [];

export default function AnalysisForm() {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();

  // values chosen by the user that will be passed on to the search
  const [dataset, setDataset] = useState(query.get("ds") || "");
  const [organelleA, setOrganelleA] = useState(query.get("oa") || "");
  const [organelleB, setOrganelleB] = useState(query.get("ob") || "");
  const [measurements, setMeasurements] = useState<string[]>(
    query.getAll("m") || []
  );

  // options that are set based on the other options chosen.
  const [measurementOptions, setMeasurementOptions] = useState(
    defaultMeasurementOptions
  );

  useEffect(() => {
    const updatedOptions = [...defaultMeasurementOptions];
    // length measurement is only for mitochondria in any dataset apart from
    // macrophage, not connections.
    if (
      organelleA === "mito" &&
      organelleB.length === 0 &&
      dataset !== "jrc_macrophage-2"
    ) {
      updatedOptions.push({ value: "length", label: "Length (nm)" });
    }
    // planarity is only for ER contact sites
    if (
      (organelleA === "er" && organelleB.length > 0) ||
      (organelleB === "er" && organelleA.length > 0)
    ) {
      updatedOptions.push({ value: "planarity", label: "Planarity (0-1)" });
    }
    setMeasurementOptions(updatedOptions);
  }, [organelleA, organelleB, dataset]);

  const measurementItems = measurementOptions.map(measurement => (
    <MenuItem key={measurement.value} value={measurement.value}>
      {measurement.label}
    </MenuItem>
  ));

  // update organelleB choices based on organelleA choice
  const [organelleBoptions, setOrganelleBoptions] = useState(
    initialOrganelleBoptions
  );

  useEffect(() => {
    if (organelleA) {
      // grab the organelle and find all other organelleA that share a connection
      const contacts = getContacts(organelleA);

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
        <MenuItem key="none" value="">
          ---
        </MenuItem>
      );
      setOrganelleBoptions(organelleItems);
    }
  }, [organelleA]);

  const handleDataSetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setDataset(e.target.value as string);
    // if the new value is macrophage, then clear length from selected measurements
    if (e.target.value === "jrc_macrophage-2") {
      setMeasurements(selected => selected.filter(item => item !== "length"));
    }
  };

  const handleOrganelleChange = (
    e: React.ChangeEvent<{ value: unknown }>,
    organelleType: string
  ) => {
    if (organelleType === "a") {
      setOrganelleA(e.target.value as string);
      setOrganelleB("");
      // if the new value is not mito, or this is a connection query,
      // then clear length from selected measurements
      if (e.target.value !== "mito" || organelleB !== "") {
        setMeasurements(selected => selected.filter(item => item !== "length"));
      }
      // planarity is only for ER contact sites
      if (
        (e.target.value !== "er" && organelleB !== "er") ||
        organelleB === ""
      ) {
        setMeasurements(selected =>
          selected.filter(item => item !== "planarity")
        );
      }
    } else {
      setOrganelleB(e.target.value as string);
      // planarity is only for ER contact sites
      if (
        e.target.value === "" ||
        (organelleA !== "er" && e.target.value !== "er")
      ) {
        setMeasurements(selected =>
          selected.filter(item => item !== "planarity")
        );
      }
    }
  };

  const handleMeasurementChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setMeasurements(e.target.value as string[]);
  };

  const handleSubmit = () => {
    // change the url to reflect the updated selections.
    query.set("ds", dataset);
    query.set("oa", organelleA);
    query.set("ob", organelleB);
    // clear out any individual id selections that were made.
    query.delete('id');
    query.delete('m');
    measurements.forEach(measurement => {
      query.append("m", measurement)
    });
    history.push({
      pathname: "",
      search: query.toString()
    });
  };

  return (
    <>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="datasetLabel">
          Dataset Selection ({dataSetItems.length})
        </InputLabel>
        <Select
          labelId="datasetLabel"
          id="dataset"
          value={dataset}
          onChange={handleDataSetChange}
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
          value={organelleA}
          onChange={e => handleOrganelleChange(e, "a")}
        >
          {organelleItems}
        </Select>
      </FormControl>

      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="organelleBLabel">
          Optional Connected Organelle ({organelleBoptions.length})
        </InputLabel>
        <Select
          labelId="organelleBLabel"
          id="organelleB"
          value={organelleB}
          onChange={e => handleOrganelleChange(e, "b")}
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
          value={measurements}
          onChange={handleMeasurementChange}
        >
          {measurementItems}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Search
      </Button>
    </>
  );
}
