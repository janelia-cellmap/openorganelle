import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      padding: "1em",
      marginTop: "1em",
      marginBottom: "2em"
    }
  })
);

export default function Publications() {
  const classes = useStyles();
  return (
    <div style={{ maxWidth: "54em", marginLeft: "auto", marginRight: "auto" }}>
      <Typography variant="h3" gutterBottom>
        OpenOrganelle Publications
      </Typography>
      <Paper className={classes.section}>
        <p>
          <i>
            C. Shan Xu, Song Pang, Gleb Shtengel, Andreas Müller, Alex T.
            Ritter, Huxley K. Hoffman, Shin-ya Takemura, Zhiyuan Lu, H. Amalia
            Pasolli, Nirmala Iyer, Jeeyun Chung, Davis Bennett, Aubrey V.
            Weigel, Tobias C. Walther, Robert V. Farese, Jr., Schuyler B. van
            Engelenburg, Ira Mellman, Michele Solimena, Harald F. Hess.{" "}
          </i>
          <b>
            Isotropic 3D electron microscopy reference library of whole cells
            and tissues.
          </b>{" "}
          bioRxiv (2020) <a href="https://www.biorxiv.org/content/10.1101/2020.11.13.382457v1">10.1101/2020.11.13.382457</a>.
        </p>
        <p>
          <i>
            Larissa Heinrich, Davis Bennett, David Ackerman, Woohyun Park, John
            Bogovic, Nils Eckstein, Alyson Petruncio, Jody Clements, C. Shan Xu,
            Jan Funke, Wyatt Korff, Harald F. Hess, Jennifer
            Lippincott-Schwartz, Stephan Saalfeld, Aubrey V. Weigel, COSEM
            Project Team.{" "}
          </i>
          <b>Automatic whole cell organelle segmentation in volumetric electron microscopy. </b>
          bioRxiv (2020) <a href="https://doi.org/10.1101/2020.11.14.382143"> 10.1101/2020.11.14.382143</a>
        </p>
      </Paper>
      <Typography variant="h3" gutterBottom>
        Related Work
      </Typography>
      <Paper className={classes.section}>
        <p>
          <i>
            C. Shan Xu, Kenneth J. Hayworth, Zhiyuan Lu, Patricia Grob, Ahmed M.
            Hassan, José G. García-Cerdán, Krishna K. Niyogi, Eva Nogales,
            Richard J, Weinberg, Harald F. Hess.{" "}
          </i>
          <b>Enhanced FIB-SEM systems for large-volume 3D imaging.</b> eLife
          (2017){" "}
          <a href="https://doi.org/10.7554/eLife.25916">10.7554/eLife.25916</a>
        </p>
        <p>
          <i>C. Shan Xu, Kenneth J. Hayworth, Harald F. Hess. </i>
          <b>Enhanced FIB-SEM systems for large-volume 3D imaging.</b>{" "}
          <a href="https://patents.google.com/patent/US10600615B2/en">
            U.S. Patent 10,600,615
          </a>
        </p>
        <p>
          <i>C. Shan Xu, Song Pang, Kenneth J. Hayworth, Harald F. Hess. </i>
          <b>
            Transforming FIB-SEM Systems for Large-Volume Connectomics and Cell
            Biology.
          </b>{" "}
          Volume Microscopy. Neuromethods, vol 155 (2020){" "}
          <a href="https://doi.org/10.1007/978-1-0716-0691-9_12">
            10.1007/978-1-0716-0691-9_12
          </a>
        </p>
        <p>
          <i>
            Andreas Müller, Deborah Schmidt, C. Shan Xu, Song Pang, Joyson
            Verner D’Costa, Susanne Kretschmar, Carla Münster, Thomas Kurth,
            Florian Jug, Martin Weigert, Harald F. Hess, Michele Solimena.{" "}
          </i>
          <b>
            Three-dimensional FIB-SEM reconstruction of microtubule-organelle
            interaction in whole primary mouse beta cells.
          </b>{" "}
          bioRxiv (2020){" "}
          <a href="https://doi.org/10.1101/2020.10.07.329268">
            10.1101/2020.10.07.329268
          </a>
        </p>
        <p>
          <i>
            David P. Hoffman, Gleb Shtengel, C. Shan Xu, Kirby R. Campbell,
            Melanie Freeman, Lei Wang, Daniel E. Milkie, H. Amalia Pasolli,
            Nirmala Iyer, John A. Bogovic, Daniel R. Stabley, Abbas Shirinifard,
            Song Pang, David Peale, Kathy Schaefer, Wim Pomp, Chi-Lun Chang,
            Jennifer Lippincott-Schwartz, Tom Kirchhausen, David J. Solecki,
            Eric Betzig, Harald F. Hess.{" "}
          </i>
          <b>
            Correlative three-dimensional super-resolution and block-face
            electron microscopy of whole vitreously frozen cells.
          </b>{" "}
          Science (2020).{" "}
          <a href="https://science.sciencemag.org/content/367/6475/eaaz5357">
            10.1126/science.aaz5357
          </a>
        </p>
        <p>
          <i>
            Michael E. Coulter, Cristina M.Dorobantu, Gerrald A.Lodewijk,
            Francois Delalande, Sarah Cianferani, Vijay S.Ganesh, Richard
            S.Smith, Elaine T.Lim, C. Shan Xu, Song Pang, Eric T.Wong, Hart
            G.W.Lidov Monica L.Calicchio, Edward Yang, Dilenny M.Gonzalez,
            Thorsten M.Schlaeger, Ganeshwaran H.Mochida, Harald Hess,
            Christopher A.Walsh.
          </i>{" "}
          <b>
            The ESCRT-III Protein CHMP1A Mediates Secretion of Sonic Hedgehog on
            a Distinctive Subtype of Extracellular Vesicles.{" "}
          </b>{" "}
          Cell Reports (2018).{" "}
          <a href="http://www.sciencedirect.com/science/article/pii/S2211124718310428?via%3Dihub">
            10.1016/j.celrep.2018.06.100
          </a>
        </p>
        <p>
          <i>Nils Eckstein, Julia Buhmann, Matthew Cook, Jan Funke.</i>{" "}
          <b>Microtubule Tracking in Electron Microscopy Volumes.</b> Medical
          Image Computing and Computer Assisted Intervention – MICCAI 2020
          (2020).{" "}
          <a href="https://doi.org/10.1007/978-3-030-59722-1_10">
            10.1007/978-3-030-59722-1_10
          </a>
        </p>
        <p>
          <i>
            Larissa Heinrich, Jan Funke, Constantine Pape, Juan Nunez-Iglesias,
            Stephan Saalfeld.
          </i>{" "}
          <b>
            Synaptic Cleft Segmentation in Non-isotropic Volume Electron
            Microscopy of the Complete Drosophila Brain.
          </b>{" "}
          Medical Image Computing and Computer Assisted Intervention – MICCAI
          2018 (2018).{" "}
          <a href="https://doi.org/10.1007/978-3-030-00934-2_36">
            10.1007/978-3-030-00934-2_36
          </a>
        </p>
        <p>
          <i>
            Louis K Scheffer, C. Shan Xu, Michal Januszewski, Zhiyuan Lu,
            Shin-ya Takemura, Kenneth J. Hayworth, Gary B. Huang, Kazunori
            Shinomiya, et al.
          </i>{" "}
          <b>
            A connectome and analysis of the adult Drosophila central brain.
          </b>{" "}
          eLife (2020).{" "}
          <a href="https://doi.org/10.7554/eLife.57443">10.7554/eLife.57443</a>
        </p>
        <p>
          <b>
            MICCAI Challenge on Circuit Reconstruction from Electron Microscopy
            Images
          </b>{" "}
          <a href="http://cremi.org/">http://cremi.org/</a>
        </p>
      </Paper>
    </div>
  );
}
