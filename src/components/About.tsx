import React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { makeStyles } from "tss-react/mui";

const useStyles: any = makeStyles()(() =>
  ({
    section: {
      padding: "1em",
      margin: "1em 0 2em 0"
    }
  })
);

export default function About() {
  const {classes} = useStyles();
  return (
    <div className="content">
      <Typography
        variant="h3"
        gutterBottom
        style={{ marginTop: "2em", textAlign: "center" }}
      >
        Welcome to HHMI Janelia’s OpenOrganelle.
      </Typography>
      <div
        style={{ maxWidth: "45em", marginLeft: "auto", marginRight: "auto" }}
      >
        <Paper className={classes.section}>
          <p style={{ textIndent: "3ch" }}>
            On this data portal we present high resolution tissue-scale volume
            electron microscopy (vEM) datasets acquired with the enhanced
            focused ion beam scanning electron microscopy (FIB-SEM) technology
            developed at Janelia. Accompanying these EM volumes are automated
            segmentations and analyses of intracellular sub-structures.
          </p>

          <p style={{ textIndent: "3ch" }}>
            Within Janelia are some of the world’s leading research groups in
            Machine Learning (
            <a href="https://www.janelia.org/lab/saalfeld-lab">Saalfeld lab</a>{" "}
            and <a href="https://www.janelia.org/lab/funke-lab">Funke lab</a>),
            Cell Biology (
            <a href="https://www.janelia.org/lab/lippincott-schwartz-lab">
              Lippincott-Schwartz lab
            </a>
            ), and large-volume, high-resolution EM data acquisition (
            <a href="https://www.janelia.org/project-team/fib-sem-technology">
              FIB-SEM Technology
            </a>{" "}
            and <a href="https://www.janelia.org/lab/hess-lab">Hess lab</a>).
            This provides a unique opportunity to expand research at the
            intersection of these fields and drive forward our tools to study
            subcellular structures; this effort is being led by the{" "}
            <a href="https://www.janelia.org/project-team/cosem">
              COSEM Project Team
            </a>
            .
          </p>

          <p style={{ textIndent: "3ch" }}>
            The unprecedented volume and resolution of vEM datasets generated by
            the enhanced FIB-SEM platform (Hess Lab and FIB-SEM Technology) both
            demands and enables the development of universal machine learning
            classifiers for the automatic detection of sub-cellular structures
            in these data. The COSEM project team, in collaboration with the
            Saalfeld and Funke labs with biological guidance from the
            Lippincott-Schwartz lab, has begun tackling the segmentation problem
            as well as the subsequent large-scale quantitative analysis of these
            data to answer biological questions.
          </p>

          <p style={{ textIndent: "3ch" }}>
            On this site you will find all datasets, training data and
            segmentations available for exploration. Be sure to also check out
            our tutorials to learn how to work with the data yourself and our
            publications list to learn more!
          </p>
        </Paper>

        <Paper className={classes.section}>
          <Typography variant="h5">Sharing:</Typography>
          <p style={{ textIndent: "3ch" }}>
            We invite you to share and use this data broadly! The data is
            licensed under{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
              CC BY 4.0
            </a>
            . You are free to share and adapt this data. We ask that you please
            be sure to cite the data DOIs and the related publication(s). All of
            this information can be found listed on the individual data page. If
            you are redistributing the data, please link back to OpenOrganelle.
          </p>
          <p style={{ textIndent: "3ch" }}>
            There are multiple avenues to share the datasets. We recommend
            sharing individual dataset pages (i.e.
            <a href="https://openorganelle.janelia.org/datasets/jrc_hela-2">
              https://openorganelle.janelia.org/datasets/jrc_hela-2
            </a>
            ) so others can easily customize their Neuroglancer environments,
            find the data location on S3, and find related material available
            (i.e. metadata, analysis, segmentations, light microscopy). For
            consistency, we also recommend referring to the data using their
            Data IDs (i.e. jrc_hela-2).
          </p>
          <p style={{ textIndent: "3ch" }}>
            We welcome you to visit our GitHub repository, janelia-cosem, to
            access all of our code and software. More information about the
            software used and written for this project can be found on the Code
            page.
          </p>
          <p style={{ textIndent: "3ch" }}>
            For inquiries about contributing to this platform please contact:{" "}
            <a href="mailto:cosemdata@janelia.hhmi.org">
              cosemdata@janelia.hhmi.org
            </a>
          </p>
          <p style={{ textIndent: "3ch" }}>
            Please see our <Link to="/terms_of_use">Terms of use</Link> for more
            details.
          </p>
        </Paper>
        <Paper className={classes.section}>
          <Typography variant="h5">Acknowledgements:</Typography>
          <p style={{ textIndent: "3ch" }}>
            We thank C. Shan Xu and Song Pang for their work collecting,
            pre-processing, and organizing the FIB-SEM data to seed
            OpenOrganelle. We thank Kenneth Hayworth and Wei Qiu for invaluable
            discussions and data collection support. We gratefully acknowledge
            Patricia Rivlin, Steve Plaza, and Ian Meinertzhagen for{" "}
            <a href="https://www.janelia.org/support-team/electron-microscopy">
              JRC EM shared resource
            </a>{" "}
            and
            <a href="https://www.janelia.org/project-team/flyem">FlyEM</a>{" "}
            project team support on staining protocols development. We thank the
            electron microscopy facility of MPI-CBG and of the CMCB Technology
            Platform at TU Dresden for their services. We also thank Yumei Wu
            from Pietro De Camilli’s laboratory at Yale for advice.
          </p>
          <p style={{ textIndent: "3ch" }}>
            This work is part of the COSEM Project Team at Janelia Research
            Campus, Howard Hughes Medical Institute, Ashburn, VA. During this
            effort, the COSEM Project Team consisted of: Riasat Ali, Rebecca
            Arruda, Rohit Bahtra, Davis Bennett, Destiny Nguyen, Woohyun Park,
            and Alyson Petruncio, led by Aubrey Weigel, with Steering Committee
            of Jan Funke, Harald Hess, Wyatt Korff, Jennifer
            Lippincott-Schwartz, and Stephan Saalfeld. We thank Gleb Shtengel
            for his early work manually segmenting organelles, motivating the
            need for more automated approaches. We thank Rohit Bahtra, a{" "}
            <a href="https://www.janelia.org/you-janelia/students-and-postdocs/high-school-internship-program">
              Janelia-LCR Summer Internship Program
            </a>{" "}
            student, for his work generating masks of datasets and providing
            manual annotations. We thank Arslan Aziz, a{" "}
            <a href="https://www.janelia.org/you-janelia/students-postdocs/undergraduate-scholars-program">
              Janelia Undergraduate Scholars Program
            </a>{" "}
            student, for his work correcting mitochondria over-merging. We thank
            Gudrun Ihrke and{" "}
            <a href="https://www.janelia.org/support-team/project-technical-resources">
              Project Technical Resources
            </a>{" "}
            for management and coordination and staff support. We thank{" "}
            <a href="https://www.janelia.org/support-team/scientific-computing-systems">
              Janelia Scientific Computing Shared Resources
            </a>
            , particularly Tom Dolafi and Stuart Berg for assistance with
            software infrastructure. We thank Victoria Custard for
            administrative support.
          </p>
          <p style={{ textIndent: "3ch" }}>
            Many of the datasets used in this research were derived from a HeLa
            cell line. Henrietta Lacks, and the HeLa cell line that was
            established from her tumor cells without her knowledge or consent in
            1951, have made significant contributions to scientific progress and
            advances in human health. We are grateful to Henrietta Lacks, now
            deceased, and to her surviving family members for their
            contributions to biomedical research. HHMI is proud to support the{" "}
            <a href="http://henriettalacksfoundation.org/wp-content/uploads/2020/10/HLF-Press-Release-HHMI-Collins-Donations.pdf">
              Henrietta Lacks Foundation
            </a>{" "}
            and their important mission.
          </p>

          <p>
            We especially thank Amazon Web Services hosting our data through
            their open data program.
          </p>

          <p>
            Funding provided by{" "}
            <a href="https://hhmi.org">Howard Hughes Medical Institute</a>
          </p>
        </Paper>
      </div>
    </div>
  );
}
