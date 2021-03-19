// this function will accept a dataset, a list of organelles and a measurement
// value and return a cypher query to run.

interface CypherBuilderProps {
  dataset: any;
  organelles: string[];
  measurement: any
}

export default function cypherBuilder({dataset, organelles, measurement}: CypherBuilderProps) {
  return (`MATCH(organelle:${organelles[0]}) RETURN organelle.ID,organelle.length,organelle.surfaceArea,organelle.volume`)
}
