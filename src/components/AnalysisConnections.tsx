import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import AnalysisDataTable from "./AnalysisDataTable";
import AnalysisConnectionsGraphic from "./AnalysisConnectionsGraphic";
import { fetchAnalysisResults, queryResponse } from "../utils/datafetching";
import { useQueryString } from "../utils/customHooks";
import {
  convertLabelToOrganelle,
  convertLabelToOrganelleAbbreviation
} from "../utils/organelles";

interface ACProps {
  cypher: string;
}

export default function AnalysisConnections({ cypher }: ACProps) {
  const { isLoading, isError, data, error }: queryResponse = useQuery(
    ["analysisConnection", cypher],
    () => fetchAnalysisResults(cypher),
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  const queryString = useQueryString();

  if (isLoading) {
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
        queryString.set('id', row.original.linkId);
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

  return (
    <>
      <p>Connections for {cypher}</p>
      <AnalysisDataTable data={dataRows} columns={columns} />
      <AnalysisConnectionsGraphic data={dataRows} />
    </>
  );
}
