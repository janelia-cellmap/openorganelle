import React, { useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import "./Organelles.css";
import { AppContext } from "../context/AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import { outputDimensions, makeNeuroglancerUrl } from "../api/neuroglancer";
import { View } from "../types/datasets";
import { useQuery } from "react-query";
import { Box, Card, CardActionArea, CardContent, CardMedia, createStyles, makeStyles, Theme } from "@material-ui/core";
import { fetchViews } from "../api/views";
// import BrokenImage from "../broken_image_24dp.svg";



const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    viewCard: {
      padding: theme.spacing(2),
      maxWidth: "256px",
      textAlign: "left",
      color: theme.palette.text.secondary,
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      margin: theme.spacing(1)
    },
    viewThumbnail: {
      width: "256px",
      height: "256px"
    },
    viewCardDescriptionText: {
      fontStyle: "italic"
    }
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
/*
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
*/
interface OrganelleEntryProps {
  name: string
  views: View[]
}

export function ViewCard({view} : {view: View}) {
  const classes = useStyles();
  const { appState } = useContext(AppContext);
  
  const neuroglancerUrl = makeNeuroglancerUrl({position: view.position ?? undefined,
                                               scale: view.scale ?? undefined,
                                               orientation: view.orientation ?? undefined,
                                               images: view.images,
                                               outputDimensions, 
                                               host: appState.neuroglancerAddress})
  return <Card className={classes.viewCard}>
    <CardActionArea href={neuroglancerUrl}>
    <CardMedia component="img" className={classes.viewThumbnail} image={view.thumbnailUrl ?? undefined} alt="Preview image of the view"/>
    <CardContent>
      <Typography component={"div"}>
        {view.name}
      </Typography>
      <Typography>Dataset: {view.datasetName}</Typography>
      <Typography>Coordinates: {view.position}</Typography>
      <Typography variant={"subtitle1"} className={classes.viewCardDescriptionText}>{view.description === '' ? "No description provided" : view.description}</Typography>
    </CardContent>
    </CardActionArea>
  </Card>
}

export function OrganelleEntry({name, views}: OrganelleEntryProps){
  console.log(views)
  return <div>
        <Grid container direction="row">
          {views.map((v, idx) => {
            <Grid item key={idx}>
            <ViewCard view={v}/>
          </Grid>
          })}
        </Grid>
      </div>
}


export default function Organelles() {
  const { isLoading, data, error } = useQuery('views', async () => fetchViews());
  if (isLoading) {return (
    <div>
      <CircularProgress />
    </div>
  );}
  if (error) {return <>There was an error fetching view metadata.</>}
  
  
  const viewsByTag = data?.reduce((previous, current) => {
    if (current.images.length > 0) {
    current.tags.forEach((t) => {
      const val = previous.get(t)
      if (val === undefined) {previous.set(t, [current])}
      else {previous.set(t, [...val, current])}
    })
  }
  else {console.log(`The following view is missing its images: ${JSON.stringify(current)}`)}
    return previous
  }, new Map<string, View[]>)

  return <div>
    <OrganelleEntry name={"Centrosome"} views={viewsByTag!.get('cent')!}/>
    </div>
}

