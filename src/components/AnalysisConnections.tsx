import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import AnalysisDataTable from "./AnalysisDataTable";
import AnalysisConnectionsGraphic from "./AnalysisConnectionsGraphic";
import NeuroglancerLink from "./NeuroglancerLink";

import { Dataset, makeDatasets } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import { fetchAnalysisResults, queryResponse } from "../utils/datafetching";
import { useQueryString } from "../utils/customHooks";
import {
  convertLabelToOrganelle,
  convertLabelToOrganelleAbbreviation
} from "../utils/organelles";

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
  const { appState, setAppState } = useContext(AppContext);

  // Update the global datasets var when Home renders for the first time
  useEffect(() => {
    setAppState({ ...appState, datasetsLoading: true });
    makeDatasets(appState.dataBucket).then(ds =>
      setAppState({ ...appState, datasets: ds, datasetsLoading: false })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dataset: Dataset = appState.datasets.get(datasetKey)!;

  const queryString = useQueryString();

  if (isLoading || appState.datasetsLoading) {
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
      <p>Connections for {cypher}</p>
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
