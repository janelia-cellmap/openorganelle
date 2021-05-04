import React from "react";
import { useQuery } from "react-query";
import AnalysisDataTable from "./AnalysisDataTable";
import AnalysisResultsGraphic from "./AnalysisResultsGraphic";
import { organelleTitles } from "../utils/organelles";
import { fetchAnalysisResults, queryResponse } from "../utils/datafetching";

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
  contact_ID: "Contact ID",
  "contact.surfaceArea": "Surface Area (nm^2)",
  "contact.planarity": "Planarity (0-1)"
};

// remap the organelleA and organelleB ids to the organelle names
function setHeaderName(columnName: string, organelles: any[]) {
  if (columnName.match(/organelleA/)) {
    const fullName = organelles[0].full;
    return `${fullName} ID`;
  }
  if (columnName.match(/organelleB/)) {
    const fullName = organelles[1].full;
    return `${fullName} ID`;
  }
  return headerNames[columnName];
}

function formatColumnHeader(columnName: string, organelles: any[]) {
  return {
    accessor: columnName.replace(".", "_"),
    Header: setHeaderName(columnName, organelles)
  };
}

interface resultsProps {
  cypher: string;
  organelleA: string;
  organelleB: string;
}

export default function AnalysisResults({
  cypher,
  organelleA,
  organelleB
}: resultsProps) {
  const organelleLabels = [organelleA, organelleB].map(org => ({
    abbr: org,
    full: organelleTitles[org]
  }));

  const { isLoading, isError, data, error }: queryResponse = useQuery(
    ["analysis", cypher],
    () => fetchAnalysisResults(cypher),
    { staleTime: Infinity, refetchOnWindowFocus: false }
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

  // Columns list needs to be modified based on the query type
  // and measurements selected.
  // loop over the columns in the 'data' object to figure out which
  // ones are present
  const columns = data.columns
    .filter((column: string) => !column.match(/intId.*/))
    .map((column: string) => formatColumnHeader(column, organelleLabels));

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

    return (
      <>
        <AnalysisDataTable data={dataRows} columns={columns} />
        {organelleB !== "" ? (
          <AnalysisResultsGraphic
            data={dataRows}
            organelles={organelleLabels}
          />
        ) : (
          ""
        )}
      </>
    );
  }
  return null;
}
