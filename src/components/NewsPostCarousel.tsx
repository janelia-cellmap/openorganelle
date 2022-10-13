import React, { useState } from "react";
import { usePosts } from "../context/PostsContext";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { postSlug } from "../utils/newsposts";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const postsInCarousel = 3;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: "255px",
    display: "block",
    overflow: "hidden",
    width: "100%",
    "object-fit": "cover",
  },
}));

export default function NewsPostCarousel() {
  const { state } = usePosts();
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const sortedPosts = state.posts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const selectedPosts = sortedPosts.slice(0, postsInCarousel);

  const steps = selectedPosts.map((post) => {
    return {
      label: post.title,
      imgPath: post.thumbnail_url,
      summary: post.summary,
      date: post.date,
    };
  });

  const maxSteps = steps.length;

  if (maxSteps < 1) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Typography variant="h4">Latest News</Typography>
      <div className={classes.root}>
        <Link to={`/news/${postSlug(steps[activeStep].date, steps[activeStep].label)}`} style={{textDecoration: "none"}}>
          <Paper square elevation={0} className={classes.header}>
            <Typography>{steps[activeStep].label}</Typography>
          </Paper>
          <AutoPlaySwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            interval={7000}
          >
            {steps.map((step, index) => (
              <div key={step.label}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <img
                    className={classes.img}
                    src={step.imgPath}
                    alt={step.label}
                  />
                ) : null}
                <p>{step.summary}</p>
                <Button>Learn More</Button>
              </div>
            ))}
          </AutoPlaySwipeableViews>
        </Link>
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>
    </div>
  );
}
