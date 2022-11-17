import React, { useContext } from "react";
import { View } from "../../types/datasets";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Box, Card, CardActionArea, CardMedia, createStyles, makeStyles, Theme } from "@material-ui/core";
import { AppContext } from "../../context/AppContext";
import { outputDimensions, makeNeuroglancerUrl } from "../../api/neuroglancer";
import BrokenImage from "../../broken_image_24dp.svg";
import { OrganelleMetadata } from "../Organelles";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    viewCardCollection: {
      width: "100%",
    },
    viewCard: {
      padding: theme.spacing(2),
      maxWidth: "256px",
      textAlign: "left",
      color: theme.palette.text.secondary,
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      margin: theme.spacing(1)
    },
    viewThumbnailFull: {
      width: "256px",
      height: "256px"
    },
  })
);

export function ViewCard({ view }: { view: View }) {
  const classes = useStyles();
  const { appState } = useContext(AppContext);

  const neuroglancerUrl = makeNeuroglancerUrl({
    position: view.position ?? undefined,
    scale: view.scale ?? undefined,
    orientation: view.orientation ?? undefined,
    images: view.images,
    outputDimensions,
    host: appState.neuroglancerAddress
  })
  return <Card className={classes.viewCard}>
    <CardActionArea href={neuroglancerUrl}>
      <CardMedia component="img" className={classes.viewThumbnailFull} image={view.thumbnailUrl ?? BrokenImage} alt="Preview image of the view" />
    </CardActionArea>
  </Card>
}

export interface OrganelleCardsProps {
  info: OrganelleMetadata
  views: View[]
}

export function OrganelleCardList({info , views }: OrganelleCardsProps) {
  const classes = useStyles();
  return <><Box className={classes.viewCardCollection}>
    <Typography variant="h4">{info.name}</Typography>
    <Grid container direction="row">
      {views.map((v, idx) => {
        return <Grid item key={idx}>
          <ViewCard view={v} />
        </Grid>
      })}
    </Grid>
  </Box>
  </>
}

type PostParams = {
  organelle: string;
};

interface OrganelleDetailProps {
  views: Map<string, View[]>;
}

export default function OrganelleDetails({ views }: OrganelleDetailProps) {
  const { organelle } = useParams<PostParams>();
  console.log({organelle, views});
  const selectedOrganelle = views.get(organelle)|| [{name: undefined}];
  return (<OrganelleCardList info={selectedOrganelle[0]} views={selectedOrganelle} />);
}
