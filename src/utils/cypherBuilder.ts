// this function will accept a dataset, a list of organelles and a measurement
// value and return a cypher query to run.

interface builderProps {
  dataset: string,
  organelles: string[],
  measurements: string[]
};

export default function cypherBuilder ({ dataset, organelles, measurements }: builderProps): string | undefined {
  const query = undefined;
  // are all parameters present
  if (!dataset || !organelles || organelles.length < 1 || !measurements || measurements.length < 1) {
    return query;
  }

  // is this a contact query or a single organelle query
  const isContactQuery = organelles.length > 1;
  if (isContactQuery) {
    // organelle order for the contact tag is important as there are only certain combinations
    // eg: er_golgi, mito_mt, mt_nucleus
    const contactMatch = `MATCH p=(organelleA)-[contact:\`${dataset}|${organelles[0]}_${organelles[1]}_contacts\`]->(organelleB)`;
    const contactParameters = measurements.map((m: string) => `contact.${m}`);
    contactParameters.push('organelleA.ID', 'organelleB.ID')
    const contactReturn = `RETURN ${contactParameters.join(', ')}`;
    return `${contactMatch} ${contactReturn}`;
  }

  const returnParameters = measurements.map((m: string) => `organelle.${m}`).join(', ')

  return `MATCH(organelle:\`${dataset}|${organelles[0]}\`) RETURN ${returnParameters} LIMIT 30`;
}
