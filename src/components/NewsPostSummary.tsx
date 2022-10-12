import React from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CardHeader,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { NewsPostProps } from "../api/posts";
import { postSlug } from "../utils/newsposts";

import banner from "./cosem_banner.jpg";

export default function NewsPostSummary({
  title,
  date,
  thumbnail_url,
  summary,
}: NewsPostProps) {
  const fullPostLink = `/news/${postSlug(date, title)}`;

  const thumbnail = thumbnail_url || banner;

  return (
    <Card raised>
      <CardActionArea component={Link} to={fullPostLink}>
        <CardHeader title={title} />
        <CardMedia component="img" height="140" image={thumbnail} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component="div">
            {Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date)}
          </Typography>
          <Typography variant="body2">{summary}</Typography>
        </CardContent>
      </CardActionArea>
    <CardActions>
      <Button component={Link} to={fullPostLink}>Learn More</Button>
    </CardActions>
    </Card>
  );
}
