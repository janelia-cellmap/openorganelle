import React from "react";
import { Route, Switch } from "react-router-dom";
import "./Organelles.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { View } from "../types/datasets";
import { useQuery } from "react-query";
import { fetchViews } from "../api/views";
import OrganelleGrid from "./Organelles/Grid";
import OrganelleDetails from "./Organelles/Details";


export type Organelles = "cent"
  | "chrom"
  | "echrom"
  | "hchrom"
  | "er"
  | "eres"
  | "endo"
  | "ecs"
  | "golgi"
  | "ld"
  | "lyso"
  | "mt"
  | "mito"
  | "ne"
  | "np"
  | "nucleolus"
  | "nucleus"
  | "pm"
  | "ribo"
  | "vesicle"

export type OrganelleMetadata = {
  name: string
  infoUrl: string
}

export const organelles: Record<Organelles, OrganelleMetadata> = {
  cent: {
    name: "Centrosome",
    infoUrl: "https://en.wikipedia.org/wiki/Centrosome"
  },
  chrom: {
    name: "Chromatin",
    infoUrl: "https://en.wikipedia.org/wiki/Chromatin"
  },
  echrom: {
    name: "Euchromatin",
    infoUrl: "https://en.wikipedia.org/wiki/Euchromatin"
  },
  hchrom: {
    name: "Heterochromatin",
    infoUrl: "https://en.wikipedia.org/wiki/Heterochromatin"
  },
  er: {
    name: "Endoplasmic Reticulum",
    infoUrl: "https://en.wikipedia.org/wiki/Endoplasmic_reticulum"
  },
  eres: {
    name: "Endoplasmic Reticulum Exit Site",
    infoUrl: "https://en.wikipedia.org/wiki/Endoplasmic_reticulum"
  },
  endo: {
    name: "Endosomal Network",
    infoUrl: "https://en.wikipedia.org/wiki/Endomembrane_system"
  },
  ecs: {
    name: "Extracellular Space",
    infoUrl: "https://en.wikipedia.org/wiki/Extracellular_space"
  },
  golgi: {
    name: "Golgi",
    infoUrl: "https://en.wikipedia.org/wiki/Golgi_apparatus"
  },
  ld: {
    name: "Lipid Droplet",
    infoUrl: "https://en.wikipedia.org/wiki/Lipid_droplet",
  },
  lyso: {
    name: "Lysosome",
    infoUrl: "https://en.wikipedia.org/wiki/Lysosome"
  },
  mt: {
    name: "Microtubule",
    infoUrl: "https://en.wikipedia.org/wiki/Microtubule"
  },
  mito: {
     name: "Mitochondria",
     infoUrl: "https://en.wikipedia.org/wiki/Mitochondrion"
    },
  ne: {
    name: "Nuclear Envelope",
    infoUrl: "https://en.wikipedia.org/wiki/Nuclear_envelope"
   },
  np: {
    name: "Nuclear Pore",
    infoUrl: "https://en.wikipedia.org/wiki/Nuclear_pore"
  },
  nucleolus: {
    name: "Nucleolus",
    infoUrl: "https://en.wikipedia.org/wiki/Nucleolus"
  },
  nucleus: {
    name: "Nucleus",
    infoUrl: "https://en.wikipedia.org/wiki/Cell_nucleus"
  },
  pm: {
    name: "Plasma Membrane",
    infoUrl: "https://en.wikipedia.org/wiki/Cell_membrane"
  },
  ribo: {name: "Ribosome",
  infoUrl: "https://en.wikipedia.org/wiki/Ribosome"
},
  vesicle: {
    name: "Vesicle",
    infoUrl: "https://en.wikipedia.org/wiki/Vesicle_(biology_and_chemistry)"
  }
}



export interface OrganelleCardsProps {
  info: OrganelleMetadata
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


  const viewsByTag = data?.reduce((previous, current) => {
    if (current.images.length > 0) {
      current.tags.forEach((t) => {
        if (Object.keys(organelles).includes(t)) {
          const val = previous.get(t)
          if (val === undefined) {
            previous.set(t, [current])
          }
          else {
            previous.set(t, [...val, current])
          }
        }
        else {
          console.log(`Tag ${t} could not be found in the list of organelles`)
      }
      })
    }
    else { console.log(`The following view is missing its images: ${JSON.stringify(current)}`) }
    return previous
  }, new Map<string, View[]>) || new Map<string, View[]>();

  return (
    <Switch>
      <Route path="/organelles/:organelle">
        <OrganelleDetails views={viewsByTag} />
      </Route>
      <Route path="/organelles" exact>
        <OrganelleGrid views={viewsByTag} />
      </Route>
    </Switch>
  );
}

// TODO: subgallery: hover contains content about the dataset, two links
// one to the dataset, one to neuroglancer (new tab)
