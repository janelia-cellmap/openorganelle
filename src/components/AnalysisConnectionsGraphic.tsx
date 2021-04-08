import React from "react";
import ForceGraph3D, { NodeObject } from "react-force-graph-3d";
import { organelleColors } from "../utils/organelles";

interface ACGProps {
  data: any[];
}

interface CustomNodeObject extends NodeObject {
  org?: string;
  name?: string;
  label?: string;
  intId?: string;
}


export default function AnalysisConnectionsGraphic({data}: ACGProps) {
  const nodeLookup = new Set();
  const nodes: any[] = [];
  const links: any[] = [];

  data.forEach((item: any) => {
    if (!nodeLookup.has(item.n)) {
      nodes.push({
        id: item.n,
        name: item.n,
        intId: item.linkId,
        org: item.nOrg,
        label: item.n,
        val: 1
      });
      nodeLookup.add(item.n);
    }
    if (!nodeLookup.has(item.c)) {
      nodes.push({
        id: item.c,
        name: item.c,
        intId: item.linkId,
        org: item.cOrg,
        label: item.c,
        val: 1
      });

      nodeLookup.add(item.c);
    }
    links.push({
      source: item.n,
      target: item.c
    });
    console.log(item);
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
      /* onNodeClick={(node: CustomNodeObject) => {
              if (node.intId) {
          query.set('id', node.intId);
          history.push({
            pathname: "",
            search: query.toString()
          });
        }
        console.log(node.intId);
      }}*/
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
