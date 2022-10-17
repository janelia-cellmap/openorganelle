import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { Card } from "@mui/material";

import AnalysisDataTable from "./AnalysisDataTable";
import AnalysisConnectionsGraphic from "./AnalysisConnectionsGraphic";
import NeuroglancerLink from "./NeuroglancerLink";
import { fetchAnalysisResults, queryResponse } from "../utils/datafetching";
import { useQueryString } from "../utils/customHooks";
import {
  convertLabelToOrganelle,
  convertLabelToOrganelleAbbreviation
} from "../utils/organelles";
import { fetchDatasets } from "../context/DatasetsContext";

interface ACProps {
  cypher: string;
  datasetKey: string;
}

export default function AnalysisConnections({ cypher, datasetKey }: ACProps) {
  const { isLoading: isAnalysisLoading, isError: isAnalysisError, data: analysisData, error: analysisError }: queryResponse = useQuery(
    ["analysisConnection", cypher],
    () => fetchAnalysisResults(cypher),
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );
  
  const { isLoading: isDatasetsLoading, isError: isDatasetsError, data: datasetsData, error: datasetsError } = useQuery('datasets', async () => fetchDatasets());

  const queryString = useQueryString();

  if (isAnalysisLoading || isDatasetsLoading) {
    return <p>Loading...</p>;
  }

  if (isAnalysisError && analysisError) {
    return <p>There was an error with your request: {analysisError.message}</p>;
  }

  if (isDatasetsError && (datasetsError instanceof Error)) {
    return <p>There was an error loading datasets: {datasetsError.message}</p>;
  }
  const dataset = datasetsData?.get(datasetKey)!
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

  const dataRows: string[] = analysisData.data.map((entry: any) => {
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
