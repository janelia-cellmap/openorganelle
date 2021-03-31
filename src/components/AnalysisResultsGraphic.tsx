import React from "react";
import ForceGraph3D, { NodeObject } from "react-force-graph-3d";

interface CustomNodeObject extends NodeObject {
  org?: string;
  name?: string;
}

interface AnalysisResultsGraphicProps {
  data: any;
}

export default function AnalysisResultsGraphic({ data }: AnalysisResultsGraphicProps) {
  const nodeLookup = new Set();
  const nodes: any[] = [];
  const links: any[] = [];

  data.forEach((item: any) => {
    console.log(item);
    if (!nodeLookup.has(item.organelleA_ID)) {
      nodes.push({
        id: item.organelleA_ID,
        name: item.organelleA_ID,
        org: "er",
        val: 1
      });
      nodeLookup.add(item.organelleA_ID);
    }
    if (!nodeLookup.has(item.organelleB_ID)) {
      nodes.push({
        id: item.organelleB_ID,
        name: item.organelleB_ID,
        org: "mt",
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
        return `<span style="color:#000">${node.name} (${node.org})<span>`;
      }}
      nodeColor={(node: CustomNodeObject) => {
        if (node.org === "er") {
          return "#ff0000";
        } else {
          return "#00ff00";
        }
      }}
    />
  );
}
