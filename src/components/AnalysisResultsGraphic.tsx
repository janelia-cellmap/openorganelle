import React from "react";
import ForceGraph3D, { NodeObject } from "react-force-graph-3d";
import { organelleColors } from "../utils/organelles";

interface CustomNodeObject extends NodeObject {
  org?: string;
  name?: string;
  label?: string;
}

interface AnalysisResultsGraphicProps {
  data: any;
  organelles: any[];
}

export default function AnalysisResultsGraphic({ data, organelles }: AnalysisResultsGraphicProps) {
  const nodeLookup = new Set();
  const nodes: any[] = [];
  const links: any[] = [];

  data.forEach((item: any) => {
    if (!nodeLookup.has(item.organelleA_ID)) {
      nodes.push({
        id: item.organelleA_ID,
        name: item.organelleA_ID,
        org: organelles[0].abbr,
        label: organelles[0].full,
        val: 1
      });
      nodeLookup.add(item.organelleA_ID);
    }
    if (!nodeLookup.has(item.organelleB_ID)) {
      nodes.push({
        id: item.organelleB_ID,
        name: item.organelleB_ID,
        org: organelles[1].abbr,
        label: organelles[1].full,
        val: 1
      });
      nodeLookup.add(item.organelleB_ID);
    }
    links.push({
      source: item.organelleA_ID,
      target: item.organelleB_ID
    });
  });

  const myData = {
    nodes,
    links
  };

  return (
    <ForceGraph3D
      graphData={myData}
      width={1000}
      height={500}
      backgroundColor="#fff"
      linkColor={() => "#333"}
      onNodeClick={(node: CustomNodeObject) => console.log(`${node.name} clicked`)}
      nodeLabel={(node: CustomNodeObject) => {
        return `<span style="color:#000">${node.name} (${node.label})<span>`;
      }}
      nodeColor={(node: CustomNodeObject) => {
        const org = node.org || "default";
        return organelleColors[org];
      }}
    />
  );
}
