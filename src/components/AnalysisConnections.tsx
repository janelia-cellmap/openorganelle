import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import AnalysisDataTable from "./AnalysisDataTable";
import AnalysisConnectionsGraphic from "./AnalysisConnectionsGraphic";
import { fetchAnalysisResults, queryResponse } from "../utils/datafetching";
import { convertLabelToOrganelle } from "../utils/organelles";

interface ACProps {
  cypher: string;
}

export default function AnalysisConnections({ cypher }: ACProps) {
  const { isLoading, isError, data, error }: queryResponse = useQuery(
    ["analysisConnection", cypher],
    () => fetchAnalysisResults(cypher),
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError && error) {
    return <p>There was an error with your request: {error.message}</p>;
  }

  const columns = [
    {
      accessor: "n",
      Header: "Organelle",
    },
    {
      accessor: "r",
      Header: "Connection Id",
    },
    {
      accessor: "c",
      Header: "Connected to Organelle",
      Cell: ({ row }: { row: any}) => {
        const link = `/analysis?id=${row.original.linkId}`;
        console.log(row);
        return <Link to={link}>{row.values.c}</Link>;
      }

    }
  ];

  const dataRows: string[] = data.data.map((entry: any) => {
    const row = {
      n: `${entry.row[0].ID} - ${entry.meta[0].id} - ${convertLabelToOrganelle(entry.row[3][0])}`,
      r: entry.meta[1].id,
      c: `${entry.row[2].ID} - ${entry.meta[2].id} -  ${convertLabelToOrganelle(entry.row[4][0])}`,
      linkId: entry.meta[2].id
    };
    return row;
  });

  return (
    <>
      <p>Connections for {cypher}</p>
      <AnalysisDataTable data={dataRows} columns={columns} />
      <AnalysisConnectionsGraphic />
    </>
  );
}
