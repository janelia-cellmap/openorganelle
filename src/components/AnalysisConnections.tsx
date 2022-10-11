import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Card from "@material-ui/core/Card";

import AnalysisDataTable from "./AnalysisDataTable";
import AnalysisConnectionsGraphic from "./AnalysisConnectionsGraphic";
import NeuroglancerLink from "./NeuroglancerLink";
import { fetchAnalysisResults, queryResponse } from "../utils/datafetching";
import { useQueryString } from "../utils/customHooks";
import {
  convertLabelToOrganelle,
  convertLabelToOrganelleAbbreviation
} from "../utils/organelles";
import { useDatasets } from "../context/DatasetsContext";

interface ACProps {
  cypher: string;
  datasetKey: string;
}

export default function AnalysisConnections({ cypher, datasetKey }: ACProps) {
  const { isLoading, isError, data, error }: queryResponse = useQuery(
    ["analysisConnection", cypher],
    () => fetchAnalysisResults(cypher),
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );
  
  const {state} = useDatasets();
  const dataset = state.datasets.get(datasetKey)!;

  const queryString = useQueryString();

  if (isLoading || state.datasetsLoading) {
    return <p>Loading...</p>;
  }

  if (isError && error) {
    return <p>There was an error with your request: {error.message}</p>;
  }

  const columns = [
    {
      accessor: "n",
      Header: "Organelle"
    },
    {
      accessor: "r",
      Header: "Connection Id"
    },
    {
      accessor: "c",
      Header: "Connected to Organelle",
      Cell: ({ row }: { row: any }) => {
        queryString.set("id", row.original.linkId);
        const link = `?${queryString.toString()}`;
        return <Link to={link}>{row.values.c}</Link>;
      }
    }
  ];

  const dataRows: string[] = data.data.map((entry: any) => {
    const row = {
      n: `${entry.row[0].ID} - ${convertLabelToOrganelle(entry.row[3][0])}`,
      nId: entry.row[0].ID,
      nIntId: entry.meta[0].id,
      nOrgFull: convertLabelToOrganelle(entry.row[3][0]),
      nOrg: convertLabelToOrganelleAbbreviation(entry.row[3][0]),
      r: entry.meta[1].id,
      c: `${entry.row[2].ID} - ${convertLabelToOrganelle(entry.row[4][0])}`,
      cId: entry.row[2].ID,
      cIntId: entry.meta[2].id,
      cOrgFull: convertLabelToOrganelle(entry.row[4][0]),
      cOrg: convertLabelToOrganelleAbbreviation(entry.row[4][0]),
      linkId: entry.meta[2].id
    };
    return row;
  });

  const checkState = new Map([["fibsem-unit8", {selected: true}]]);

  return (
    <>
      {process.env.NODE_ENV !== "production" ? (
        <Card style={{ padding: "1em", margin: "1em" }}>
          <code>{cypher}</code>
        </Card>
      ) : (
        ""
      )}
      <AnalysisDataTable data={dataRows} columns={columns} />
      <AnalysisConnectionsGraphic data={dataRows} />
      <NeuroglancerLink
        dataset={dataset}
        checkState={checkState}
        view={dataset.views[0]}
      />
    </>
  );
}
