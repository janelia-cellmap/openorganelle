// this function will accept a dataset, a list of organelles and a measurement
// value and return a cypher query to run.

interface builderProps {
  dataset: string;
  organelles: string[];
  measurements: string[];
}

const contactTypes = [
  "endo_er",
  "endo_golgi",
  "endo_mt",
  "er_golgi",
  "er_mito",
  "er_mt",
  "er_pm",
  "er_ribo",
  "er_vesicle",
  "er-periph_mito",
  "er-periph_mt",
  "er-periph_ribo",
  "mt_nucleus",
  "mt_pm",
  "mt_vesicle"
];

export default function cypherBuilder({
  dataset,
  organelles,
  measurements
}: builderProps): string | undefined {
  let query = undefined;
  // are all parameters present
  if (
    dataset &&
    organelles &&
    organelles.length > 0 &&
    measurements &&
    measurements.length > 0
  ) {
    // is this a contact query or a single organelle query
    const isContactQuery = organelles.length > 1;
    if (isContactQuery) {
      // organelle order for the contact tag is important as there are only certain combinations
      // eg: er_golgi, mito_mt, mt_nucleus

      // check organelles are in the allowed contacts
      const contactType = contactTypes.filter(
        type =>
          type === organelles.join("_") ||
          type ===
            organelles
              .slice() // prevent in place modification of the organelles array
              .reverse()
              .join("_")
      )[0];

      if (!contactType) {
        throw Error(
          `There are no contacts between ${organelles[0]} and ${organelles[1]}`
        );
      }

      const selected = contactType.split("_");

      const contactMatch = `MATCH p=(organelleA:\`${dataset}|${selected[0]}\`)-[contact:\`${dataset}|${contactType}_contacts\`]->(organelleB:\`${dataset}|${selected[1]}\`)`;
      const contactParameters = measurements.map((m: string) => `contact.${m}`);
      contactParameters.push("organelleA.ID", "organelleB.ID");
      const contactReturn = `RETURN ${contactParameters.join(", ")}`;
      const completeCypher = `${contactMatch} ${contactReturn} LIMIT 30;`;
      query = completeCypher;
    } else {
      const returnParameters = measurements
        .map((m: string) => `organelle.${m}`)
        .join(", ");

      query = `MATCH(organelle:\`${dataset}|${organelles[0]}\`) RETURN ${returnParameters};`;
    }
  }
  return query;
}
