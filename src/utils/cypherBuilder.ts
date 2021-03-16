// this function will accept a dataset, a list of organelles and a measurement
// value and return a cypher query to run.

interface builderProps {
  dataset: string,
  organelles: string[],
  measurement: string
};

export default function cypherBuilder ({ dataset, organelles, measurement }: builderProps): string {
  return `MATCH(organelle:${organelles[0]}) RETURN organelle.ID,organelle.length,organelle.surfaceArea,organelle.volume`;
}
