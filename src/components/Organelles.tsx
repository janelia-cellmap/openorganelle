import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const tableData = [
  [
    "Centrosome",
    "Barrel-shaped structure composed of microtubule triplets. Centrioles are often found in pairs and microtubule staining is dark and distinct. A cross section of centriole ends is a round, nine-fold star shape. Skeleton annotations in BigCat are used to trace each microtubule of the barrel structure. These skeletons are then used to inpaint a full microtubule by XXnm and painted into the volume. Voxel classification is used to annotate distal (D App) and subdistal appendages (SD App).",
    ""
  ],
  ["Centrosome Distal Appendage", "", ""],
  ["Centrosome Subdistal Appendage", "", ""],
  ["Chromatin", "Protein and DNA complexes within the nucleus.", ""],
  [
    "Euchromatin",
    "Light, single chromatin within the nucleus. Euchromatin stain is lighter and less compact than heterochromatin. Nucleolus euchromatin (N-E Chrom) is not associated with or connected to euchromatin (E Chrom) outside the nucleolus.",
    ""
  ],
  ["Vesicle membrane", "", ""]
];

const contactSites = [
  ["ER - Ribosome Contact Sites", "er_ribo_contacts"],
  ["ER - Golgi Contact Sites", "er_golgi_contacts"],
  ["ER - Mito Contact Sites", "er_mito_contacts"],
  ["Endosome - ER Contact Sites", "endo_er_contacts"],
  ["ER - Plasma Membrane Contat Sites", "er_pm_contacts"],
  ["ER - Vesicle Contact Sites", "er_vesicle_contacts"],
  ["Golgi - Vesicle Contact Sites", "golgi_vesicle_contacts"],
  ["Endosome - Golgi Contact Sites", "endo_golgi_contacts"],
  ["Mito - Plasma Membrane Contact Sites", "mito_pm_contacts"],
  ["ER - Microtubule Contact Sites", "er_mt_contacts"],
  ["Endosome - Microtubule Contact Sites", "endo_mt_contacts"],
  ["Golgi - Microtubule Contact Sites", "golgi_mt_contacts"],
  ["Mitochondria - Microtubule Contact Sites", "mito_mt_contacts"],
  ["Microtubule - Nucleus Contact Sites", "mt_nucleus_contacts"],
  ["Microtubule - Vesicle Contact Sites", "mt_vesicle_contacts"],
  ["Microtubule - Plasma Membrane Contact Sites", "mt_pm_contacts"]
];

const analysisList = [
  [
    "Mitochondria Skeletons",
    "mito_skeleton",
    "Topological thinning to produce skeletons based on Lee et al., 1994"
  ],
  [
    "Mitochondria Skeletons - Longest Shortest Path",
    "mito_skeleton-lsp",
    "Longest shortest path within the pruned skeleton analyzed using Flyoyd Warshall algorithm."
  ],
  [
    "ER Medial Surface",
    "er_medial-surface",
    "Topological thinning to produce medial surfaces based on Lee et al., 1994"
  ],
  [
    "Reconstructed ER from Medial Surface with Connected Components",
    "er_reconstructed",
    "Connected components of a reconstructed ER, created by expanding the ER medial surface by spheres centered at the medial surface with radii equal to the distance transform at each medial surface voxel."
  ],
  [
    "Reconstructed ER from Medial Surface with Curvature",
    "er_curvature",
    "Curvature (planarity) mapped onto er_reconstructed, rescaled from 1 (planarity measure 0) to 255 (planarity measure 1); 0 is background"
  ],
  [
    "Ribosomes classified by contact surface",
    "ribo_classified",
    "Ribosomes classified according to the surface they are in contact with. Namely, planar ER, tubular ER, nucleus, and cytosolic (i.e. no contact)."
  ]
];

export default function Organelles() {
  const tableRows = tableData.map(row => {
    return (
      <TableRow key={row[0]}>
        <TableCell>{row[0]}</TableCell>
        <TableCell>{row[1]}</TableCell>
        <TableCell>
          <a href={row[2]}>link</a>
        </TableCell>
      </TableRow>
    );
  });

  const contactRows = contactSites.map(row => {
    return (
      <TableRow key={row[0]}>
        <TableCell>{row[0]}</TableCell>
        <TableCell>{row[1]}</TableCell>
      </TableRow>
    );
  });

  const analysisRows = analysisList.map(row => {
    return (
      <TableRow key={row[0]}>
        <TableCell>{row[0]}</TableCell>
        <TableCell>{row[1]}</TableCell>
        <TableCell>{row[2]}</TableCell>
      </TableRow>
    );
  });
  return (
    <div>
      <h3>Organelles</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "20em" }}>Organelle</TableCell>
            <TableCell>Description</TableCell>
            <TableCell style={{ width: "5em" }}>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
      <h3>Contact Sites</h3>
      <Table>
        <TableHead>
          <TableCell style={{ width: "20em" }}>Organelle</TableCell>
          <TableCell>File Name</TableCell>
        </TableHead>
        <TableBody>{contactRows}</TableBody>
      </Table>
      <h3>Analysis</h3>
      <Table>
        <TableHead>
          <TableCell style={{ width: "20em" }}>Organelle</TableCell>
          <TableCell>File Name</TableCell>
          <TableCell>Description</TableCell>
        </TableHead>
        <TableBody>
          {analysisRows}
        </TableBody>
      </Table>
    </div>
  );
}
