import React from "react";
import { useQuery } from "react-query";
import { DataGrid } from "@material-ui/data-grid";

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

interface resultsProps {
  cypher: string;
}

export default function AnalysisResults({ cypher }: resultsProps) {
  const { isLoading, isError, data, error } = useQuery(
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

  if (isError) {
    return <p>There was an error with your request</p>;
  }

  console.log(data);

  const columns = [
    { field: "organelle.ID", headerName: "ID", type: "number", width: 150 },
    {
      field: "organelle.surfaceArea",
      headerName: "Surface Area",
      width: 150,
      type: "number"
    },
    {
      field: "organelle.volume",
      headerName: "Volume",
      width: 150,
      type: "number"
    }
  ];


  interface gridObject {
    id: number,
    [key: string]: any
  };

  interface rowObject {
    row: string[]
  }


  const dataRows = data.data.map((row: rowObject, rowNum: number) => {
    const rowObject: gridObject = { id: rowNum};
    data.columns.forEach((header: string, i: number) => {
      rowObject[header] = row.row[i];
    });
    return rowObject;
  });

  console.log(dataRows);

  if (data) {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid rows={dataRows} columns={columns} pageSize={50} />
      </div>
    );
  }
  return <p>Results for query {cypher} here</p>;
}
