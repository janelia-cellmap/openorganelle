import React from "react";
import Typography from "@material-ui/core/Typography";

export default function About() {
  return (
    <div className="content">
      <Typography variant="h3" gutterBottom style={{ marginTop: "2em", textAlign: "center" }}>
        Welcome to HHMI Janelia’s OpenOrganelle.
      </Typography>
      <div
        style={{ maxWidth: "45em", marginLeft: "auto", marginRight: "auto" }}
      >
        <p style={{ textIndent: "3ch" }}>
          On this data portal we present large volume, high resolution
          3D-Electron Microscopy (EM) datasets, acquired with the enhanced
          focused ion beam scanning electron microscopy (FIB-SEM) technology
          developed at Janelia (Xu et al. 2017, Xu et al. 2020a, Xu et al.
          2020b). Accompanying these EM volumes are automated segmentations of
          intracellular sub-structures made possible by the COSEM Project Team
          (add references).
        </p>

        <p style={{ textIndent: "3ch" }}>
          Within Janelia are some of the world’s leading experts in Machine
          Learning (Saalfeld lab and Funke lab), Cell Biology
          (Lippincott-Schwartz lab), and large-volume, high-resolution EM data
          acquisition (Hess lab and FIB-SEM Technology). This provides a unique
          opportunity for COSEM to expand research that lies at the intersection
          of those fields and drive forward our tools to study and knowledge
          about subcellular structures.{" "}
        </p>

        <p style={{ textIndent: "3ch" }}>
          The unprecedented volume and resolution of EM datasets generated by
          the enhanced FIB-SEM platform (FIB-SEM Technology and Hess Lab) both
          demands and enables the development of universal machine learning
          classifiers for the automatic detection of sub-cellular structures in
          these data. The COSEM team, in collaboration with the Saalfeld and
          Funke labs with biological guidance from the Lippincott-Schwartz lab,
          has begun tackling the segmentation problem as well as the subsequent
          large-scale quantitative analysis of these data to answer biological
          questions.{" "}
        </p>

        <p style={{ textIndent: "3ch" }}>
          On this site you will find all datasets, training data and
          segmentations available for online viewing and download. Be sure to
          also check out our tutorials to learn how to work with the data
          yourself and our publications list to learn more!
        </p>
      </div>
    </div>
  );
}
