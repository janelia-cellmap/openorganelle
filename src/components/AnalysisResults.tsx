import React from "react";
import { useQuery } from "react-query";
import AnalysisDataTable from "./AnalysisDataTable";

function fetchAnalysisResults(cypher: string) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic bmVvNGo6QWlFc2h0ZUMwUzNNIQ==`
    },
    body: JSON.stringify({ statements: [{ statement: cypher }] })
  };

  return fetch("http://vmdmz122.int.janelia.org:7474/db/graph.db/tx", options)
    .then(response => response.json())
    .then(res => {
      if (res.results) {
        return res.results[0];
      }
      return;
    });
}

type headerLookup = {
  [key: string]: string;
};

const headerNames: headerLookup = {
  "organelle.ID": "ID",
  "organelle.surfaceArea": "Surface Area (nm^2)",
  "organelle.volume": "Volume (nm^3)",
  "organelle.length": "Length (nm)",
  "organelle.planarity": "Planarity (0-1)",
  "organelleA.ID": "Organelle ID",
  "organelleB.ID": "Connected Organelle ID",
  "contact.volume": "Volume (nm^2)",
  "contact.ID": "ID",
  "contact.surfaceArea": "Surface Area (nm^2)",
  "contact.planarity": "Planarity (0-1)"
};

function formatColumnHeader(columnName: string, organelles: string[]) {
  // TODO: remap the organelleA and organelleB ids to the organelle names?
  return {
    accessor: columnName.replace(".", "_"),
    Header: headerNames[columnName]
  };
}

interface resultsProps {
  cypher: string;
  organelleA: string;
  organelleB: string;
}

interface queryResponse {
  isLoading: boolean;
  isError: boolean;
  data: any;
  error: any;
}

export default function AnalysisResults({
  cypher,
  organelleA,
  organelleB
}: resultsProps) {
  const { isLoading, isError, data, error }: queryResponse = useQuery(
    ["analysis", cypher],
    () => fetchAnalysisResults(cypher),
    { staleTime: 30000 }
  );
  if (!cypher) {
    return (
      <p> Please select a dataset, organelle and measurements from above</p>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError && error) {
    return <p>There was an error with your request: {error.message}</p>;
  }

  // Columns list needs to be modified based on the query type and measurements
  // selected.
  // loop over the columns in the 'data' object to figure out which ones are present
  const columns = data.columns.map((column: string) =>
    formatColumnHeader(column, [organelleA, organelleB])
  );

  interface gridObject {
    id: number;
    [key: string]: any;
  }

  interface rowObject {
    row: string[];
  }

  if (data) {
    const dataRows = data.data.map((row: rowObject, rowNum: number) => {
      const rowObject: gridObject = { id: rowNum };
      data.columns.forEach((header: string, i: number) => {
        rowObject[header.replace(".", "_")] = row.row[i];
      });
      return rowObject;
    });

    return <AnalysisDataTable data={dataRows} columns={columns} />;
  }
  return <p>Results for query {cypher} here</p>;
}
