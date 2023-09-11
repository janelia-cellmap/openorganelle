import React from "react";
import { Route, Switch } from "react-router-dom";
import "./Organelles.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Taxon, View } from "../types/database";
import { useQuery } from "react-query";
import { fetchViews } from "../api/views";
import OrganelleGrid from "./Organelles/Grid";
import OrganelleDetails from "./Organelles/Details";

export interface OrganelleCardsProps {
  taxon: Taxon
  views: View[]
}

export default function Organelles() {
  const { isLoading, data, error } = useQuery('views', async () => fetchViews());
  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) { return <p>There was an error fetching view metadata.</p> }

  // Collect all taxa. This reduce could be combined with the 
  // collection of the views   
  const taxa = data?.reduce((previous, current) => {
    current.taxa.forEach(taxon => {
          const val = previous.get(taxon.shortName)
          if (val === undefined) {
            previous.set(taxon.shortName, taxon)
          }
      });
      return previous
    },    
  new Map<string, Taxon>())!

  const viewsByTaxon = data?.reduce((previous, current) => {
    if (current.imagery.length > 0) {
      current.taxa.forEach((t) => {
          const val = previous.get(t.shortName)
          if (val === undefined) {
            previous.set(t.shortName, [current])
          }
          else {
            previous.set(t.shortName, [...val, current])
          }
      })
    }
    else { console.log(`The following view is missing its images: ${JSON.stringify(current, null, 2)}`) }
    return previous
  }, new Map<string, View[]>) || new Map<string, View[]>();

  return (
    <Switch>
      <Route path="/organelles/:organelle">
        <OrganelleDetails taxa={taxa} views={viewsByTaxon} />
      </Route>
      <Route path="/organelles" exact>
        <OrganelleGrid taxa={taxa} views={viewsByTaxon} />
      </Route>
    </Switch>
  );
}
