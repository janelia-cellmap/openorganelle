import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Taxon, View } from "../../types/datasets";
import BrokenImage from "../../broken_image_24dp.svg";
import {OrganelleCardsProps } from "../Organelles";

const useStyles: any = makeStyles(() =>
  createStyles({
    viewThumbnailPreview: {
      width: "64px",
      height: "64px",
    },
    showMore: {
      background: "#ccc",
      color: "#444",
      textAlign: "center",
      height: "64px",
      width: "64px",
      display: "flex",
      fontWeight: "bold",
    },
  })
);

function OrganellePreview({ taxon, views }: OrganelleCardsProps) {
  const classes = useStyles();
  return (
    <div>
      <Grid container spacing={1} direction={"row"}>
        {views.slice(0, 7).map((view, idx) => {
          return (
            <Grid item xs={3} key={idx}>
              <img
                src={view.thumbnailUrl ?? BrokenImage}
                className={classes.viewThumbnailPreview}
              />
            </Grid>
          );
        })}
        <Grid item xs={3} key="more">
          <div className={classes.showMore}>
            <p>Show More</p>
          </div>
        </Grid>
      </Grid>
      <Typography>{taxon.name}</Typography>
    </div>
  );
}

interface OrganelleGridProps {
  views: Map<string, View[]>;
  taxa: Map<string, Taxon>
}

export default function OrganelleGrid({ views, taxa }: OrganelleGridProps) {
  return (
    <>
      <Typography variant="h3">Organelles</Typography>
      <Grid container direction={"row"} justify="center" spacing={2}>
        {Array.from(views!.entries())
          .sort()
          .map(([taxon, views], idx) => {
            return (
              <Grid
                item
                key={idx}
                md={4}
                sm={6}
                xs={12}
                style={{ maxWidth: "350px" }}
              >
                <Card key={`card_${idx}`}>
                  <CardActionArea component={Link} to={`/organelles/${taxon}`}>
                    <CardContent>
                      <OrganellePreview
                        taxon={taxa.get(taxon)!}
                        views={views}
                      />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
