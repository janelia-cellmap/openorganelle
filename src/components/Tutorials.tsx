import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import ng_contrast from "./ng_contrast.png";
import ng_resolution from "./ng_resolution.png";
import fijiIcon from "./fiji_icon.png";
import "./Tutorials.css";
import { Box } from "@material-ui/core";
import { CodeBlock, dracula } from "react-code-blocks";

const useStyles: any = makeStyles(() =>
  createStyles({
    section: {
      padding: "1em",
      marginTop: "1em",
    },
  })
);

export default function Tutorials() {
  const classes = useStyles();
  return (
    <Grid container spacing={3} className="tutorials">
      <Grid item md={3}>
        <Paper className="toc">
          <ul>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#website">Website</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#visualization">Visualization</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#about">About the data</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#data_access">Accessing data</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#measurements">Measurements</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#code">Related software & code</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#sharing">Sharing</a>
              </Typography>
            </li>
          </ul>
        </Paper>
      </Grid>
      <Grid item md={9}>
        <div
          style={{ maxWidth: "54em", marginLeft: "auto", marginRight: "auto" }}
        >
          <Typography variant="h3" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <p className="anchor" id="website" />
          <Paper className={classes.section}>
            <Typography variant="h4" gutterBottom>
              Website
            </Typography>
            <Typography variant="h5" gutterBottom>
              How do I navigate OpenOrganelle?
            </Typography>
            <Typography paragraph>
              Our data portal is organized on five main pages. Datasets,
              Organelles, Measurements, Publications, and FAQ. Within these
              pages you will find tools and resources for browsing and consuming
              the data. For more information about the mission of the data
              portal and the teams involved please visit our{" "}
              <Link to="/about">About</Link> page.
            </Typography>

            <Typography variant="h5" gutterBottom>
              What is the Datasets page?
            </Typography>
            <Typography paragraph>
              On the <Link to="/">Datasets</Link> page you will find a list of
              all the available FIB-SEM datasets and accompanying segmentations.
              Clicking on a dataset will direct you to that individual dataset’s
              page where you can see more detailed information about image
              acquisition, data location, links for viewing in FIJI. On the
              individual dataset page you can also select layers to view in
              Neuroglancer to browse the data online. More about the layer
              selection can be found on the FAQ page under Visualization.
            </Typography>

            <Typography variant="h5" gutterBottom>
              What&apos;s on the Organelles page?
            </Typography>
            <Typography paragraph>
              On the <Link to="/organelles">Organelles</Link> page is a catalog
              of all of the organelles that have been segmented. Included here
              is a description of the organelles as well as Neuroglancer links
              to examples of these organelles in four different datasets.
            </Typography>

            <Typography variant="h5" gutterBottom>
              What is the Measurements page?
            </Typography>
            <Typography paragraph>
              On the <Link to="/measurements">Measurements</Link> page you can
              browse the analyses results of organelle segmentations such as
              surface area, volume, or contact sites between two organelles for
              select datasets.
            </Typography>

            <Typography variant="h5" gutterBottom>
              What is the Publications page?
            </Typography>
            <Typography paragraph>
              On the <Link to="/publications">Publications</Link> page you’ll
              find publications associated with these datasets as well as a list
              of “views” that are referenced in these publications. More
              information about pre-made data views can be found in
              Visualization.
            </Typography>
          </Paper>
          <p className="anchor" id="visualization" />
          <Paper className={classes.section}>
            <Typography variant="h4" gutterBottom>
              Visualization
            </Typography>
            <Typography variant="h5" gutterBottom>
              How do I visualize the data on OpenOrganelle?
            </Typography>
            <Typography>
              On each dataset page are customizable options to browse the data
              in a web based viewer, Neuroglancer. Customizations include:
            </Typography>
            <ul>
              <li>
                Pre-made “views”: These views are pre-determined regions of
                interest. Some are referenced in related publications, others
                are just interesting and of note! For a catalog of views that
                are directly related to published material please visit the
                “Publications” page.
              </li>
              <li>
                “Layers”: the FIB-SEM volumes, available segmentations, and
                light microscopy volumes are each a layer that can be added to
                the Neuroglancer instance.
              </li>
            </ul>
            <Typography variant="h5" gutterBottom>
              How do I setup a Neuroglancer instance?
            </Typography>
            <Typography>On a dataset page- </Typography>
            <ol>
              <li>
                First, select a “view”. Either a pre-made view or the default
                location provided.
              </li>
              <li>
                Next, select the layers you would like to have visible in the
                Neuroglancer instance. Available options may include FIB-SEM,
                organelle predictions, refined organelle segmentations, analysis
                of organelle segmentations (i.e. contact sites, skeletons, and
                curvature), and correlative light microscopy.
              </li>
              <li>
                Once the view and layers are selected, you can initiate a
                Neuroglancer instance in a new tab by clicking the “VIEW” button
                or the dataset thumbnail.
              </li>
            </ol>
            <Typography variant="h5" gutterBottom>
              How do I use Neuroglancer?
            </Typography>
            <Typography variant="h6" gutterBottom>
              Keyboard and mouse bindings
            </Typography>
            <Typography paragraph>
              Below is a non-exhaustive list of useful keyboard strokes and
              mouse clicks for browsing data within Neuroglancer. For a complete
              set of bindings, within Neuroglancer, press h or click on the
              button labeled ? in the upper right corner.
            </Typography>
            <ul>
              <li>
                {" "}
                <b>Left Click</b> on a layer name to toggle its visibility.
              </li>
              <li>
                <b>Right Click</b> on a layer to select it and modify its
                settings in the side panel.
              </li>
              <li>
                <kbd>space</kbd> to toggle the view layout.
              </li>
              <li>
                <b>Left Click</b> and drag the data to pan.
              </li>
              <li>
                <b>Right Click</b> to recenter at that location.
              </li>
              <li>
                <b>Mouse Wheel</b> to scroll through 2D slices.
              </li>
              <li>
                <kbd>shift</kbd> + <b>Wheel</b> to scroll at 10x speed.
              </li>
              <li>
                <kbd>ctrl</kbd> + <b>Wheel</b> to zoom.
              </li>
              <li>
                <kbd>shift</kbd> + <b>Left Click</b> to rotate in plane.
              </li>
              <li>
                <kbd>z</kbd> to return to an orthogonal plane.
              </li>
              <li>
                <b>Double Left Click</b> a segmentation to turn on/off a 3D
                rendering.
              </li>
              <li>
                <kbd>a</kbd> to toggle axis lines
              </li>
              <li>
                <kbd>b</kbd> to toggle scale bar
              </li>
            </ul>
            <Typography variant="h6">
              Other useful tools In the side panel
            </Typography>
            <Typography paragraph>
              (<kbd>ctrl</kbd> + <b>Left Click</b> to show if closed) are
              customizable settings to optimize the viewing experience of the
              data.
            </Typography>
            <Typography variant="h6">Side Panel - Source</Typography>
            <Typography>On this tab you can find:</Typography>
            <ul>
              <li>The data location on S3.</li>
              <li>The data type.</li>
              <li>The voxel size.</li>
            </ul>
            <Typography paragraph>
              To manually add a new layer, click the <b>+</b> button, select the
              data type (ex. N5), and enter the data location (ex. s3://…).
            </Typography>
            <Typography variant="h6">Side Panel - Rendering</Typography>
            <ul>
              <li>
                <img
                  src={ng_resolution}
                  alt="Resoultion controls from neuroglancer"
                  style={{ float: "right", margin: "0.5em" }}
                />
                <b>Resolution</b> (slice): The data quality vs load speed can be
                customized. For instance, to optimize for quality (slow loading
                times) click on the left side of the histogram. To reset the
                settings, simply double click the histogram.
              </li>
              <li>
                <b>Blending</b>: Select the preferred blending of the selected
                layer, i.e. default or additive.
              </li>
              <li>
                <b>Opacity</b>: Select the preferred opacity of the selected
                layer.
              </li>
              <li>
                <img
                  src={ng_contrast}
                  alt="Contrast controls from neuroglancer"
                  style={{ float: "right", margin: "0.5em" }}
                />
                <b>Contrast</b>: Adjust the contrast of the selected layer. To
                invert the lookup table click the arrow. To adjust the contrast
                click and drag the lower and upper bound on the graph.
              </li>
              <li>
                <b>Color</b>: For segmentation layers, a preferred color can be
                selected by clicking the color box.
              </li>
            </ul>
            <Typography variant="h6" gutterBottom>
              Side Panel - Seg.
            </Typography>
            <Typography paragraph>
              If 3D renderings are available for a segmentation they will be
              visible on the segmentation panel. As you double click
              segmentations to turn on 3D renderings, their ID will become
              visible here. Selecting/deselecting renderings can also be
              performed by clicking on the IDs in the panel.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Top Toolbar - Coordinates
            </Typography>
            <Typography paragraph>
              In the top left hand corner you will find the XYZ coordinates (in
              nm). To copy a location you can click the copy icon. To navigate
              to a specific location, you can manually enter in the XYZ
              coordinates.
            </Typography>
          </Paper>
          <p className="anchor" id="about" />
          <Paper className={classes.section}>
            <Typography variant="h4" gutterBottom>
              About the data
            </Typography>
            <Typography variant="h5" gutterBottom>
              Where does the vEM data come from?
            </Typography>
            <Typography paragraph>
              Details about the dataset&apos;s origins can be found under
              &quot;Contributions&quot; on it&apos;s individual Dataset page. If
              the dataset is part of a publication that will also be listed on
              the individual Dataset page. The portal was seeded with FIB-SEM
              volumes collected at HHMI-Janelia via the{" "}
              <a href="https://www.janelia.org/lab/hess-lab">Hess lab</a> and{" "}
              <a href="https://www.janelia.org/project-team/fib-sem-technology">
                FIB-SEM Technology Group
              </a>
              .
            </Typography>

            <Typography variant="h5" gutterBottom>
              Is there just EM data?
            </Typography>
            <Typography paragraph>
              There&apos;s more! While most of the portal contains FIB-SEM data,
              there is also{" "}
              <a href="https://science.sciencemag.org/content/367/6475/eaaz5357">
                cryoCLEM
              </a>{" "}
              data (such as SIM and PALM), as well as volume TEM data. When
              available, corresponding segmentations are also available for
              datasets hosted here.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Who made the segmentations?
            </Typography>
            <Typography paragraph>
              Many of the segmentations were seeded by the{" "}
              <a href="https://www.janelia.org/project-team/cosem">COSEM</a>{" "}
              (now{" "}
              <a href="https://www.janelia.org/project-team/cellmap">CellMap</a>
              ) Project Team. Details about the segmentation origins can be
              found under &quot;Contributions&quot; on the individual Dataset
              page. If the segmentations are part of a publication that will
              also be listed on the individual Dataset page. We are eager to
              host other&apos;s segmentations here as well! For inquiries about
              contributing to this platform please contact:{" "}
              <a href="mailto:cosemdata@janelia.hhmi.org">
                cosemdata@janelia.hhmi.org
              </a>
              .
            </Typography>

            <Typography variant="h5" gutterBottom>
              Can I add my own data?
            </Typography>
            <Typography paragraph>
              If you are interested in having your dataset hosted on
              OpenOrganelle we would love to hear from you! For inquiries about
              contributing to this platform please contact:{" "}
              <a href="mailto:cosemdata@janelia.hhmi.org">
                cosemdata@janelia.hhmi.org
              </a>
            </Typography>

            <Typography variant="h5" gutterBottom>
              How is the data organized on S3?
            </Typography>
            <Typography paragraph>
              Our datasets are stored on AWS S3 using the{" "}
              <a href="https://github.com/saalfeldlab/n5">N5 format</a> For
              documentation of how data, metadata, and derived data are
              organized for OpenOrganelle, see this{" "}
              <a href="https://github.com/janelia-cosem/schemas/blob/master/cloud/janelia-cosem/README.md">
                page
              </a>
              . OpenOrganelle provides access to raw EM datasets, organelle
              predictions, refined segmentations, analyses, and correlative
              light microscopy. For an extensive list of available prediction,
              segmentation, and analysis volumes, please visit the{" "}
              <Link to="/organelles">Organelles</Link> page.
            </Typography>
            <Typography variant="h5" gutterBottom>
              What is the difference between segmentations and predictions?
            </Typography>

            <Typography paragraph>
              The organelle annotations produced by the COSEM Project Team often
              include both <i>predictions</i> and <i>segmentations</i>.
            </Typography>

            <Typography paragraph>
              <b>Predictions</b> are the unprocessed (&quot;raw&quot;) results
              from our ML networks. We predict distances rather than a binary
              label. The &apos;intensity&apos; values in the predictions data
              therefore correlates to the distance from the predicted object.
              Specifically, in the format hosted on OpenOrganelle, thresholding
              at a value of 127 will produce a binary label for that particular
              organelle.
            </Typography>
            <Typography paragraph>
              <b>Segmentations</b> are at minimum a thresholded prediction.
              Additionally, there are post-processing refinements that can be
              performed to help clean up the predictions such as size filtering.
              For more details about the refinements used please visit our
              GitHub (
              <a href="https://github.com/janelia-cosem/refinements">
                https://github.com/janelia-cosem/refinements
              </a>
              ).
            </Typography>

            <Typography variant="h5" gutterBottom>
              What are the Analysis Layers?
            </Typography>
            <Typography paragraph>
              For some datasets there are additional options to view
              &quot;Analysis Layers&quot;. For instance, contact sites between
              two organelles can be viewed. A definition of these analyses can
              be found on the{" "}
              <HashLink to="/organelles#analysis">Organelles</HashLink> page.
            </Typography>

            <Typography variant="h5" gutterBottom>
              How were organelles defined?
            </Typography>
            <Typography paragraph>
              On the Organelles page is a catalog of all of the organelles that
              have been segmented. Included here is a description of the
              organelles as well as Neuroglancer links to examples of these
              organelles in four different datasets. For an extensive list of
              available prediction, segmentation, and analysis volumes, please
              visit the <Link to="/organelles">Organelles</Link> page.
            </Typography>
          </Paper>
          <p className="anchor" id="data_access" />
          <Paper className={classes.section}>
            <Typography variant="h4" gutterBottom>
              Accessing the data
            </Typography>

            <Typography variant="h5" gutterBottom>
              How do I access the data outside of OpenOrganelle?
            </Typography>
            <Typography paragraph>
              When working with imaging datasets that greatly exceed the memory
              available on a single computer, best practice is to store the
              dataset in small chunks and use programs that leverage the chunked
              representation. This is the approach we recommend for the datasets
              displayed on OpenOrganelle. Accordingly, we do not offer a
              browser-based tool for directly downloading entire datasets, as
              downloading hundreds of thousands of files totalling hundreds of
              gigabytes is not feasible in the web browser. Instead, we
              recommend the following methods for direct data access:
            </Typography>
            <ul>
              <li>
                <a href="#fiji">Opening data with Fiji</a>
              </li>
              <li>
                <a href="#python">Programmatic data access with Python</a>
              </li>
              <li>
                <a href="#aws-cli">Raw file access with the AWS CLI</a>
              </li>
            </ul>
            <p className="anchor" id="fiji" />
            <Typography variant="h5" gutterBottom>
              How do I open data in Fiji?
            </Typography>
            <Typography paragraph>
              Fiji is a popular tool for image processing; download it here{" "}
              <a href="https://imagej.net/software/fiji/">here</a>. Several Fiji
              plugins can be used to access OpenOrganelle datasets. To open a
              dataset with a Fiji-based tool, you will need the URL for a
              dataset (i.e., the location of the data in cloud storage).
              Clicking on the Fiji icon{" "}
              <img className="fiji_icon" src={fijiIcon} alt="blue fiji logo" />{" "}
              copies the dataset URL to the clipboard, which can be pasted in
              the Fiji app.
            </Typography>
            <ul>
              <li>
                The BigDataViewer plugin allows interactive 3D visualization
                of our datasets. This plugin can be accessed by selecting the{" "}
                <Box fontFamily="Monospace" display="inline">
                  Plugins
                </Box>{" "}
                dropdown menu, then selecting{" "}
                <Box fontFamily="Monospace" display="inline">
                  BigDataViewer
                </Box>
                , and finally{" "}
                <Box fontFamily="Monospace" display="inline">
                  N5 Viewer
                </Box>
                . Paste the URL for the dataset of interest in the text entry
                field of the plugin. For detailed instructions refer to the N5
                Viewer
                <a href="https://github.com/saalfeldlab/n5-viewer">
                  {" "}
                  documentation
                </a>
                . Note that this plugin does not allow directly saving full
                volumes to disk (but you can crop out a subregion of the data
                for saving).
              </li>
              <li>
                To open the datasets in Fiji and make use of all of the Fiji
                tools (e.g., saving to disk), select the{" "}
                <Box fontFamily="Monospace" display="inline">
                  {" "}
                  File
                </Box>{" "}
                dropdown menu, then{" "}
                <Box fontFamily="Monospace" display="inline">
                  {" "}
                  Import
                </Box>
                , then{" "}
                <Box fontFamily="Monospace" display="inline">
                  N5
                </Box>
                , and paste the URL for the dataset of interest in the text
                entry field. For instructions on opening our datasets in Fiji
                please refer to this{" "}
                <a href="https://github.com/saalfeldlab/n5-ij">
                  documentation
                </a>
                . Be advised that this method causes Fiji to load an entire
                image volume into memory, which will fail for large image
                volumes. Additionally, this option currently does not generate
                a representation of data that supports interactive 3D
                visualization.
              </li>
            </ul>
            <p className="anchor" id="python" />
            <Typography variant="h5" gutterBottom>
              How do I open data with Python?
            </Typography>
            <Typography paragraph>
              To programatically access generic data stored on s3 from Python,
              we recommend the package fsspec. For efficient access to image
              data, we recommend combining fsspec with the zarr-python library
              and the parallelization library Dask, all of which can be
              installed via pip:
              <CodeBlock
                text={`$ pip install "fsspec[s3]" "zarr" "dask"`}
                language=""
                showLineNumbers={false}
                theme={dracula}
              />
              Or conda:
              <CodeBlock
                text={`$ conda install -c conda-forge s3fs fsspec zarr dask`}
                language=""
                showLineNumbers={false}
                theme={dracula}
              />
              The following example demonstrates browsing an s3 bucket with
              fsspec, then accessing data via zarr and dask.
              <CodeBlock
                text={
                  ">>> import fsspec, zarr\n" +
                  ">>> import dask.array as da # we import dask to help us manage parallel access to the big dataset\n" +
                  ">>> group = zarr.open(zarr.N5FSStore('s3://janelia-cosem-datasets/jrc_hela-2/jrc_hela-2.n5', anon=True)) # access the root of the n5 container\n" +
                  ">>> zdata = group['em/fibsem-uint16/s0'] # s0 is the the full-resolution data for this particular volume\n" +
                  ">>> zdata\n" +
                  "<zarr.core.Array '/em/fibsem-uint16/s0' (6368, 1600, 12000) uint16>\n" +
                  ">>> ddata = da.from_array(zdata, chunks=zdata.chunks)\n" +
                  ">>> ddata\n" +
                  "dask.array<array, shape=(6368, 1600, 12000), dtype=uint16, chunksize=(64, 64, 64), chunktype=numpy.ndarray>\n" +
                  ">>> result = ddata[0].compute() # get the first slice of the data as a numpy array\n"
                }
                language="python"
                showLineNumbers={false}
                theme={dracula}
              />
              <br></br>
              For convenience, all of the above functionality is contained in a
              python library we maintain ({" "}
              <a href="https://github.com/janelia-cosem/fibsem-tools">
                <Box component="span" fontFamily="Monospace" display="inline">
                  {" "}
                  fibsem_tools
                </Box>
              </a>
              ). As in the Fiji examples, the Python library addresses datasets
              through their URL. See the{" "}
              <Box component="span" fontFamily="Monospace" display="inline">
                {" "}
                fibsem_tools
              </Box>{" "}
              <a href="https://github.com/janelia-cosem/fibsem-tools#usage">
                documentation
              </a>{" "}
              for code examples.
            </Typography>
            <p className="anchor" id="aws-cli" />
            <Typography variant="h5" gutterBottom>
              How do I access data with the AWS CLI?
            </Typography>
            <Typography paragraph>
              As all our datasets are stored publicly on AWS S3, it is possible
              to access the underlying files through any tool that can read from
              S3. We recommend using the AWS command line interface (AWS CLI).{" "}
              <br />
              When run from the command line, this command lists the contents of
              our data bucket:
              <CodeBlock
                text="aws cli ls s3://janelia-cosem-datasets/"
                language=""
                showLineNumbers={false}
                theme={dracula}
              />
              The AWS CLI can also copy data from S3 to local storage, but be
              advised that this may take a long time. Detailed instructions for
              using this tool can be found in the{" "}
              <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html">
                user guide
              </a>.
            </Typography>
            <Typography>If you do not have an AWS account, you may see an error relating to missing credentials when you attempt to copy data. This error should resolve if you add &quot;--no-sign-requests&quot; to the AWS CLI command.</Typography>
            <p className="anchor" id="globus" />
            <Typography variant="h5" gutterBottom>
              How do I access data via globus?
            </Typography>
            <Typography paragraph>
              If your institution is connected to <a href="https://www.globus.org">Globus</a>
              {" "}network and has access to the <a href="https://www.globus.org/connectors/amazon-s3">globus s3 connector</a>,
              then you can download data from s3 using the globus client. 
            </Typography>
            <Typography variant="h5" gutterBottom>
              How do I access the analysis database?
            </Typography>
            <Typography paragraph>
              The code used to process predictions and perform analysis can be
              found in our{" "}
              <a href="https://github.com/janelia-cosem/hot-knife/tree/cosem-analysis">
                GitHub repository
              </a>
              .
            </Typography>
            <Typography variant="h5" gutterBottom>
              Who can I contact about downloading data?
            </Typography>
            <Typography paragraph>
              For more help or options accessing or downloading data please
              reach out to{" "}
              <a href="mailto:cosemdata@janelia.hhmi.org">
                cosemdata@janelia.hhmi.org
              </a>
            </Typography>
          </Paper>

          <p className="anchor" id="measurements" />
          <Paper className={classes.section}>
            <Typography variant="h4" gutterBottom>
              Measurements
            </Typography>
            <Typography variant="h5" gutterBottom>
              How do I search for a certain organelle measurement?
            </Typography>
            <Typography paragraph>
              If a dataset has measurements available you can find it under the{" "}
              <Link to="/measurements">Measurements</Link> page. To browse:
            </Typography>
            <ol>
              <li>
                First select a dataset:{" "}
                <b>Interphase HeLa cell (jrc_hela-2)</b>
              </li>
              <li>
                Then select the first organelle you are interested in:{" "}
                <b>ER</b>
              </li>
              <li>
                You next have the option to select a second organelle to look
                at contact sites: <b>Mitochondria</b>. This step is optional,
                if left blank only the measurements for the first organelle
                will be displayed.
              </li>

              <li>
                Lastly, select the measurements you are interested in seeing.
                Multiple measurements can be selcted:{" "}
                <b>Surface Area (nm^2)</b>,<b>Volume (nm^3)</b>, <b>ID</b>{" "}
              </li>
            </ol>
            <Typography paragraph>
              After clicking <b>Search</b>, a table will be populated with the
              measurements within the dataset that were selected. Below the
              table is an interactive graph representing the measurements.
            </Typography>
          </Paper>

          <p className="anchor" id="code" />
          <Paper className={classes.section} id="code">
            <Typography variant="h4" gutterBottom>
              Related software and code
            </Typography>
            <Typography variant="h5" gutterBottom>
              How do you access the related software for segmentation generation
              and analysis?
            </Typography>
            <Typography gutterBottom>
              All of the software we developed for preparing, analyzing, and
              visualizing these datasets is open source. These tools can be
              found on the <a href="https://github.com/janelia-cosem/">COSEM</a>{" "}
              and <a href="https://github.com/saalfeldlab/">Saalfeld lab</a>{" "}
              github pages.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Network training and validation
            </Typography>
            <Typography gutterBottom>
              Source code:{" "}
              <a href="https://github.com/saalfeldlab/CNNectome">
                https://github.com/saalfeldlab/CNNectome
              </a>
            </Typography>
            <Typography gutterBottom>
              Training setups for Heinrich et al., 2020:{" "}
              <a href="https://github.com/janelia-cosem/training_setups/">
                https://github.com/janelia-cosem/training_setups/
              </a>
            </Typography>

            <Typography gutterBottom>
              Train your own networks from scratch with CNNectome: a collection
              of scripts for building, training and validating Convolutional
              Neural Networks (CNNs).
            </Typography>
            <Typography variant="h6" gutterBottom>
              Network inference
            </Typography>
            <Typography gutterBottom>
              Source code:{" "}
              <a href="https://github.com/saalfeldlab/simpleference">
                https://github.com/saalfeldlab/simpleference
              </a>
            </Typography>
            <Typography gutterBottom>
              Generate predictions from trained networks with simpleference: a
              low overhead conv-net inference for large 3D volumes.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Segmentation processing and quantification
            </Typography>
            <Typography gutterBottom>
              Source code:{" "}
              <a href="https://github.com/janelia-cosem/cosem-segmentation-analysis">
                https://github.com/janelia-cosem/cosem-segmentation-analysis
              </a>
            </Typography>
            <Typography gutterBottom>
              Refinements applied for Heinrich et al., 2020:{" "}
              <a href="https://github.com/janelia-cosem/refinements">
                https://github.com/janelia-cosem/refinements
              </a>
            </Typography>

            <Typography gutterBottom>
              Post-process raw network predictions and generate quantitative
              metrics from segmentations with the code we provide.
            </Typography>
            <Typography variant="h6" gutterBottom>
              CLEM registration
            </Typography>
            <Typography gutterBottom>
              Source code:{" "}
              <a href="https://github.com/janelia-cosem/cosem-lm-em-registration/">
                https://github.com/janelia-cosem/cosem-lm-em-registration/
              </a>
            </Typography>
            <Typography gutterBottom>
              Generate your own transformations for CLEM registration or apply
              transformations using the scripts and code we provide.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Manual pairwise prediction evaluation
            </Typography>
            <Typography gutterBottom>
              Source code:{" "}
              <a href="https://github.com/janelia-cosem/Fiji_COSEM_Predictions_Evaluation">
                https://github.com/janelia-cosem/Fiji_COSEM_Predictions_Evaluation
              </a>
            </Typography>
            <Typography gutterBottom>
              Install the Fiji plugin we used to evaluate network predictions.
            </Typography>

            <Typography variant="h5" gutterBottom>
              What software was used to create the training data for ML
              predictions?
            </Typography>
            <Typography gutterBottom>
              Training data used for ML predictions by the COSEM Project Team
              were generated using Amira and Paintera. For more information
              please reference{" "}
              <a href="https://doi.org/10.1038/s41586-021-03977-3">
                Heinrich et al.,2021
              </a>{" "}
              or reach out to us at{" "}
              <a href="mailto:cosemdata@janelia.hhmi.org">
                cosemdata@janelia.hhmi.org
              </a>{" "}
              we are happy to provide tutorials and protocols!
            </Typography>
          </Paper>

          <p className="anchor" id="sharing" />
          <Paper className={classes.section}>
            <Typography variant="h4" gutterBottom>
              Sharing
            </Typography>
            <Typography variant="h5" gutterBottom>
              How do I cite data used on OpenOrganelle?
            </Typography>
            <Typography paragraph>
              We invite you to share and use this data broadly! The data is
              licensed under{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
                CC BY 4.0
              </a>
              . You are free to share and adapt this data. We ask that you
              please be sure to{" "}
              <i>cite the data DOIs and the related publication(s)</i>. All of
              this information can be found listed on the individual data page.
              If you are redistributing the data, please link back to
              OpenOrganelle.To cite OpenOrganelle itself, please reference{" "}
              <a href="https://doi.org/10.1038/s41586-021-03977-3">
                Heinrich et al., Nature (2021)
              </a>
              .
            </Typography>

            <Typography paragraph>
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
            </Typography>

            <Typography paragraph>
              We welcome you to visit our GitHub organization,{" "}
              <a href="https://github.com/janelia-cosem">janelia-cosem</a>, to
              access all of our code and software. More information about the
              software used and written for this project can be found in the{" "}
              Code section above.
            </Typography>

            <Typography paragraph>
              For inquiries about contributing to this platform please contact:{" "}
              <a href="mailto:cosemdata@janelia.hhmi.org">
                cosemdata@janelia.hhmi.org
              </a>
            </Typography>

            <Typography paragraph>
              Please see our <Link to="/terms_of_use">Terms of use</Link> for
              more details.
            </Typography>
          </Paper>
        </div>
      </Grid>
    </Grid>
  );
}
