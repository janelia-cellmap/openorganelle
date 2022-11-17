import React, { useContext } from "react";
import { View } from "../../types/datasets";
import { useParams, Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  Card,
  CardMedia,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
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
      margin: theme.spacing(1),
      position: "relative",
    },
    viewThumbnailFull: {
      width: "256px",
      height: "256px",
    },
    hoverLinks: {
      display: "block",
      width: "77%",
      position: "absolute",
      bottom: "1rem",
      color: "#333",
      zIndex: 20,
      background: "rgba(256,256,256,0.9)",
      border: "1px solid #fff",
      height: "6rem",
      padding: "1em",
    }
  })
);

export function ViewCard({ view }: { view: View }) {
  const classes = useStyles();
  const { appState } = useContext(AppContext);
  const [elevation, setElevation] = React.useState<number>(1);

  const neuroglancerUrl = makeNeuroglancerUrl({
    position: view.position ?? undefined,
    scale: view.scale ?? undefined,
    orientation: view.orientation ?? undefined,
    images: view.images,
    outputDimensions,
    host: appState.neuroglancerAddress,
  });

  const handleMouseOver = () => {
    setElevation(10);
  };

  const handleMouseOut = () => {
    setElevation(1);
  };

  return (
    <div className={classes.cardContainer}>
      <Card
        className={classes.viewCard}
        elevation={elevation}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      >
        <CardMedia
          component="img"
          className={classes.viewThumbnailFull}
          image={view.thumbnailUrl ?? BrokenImage}
          alt="Preview image of the view"
        />
      {elevation === 10 ? (
        <div className={classes.hoverLinks} >
          <p>Dataset: <RouterLink to={`/datasets/${view.datasetName}`}>{view.datasetName}</RouterLink></p>
          <p>View with <a target="_blank" rel="noreferrer" href={neuroglancerUrl}>Neuroglancer</a></p>
        </div>
      )
        : ""}
      </Card>
    </div>
  );
}

export interface OrganelleCardsProps {
  info: OrganelleMetadata;
  views: View[];
}

export function OrganelleCardList({ info, views }: OrganelleCardsProps) {
  const classes = useStyles();
  return (
    <Box className={classes.viewCardCollection}>
      <Typography variant="h4">{info.name}</Typography>
      <Grid container direction="row">
        {views.map((v, idx) => {
          return (
            <Grid item key={idx}>
              <ViewCard view={v} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

type PostParams = {
  organelle: string;
};

interface OrganelleDetailProps {
  views: Map<string, View[]>;
}

export default function OrganelleDetails({ views }: OrganelleDetailProps) {
  const { organelle } = useParams<PostParams>();
  const selectedOrganelle = views.get(organelle) || [];
  const info = { infoUrl: "", name: selectedOrganelle[0].name };
  return <OrganelleCardList info={info} views={selectedOrganelle} />;
}
