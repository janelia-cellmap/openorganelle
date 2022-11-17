import React from "react";
import { View } from "../../types/datasets";
import { useParams } from "react-router-dom";

interface OrganelleDetailProps {
  views: Map<string, View[]>;
}

type PostParams = {
  organelle: string;
};

interface OrganelleDetailProps {
  views: Map<string, View[]>;
}

export default function OrganelleDetails({ views }: OrganelleDetailProps) {
  const { organelle } = useParams<PostParams>();
  console.log({organelle, views});
  const selectedOrganelle = views.get(organelle) || [{name: undefined}];
  return (<p>Organelle Details for {selectedOrganelle[0].name}</p>);
}
