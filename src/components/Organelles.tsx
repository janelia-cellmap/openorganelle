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

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{width: "20em"}}>Organelle</TableCell>
            <TableCell>Description</TableCell>
            <TableCell style={{width: "5em"}}>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
}
