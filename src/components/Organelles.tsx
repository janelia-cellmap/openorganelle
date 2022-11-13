import React, { useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "./Organelles.css";
import { AppContext } from "../context/AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ImageLayer } from "@janelia-cosem/neuroglancer-url-tools";
import { makeLayer, makeNeuroglancerViewerState, outputDimensions, viewToNeuroglancerUrl } from "../api/neuroglancer";
import { fetchDatasets } from "../api/datasets";
import { View } from "../types/datasets";
import { useQuery } from "react-query";
import ReactJson from 'react-json-view'
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, createStyles, makeStyles, Theme } from "@material-ui/core";
import { fetchViews } from "../api/views";
import { Database } from "../types/database";
// import BrokenImage from "../broken_image_24dp.svg";



const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    viewCard: {
      padding: theme.spacing(2),
      maxWidth: "360px",
      textAlign: "left",
      color: theme.palette.text.secondary,
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      margin: theme.spacing(1)
    },
  })
);

type Organelles = "cent"
                  | "chrom" 
                  | "echrom"
                  | "hchrom"
                  | "er" 
                  | "eres"
                  | "endo"
                  | "ecs"
                  | "golgi"
                  | "ld"
                  | "lyso"
                  | "mt"
                  | "mito"
                  | "ne"
                  | "np"
                  | "nucleolus"
                  | "nucleus"
                  | "pm"
                  | "ribo"
                  | "vesicle"

const organelles: Record<Organelles, string> = {
  cent: "Centrosome",
  chrom: "Chromatin",
  echrom: "Euchromatin",
  hchrom: "Heterochromatin",
  er: "Endoplasmic Reticulum",
  eres: "Endoplasmic Reticulum Exit Site",
  endo: "Endosomal Network",
  ecs: "Extracellular Space",
  golgi: "Golgi",
  ld : "Lipid Droplet",
  lyso: "Lysosome",
  mt: "Microtubule",
  mito: "Mitochondria",
  ne: "Nuclear Envelope",
  np: "Nuclear Pore",
  nucleolus: "Nucleolus",
  nucleus: "Nucleus",
  pm: "Plasma Membrane",
  ribo: "Ribosome",
  vesicle: "Vesicle"
}

const contactSites = [
  ["ER - Ribosome Contact Sites", "er_ribo_contacts"],
  ["ER - Golgi Contact Sites", "er_golgi_contacts"],
  ["ER - Mito Contact Sites", "er_mito_contacts"],
  ["Endosome - ER Contact Sites", "endo_er_contacts"],
  ["ER - Plasma Membrane Contat Sites", "er_pm_contacts"],
  ["ER - Vesicle Contact Sites", "er_vesicle_contacts"],
  ["Golgi - Vesicle Contact Sites", "golgi_vesicle_contacts"],
  ["Endosome - Golgi Contact Sites", "endo_golgi_contacts"],
  ["Mito - Plasma Membrane Contact Sites", "mito_pm_contacts"],
  ["ER - Microtubule Contact Sites", "er_mt_contacts"],
  ["Endosome - Microtubule Contact Sites", "endo_mt_contacts"],
  ["Golgi - Microtubule Contact Sites", "golgi_mt_contacts"],
  ["Mitochondria - Microtubule Contact Sites", "mito_mt_contacts"],
  ["Microtubule - Nucleus Contact Sites", "mt_nucleus_contacts"],
  ["Microtubule - Vesicle Contact Sites", "mt_vesicle_contacts"],
  ["Microtubule - Plasma Membrane Contact Sites", "mt_pm_contacts"],
];

interface OrganelleEntryProps {
  name: string
  views: View[]
}

export function ViewCard({view} : {view: View}) {
  const classes = useStyles();
  const { appState } = useContext(AppContext);
  const { isLoading, data, error } = useQuery('views', async () => fetchViews());
  if (isLoading) {
    return <>Loading views....</>
  }
  if (error) {
    return <>Error loading views: {(error as Error).message}</>
  }

  
  const neuroglancerUrl = viewToNeuroglancerUrl(view, outputDimensions, appState.neuroglancerAddress)
  return <Card className={classes.viewCard}>
    <CardActionArea href={neuroglancerUrl}>
    <CardMedia component="img" height="360" image={view.thumbnailUrl} alt="Preview image of the view"/>
    <CardContent>
      <Typography component={"div"}>
        {view.name}
      </Typography>
      <Typography variant={"subtitle1"}>{view.description === '' ? "No description provided" : view.description}</Typography>
    </CardContent>
    </CardActionArea>
  </Card>
}

export function OrganelleEntry({name, views}: OrganelleEntryProps){
  return <div>
    <Typography>
      {name}
      </Typography>
      <Box>
        <Grid container>
        {views.map((v) => {
          <Grid item>
          <ViewCard view={v}/></Grid>
          })}
        </Grid>
      </Box>
  </div>
}


export default function Organelles() {
  const { isLoading, data, error } = useQuery('datasets', async () => fetchDatasets());
  if (isLoading) {return (
    <div>
      <CircularProgress />
    </div>
  );}
  if (error) {return <>There was an error fetching dataset metadata.</>}
  
  const allTaggedViews: Map<string, View[]> = new Map();
  
  data?.forEach((value) => {
      value.views.filter((v) => {
      return (v.tags !== undefined) && (v.tags.length > 0)
    })
    .forEach(v => {
      v.tags!.forEach(tag => {
        const entry = allTaggedViews.get(tag)
        if (entry === undefined) {
          allTaggedViews.set(tag, [])
        }
        else {
          entry.push(v)
         allTaggedViews.set(tag, entry)
        }
  })
})
})
  const sample = allTaggedViews.get('cent')![0]!
  return <div><ViewCard view={sample}/></div>
  
  /*
  return <Grid container>
    {Array.from(allTaggedViews.entries()).map(([key, value], idx) => {return <Grid item key={idx}><OrganelleEntry name={key} views={value}/></Grid>})}
  </Grid>
  */
}

