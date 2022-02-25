import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "tss-react/mui";
import { DatasetMetadata} from "../api/dataset_metadata";
import { Hyperlink, UnitfulVector, DOI } from "../api/manifest";
import { Accordion, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface DescriptionPreviewProps {
  datasetMetadata: DatasetMetadata;
  titleLink: string;
}

export interface DescriptionSummaryProps {
  children: any;
  datasetMetadata: DatasetMetadata;
}

export interface DescriptionFullProps {
  s3URL: string;
  bucketBrowseLink: string;
  storageLocation: string;
  datasetMetadata: DatasetMetadata;
}

const useStyles: any = makeStyles()((theme) =>
  ({
    title: {
      color: theme.palette.primary.main
    }
  })
);

interface HyperlinkListProps {
  links: Array<string | Hyperlink>
}

function isHyperlinkOrDOI(val: DOI | Hyperlink): val is Hyperlink {
  return (val as Hyperlink).href !== undefined;
} 

function doiToHyperlink(d: Hyperlink | DOI): Hyperlink{
  if (!isHyperlinkOrDOI(d)) {
    let d_ = d as DOI
    return {href: d_.DOI, title: d_.id}
  }
  else {
    return d as Hyperlink;
  }
}


export function HyperlinkList({links}: HyperlinkListProps) {
  return (<ul>{links.map((link, idx) => {
    let key = "publicationList" + idx;
    let result: React.ReactFragment;
    if (typeof(link) == 'string'){
      result = <li key={key}>{link}</li>
    }
    else {
      result = <li key={key}><a href={link.href}>{link.title}</a></li>
    }
    return result
    
})}</ul>)
} 

function StringifyUnitfulVector(vec: UnitfulVector, decimals: number): string {
  const val_array = [...Object.values(vec.values)].map(v =>
    v.toFixed(decimals)
  );
  const axis_array = [...Object.keys(vec.values)];
  if (val_array.length === 0) {
    return "N/A";
  } else {
    return `${val_array.join(" x ")} (${axis_array.join(", ")})`;
  }
}

export function DatasetDescriptionPreview({
  datasetMetadata
}: DescriptionPreviewProps) {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        {datasetMetadata.title}
      </Typography>
      <p>
        <strong>Acquisition date</strong>: {datasetMetadata.imaging.startDate}
      </p>
      <p>
        <strong>Dataset ID</strong>: {datasetMetadata.id}
      </p>
      <p>
        <strong>Voxel size ({datasetMetadata.imaging.gridSpacing.unit})</strong>
        : {StringifyUnitfulVector(datasetMetadata.imaging.gridSpacing, 1)}
      </p>
      <p>
        <strong>Dimensions ({datasetMetadata.imaging.dimensions.unit})</strong>:{" "}
        {StringifyUnitfulVector(datasetMetadata.imaging.dimensions, 1)}
      </p>
    </Box>
  );
}

export function DatasetAcquisition({
  storageLocation,
  datasetMetadata
}: DescriptionFullProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography variant="h6" className={classes.title}>
        Acquisition details
      </Typography>

          </AccordionSummary>
        <p>
            <strong>Dataset ID</strong>: {datasetMetadata.id}
          </p>
          <p>
            <strong>
              Final voxel size ({datasetMetadata.imaging.gridSpacing.unit})
            </strong>
            : {StringifyUnitfulVector(datasetMetadata.imaging.gridSpacing, 1)}
          </p>
          <p>
            <strong>
              Dimensions ({datasetMetadata.imaging.dimensions.unit})
            </strong>
            : {StringifyUnitfulVector(datasetMetadata.imaging.dimensions, 0)}
          </p>
          <p>
            <strong>Imaging duration (days)</strong>:{" "}
            {datasetMetadata.imaging.duration}
          </p>
          <p>
            <strong>Imaging start date</strong>:{" "}
            {datasetMetadata.imaging.startDate}
          </p>
          <p>
            <strong>Primary energy (EV)</strong>:{" "}
            {datasetMetadata.imaging.primaryEnergy}
          </p>
          <p>
            <strong>Bias (V)</strong>: {datasetMetadata.imaging.biasVoltage}
          </p>
          <p>
            <strong>Imaging current (nA)</strong>:{" "}
            {datasetMetadata.imaging.current}
          </p>
          <p>
            <strong>Scanning speed (MHz)</strong>:{" "}
            {datasetMetadata.imaging.scanRate}
          </p>
          </Accordion>
        </Grid>
        <Grid item xs={6}>
          <p>
            <strong>Dataset URI</strong>: {storageLocation}
          </p>
          <p>
            <strong>DOI</strong>:{" "}
            <HyperlinkList links={datasetMetadata.DOI.map(doiToHyperlink)}/>
          </p>
          <p>
            <strong>Publications</strong>:{" "}
            <HyperlinkList links={datasetMetadata.publications}/>
          </p>
        </Grid>
      </Grid>
    </>
  );
}

export function DatasetDescriptionSummary({
  datasetMetadata,
  children
}: DescriptionSummaryProps) {
  const classes = useStyles();
  return (
    <>
      {children}
      <Typography variant="h6" className={classes.title}>
        {datasetMetadata.title}
      </Typography>
      <p>
        <strong>Sample</strong>: {datasetMetadata.sample.description}
      </p>
      <p>
        <strong>Protocol</strong>: {datasetMetadata.sample.protocol}
      </p>
      <p>
        <strong>Contributions</strong>: {datasetMetadata.sample.contributions}
      </p>
    </>
  );
}
