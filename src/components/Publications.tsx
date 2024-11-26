import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles: any = makeStyles(() =>
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
            Engelenburg, Ira Mellman, Michele Solimena, Harald F. Hess.
          </i>
          <b>
            An open-access volume electron microscopy atlas of whole cells and
            tissues.
          </b>{" "}
          Nature. Published online (2021).{" "}
          <a href="https://doi.org/10.1038/s41586-021-03992-4">
            10.1038/s41586-021-03992-4
          </a>
          . [
          <a href="https://www.biorxiv.org/content/10.1101/2020.11.13.382457v1">
            preprint
          </a>
          ]
        </p>
        <p>
          <i>
            Larissa Heinrich, Davis Bennett, David Ackerman, Woohyun Park, John
            Bogovic, Nils Eckstein, Alyson Petruncio, Jody Clements, Song Pang,
            C. Shan Xu, Jan Funke, Wyatt Korff, Harald F. Hess, Jennifer
            Lippincott-Schwartz, Stephan Saalfeld, Aubrey V. Weigel, COSEM
            Project Team.
          </i>
          <b>
            {" "}
            Whole-cell organelle segmentation in volume electron microscopy.
          </b>{" "}
          Nature. Published online (2021).{" "}
          <a href="https://doi.org/10.1038/s41586-021-03977-3">
            10.1038/s41586-021-03977-3
          </a>
          . [<a href="https://doi.org/10.1101/2020.11.14.382143">preprint</a>] [
          <a href="https://github.com/janelia-cosem/heinrich-2021a">code</a>] [
          <a href="https://open.quiltdata.com/b/janelia-cosem-publications/tree/heinrich-2021a/">
            data
          </a>
          ]
        </p>
        {/*(<p>
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
          bioRxiv (2020){" "}
          <a href="https://www.biorxiv.org/content/10.1101/2020.11.13.382457v1">
            10.1101/2020.11.13.382457
          </a>
          .
        </p>
        <p>
          <i>
            Larissa Heinrich, Davis Bennett, David Ackerman, Woohyun Park, John
            Bogovic, Nils Eckstein, Alyson Petruncio, Jody Clements, C. Shan Xu,
            Jan Funke, Wyatt Korff, Harald F. Hess, Jennifer
            Lippincott-Schwartz, Stephan Saalfeld, Aubrey V. Weigel, COSEM
            Project Team.{" "}
          </i>
          <b>
            Automatic whole cell organelle segmentation in volumetric electron
            microscopy.{" "}
          </b>
          bioRxiv (2020){" "}
          <a href="https://doi.org/10.1101/2020.11.14.382143">
            {" "}
            10.1101/2020.11.14.382143
          </a>{" "}
          [<a href="https://github.com/janelia-cosem/heinrich-2021a">code</a>] [
          <a href="https://open.quiltdata.com/b/janelia-cosem-publications/tree/heinrich-2021a/">
            data
          </a>
          ].
        </p>)*/}
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
          (2017).{" "}
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
          Volume Microscopy. Neuromethods, vol 155 (2020).{" "}
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
          bioRxiv (2020).{" "}
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
         <i>
          Aaran Vijayakumaran, Christopher Godbehere, Analle Abuammar, Sophia Y. Breusegem, Leah R. Hurst, Nobuhiro Morone, Jaime Llodra, Melis T. Dalbay, Niaj M. Tanvir, K. MacLellan-Gibson, Chris O’Callaghan, Esben Lorentzen, CellMap Project Team, FIB-SEM Technology, Andrew J. Murray, Kedar Narayan, Vito Mennella.
         </i>{" "}
         <b>
          3D nanoscale architecture of the respiratory epithelium reveals motile cilia-rootlets-mitochondria axis of communication.
         </b>{" "}
         bioRxiv 2024.09.08.611854.{" "}
         <a href="https://doi.org/10.1101/2024.09.08.611854">
          https://doi.org/10.1101/2024.09.08.611854
         </a>
        </p>
        <p>
         <i>
          Yiming Wu, Chloe Whiteus, C. Shan Xu, Kenneth J. Hayworth, Richard J. Weinberg, Harald F. Hess, Pietro De Camilli.
         </i>{" "}
         <b>
          Contacts between the endoplasmic reticulum and other membranes in neurons.
         </b>{" "}
         Proceedings of the National Academy of Sciences 114, E4859–E4867 (2017).{" "}
         <a href="https://doi.org/10.1073/pnas.1701078114">
          https://doi.org/10.1073/pnas.1701078114
         </a>
        </p>
        <p>
         <i>
          Aubrey V. Weigel, Chi-Lun Chang, Gleb Shtengel, C. Shan Xu, David P. Hoffman, Melanie Freeman, Nirmala Iyer, Jesse Aaron, Satya Khuon, John Bogovic, Wei Qiu, Harald F. Hess, Jennifer Lippincott-Schwartz.
         </i>{" "}
         <b>
          ER-to-Golgi protein delivery through an interwoven, tubular network extending from ER.
         </b>{" "}
         Cell 184, 2412–2429.e16 (2021).{" "}
         <a href="https://doi.org/10.1016/j.cell.2021.03.035">
          https://doi.org/10.1016/j.cell.2021.03.035
         </a>
        </p>
        <p>
         <i>
          Andrew T. Ritter, Gleb Shtengel, C. Shan Xu, Aubrey V. Weigel, David P. Hoffman, Melanie Freeman, Nirmala Iyer, Natalia Alivodej, David Ackerman, Igor Voskoboinik, Joseph Trapani, Harald F. Hess, Ira Mellman.
         </i>{" "}
         <b>
          ESCRT-mediated membrane repair protects tumor-derived cells against T cell attack.
         </b>{" "}
         Science 376, 377–382 (2022).{" "}
         <a href="https://doi.org/10.1126/science.abl3855">
          https://doi.org/10.1126/science.abl3855
         </a>
        </p>
        <p>
         <i>
          Ryan Conrad, Kedar Narayan.
         </i>{" "}
         <b>
          Instance segmentation of mitochondria in electron microscopy images with a generalist deep learning model trained on a diverse dataset.
         </b>{" "}
         Cell Systems 14, 58–71 (2023).{" "}
         <a href="https://doi.org/10.1016/j.cels.2022.12.006">
          https://doi.org/10.1016/j.cels.2022.12.006
         </a>
        </p>
        <p>
         <i>
          Navaneetha Krishnan Bharathan, William Giang, Jesse S. Aaron, Satya Khuon, Teng-Leong Chew, Stephan Preibisch, Eric T. Trautman, Larissa Heinrich, John Bogovic, Davis Bennett, David Ackerman, Woohyun Park, Alyson Petruncio, Aubrey V. Weigel, Stephan Saalfeld, COSEM Project Team, A. Wayne Vogl, Sara N. Stahley, Andrew P. Kowalczyk.
         </i>{" "}
         <b>
          Architecture and dynamics of a desmosome–endoplasmic reticulum complex.
         </b>{" "}
         Nature Cell Biology 25, 823–835 (2023).{" "}
         <a href="https://doi.org/10.1038/s41556-023-01154-4">
          https://doi.org/10.1038/s41556-023-01154-4
         </a>
        </p>
        <p>
         <i>
          Andreas Müller, Deborah Schmidt, J. Paul Albrecht, Lukas Rieckert, Martin Otto, Lorena E. Galicia Garcia, Gunnar Fabig, Michele Solimena, Martin Weigert.
         </i>{" "}
         <b>
          Modular segmentation, spatial analysis and visualization of volume electron microscopy datasets.
         </b>{" "}
         Nature Protocols (2024).{" "}
         <a href="https://doi.org/10.1038/s41596-024-00957-5">
          https://doi.org/10.1038/s41596-024-00957-5
         </a>
        </p>
        <p>
         <i>
          Annie Handler, Qiyu Zhang, Song Pang, Tri M. Nguyen, Michael Iskols, Michael Nolan-Tamariz, Stuart Cattel, Rebecca Plumb, Brianna Sanchez, Karyl Ashjian, Aria Shotland, Bartianna Brown, Madiha Kabeer, Josef Turecek, Genelle Rankin, Wangchu Xiang, Elisa C. Pavarino, Nusrat Africawala, Celine Santiago, Wei-Chung Allen Lee, C. Shan Xu, David D. Ginty.
         </i>{" "}
         <b>
          Three-dimensional reconstructions of mechanosensory end organs suggest a unifying mechanism underlying dynamic, light touch.
         </b>{" "}
         bioRxiv 2023.03.17.533188.{" "}
         <a href="https://doi.org/10.1101/2023.03.17.533188">
          https://doi.org/10.1101/2023.03.17.533188
         </a>
        </p>
        <p>
         <i>
          Peng-Peng Zhu, Hui-Fang Hung, Natalia Batchenkova, Jonathon Nixon-Abell, James Henderson, Pengli Zheng, Benoit Renvoisé, Song Pang, C. Shan Xu, Stephan Saalfeld, Jan Funke, Yuxiang Xie, Fabian Svara, Harald F. Hess, Craig Blackstone.
         </i>{" "}
         <b>
          Transverse endoplasmic reticulum expansion in hereditary spastic paraplegia corticospinal axons.
         </b>{" "}
         Human Molecular Genetics 31, 2779–2795 (2022).{" "}
         <a href="https://doi.org/10.1093/hmg/ddac072">
          https://doi.org/10.1093/hmg/ddac072
         </a>
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
