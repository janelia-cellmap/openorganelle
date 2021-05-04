import React from "react";
import { useHistory } from "react-router-dom";
import ForceGraph3D, { NodeObject } from "react-force-graph-3d";
import { organelleColors } from "../utils/organelles";
import { useQueryString } from "../utils/customHooks";

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
  const query = useQueryString();
  const history = useHistory();

  const nodeLookup = new Set();
  const nodes: any[] = [];
  const links: any[] = [];

  data.forEach((item: any) => {
    if (!nodeLookup.has(item.n)) {
      nodes.push({
        id: item.n,
        name: item.nOrgFull,
        intId: item.nIntId,
        org: item.nOrg,
        label: item.nId,
        val: 1
      });
      nodeLookup.add(item.n);
    }
    if (!nodeLookup.has(item.c)) {
      nodes.push({
        id: item.c,
        name: item.cOrgFull,
        intId: item.cIntId,
        org: item.cOrg,
        label: item.cId,
        val: 1
      });

      nodeLookup.add(item.c);
    }
    links.push({
      source: item.n,
      target: item.c
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
      onNodeClick={(node: CustomNodeObject) => {
       if (node.intId) {
          query.set('id', node.intId);
          history.push({
            pathname: "",
            search: query.toString()
          });
        }
      }}
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
