// this function will accept a dataset, a list of organelles and a measurement
// value and return a cypher query to run.

interface builderProps {
  dataset: string;
  organelleA: string;
  organelleB?: string;
  measurements: string[];
}

export const contactTypes = [
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

export function getContacts(organelle: string): string[] {
  const contacts: string[] = [];
  // filter contact types for any that match 'organelle'
  const filtered = contactTypes.filter(
    type =>
      type.indexOf(`${organelle}_`) >= 0 || type.indexOf(`_${organelle}`) >= 0
  );
  // split the filtered contacts and return the ones that don't
  // match the organelle
  filtered.forEach(type => {
    const split = type.split("_");
    split.forEach(contact => {
      if (contact !== organelle && contacts.indexOf(contact) === -1) {
        contacts.push(contact);
      }
    });
  });
  return contacts;
}

export function connectionsCypher(id: string) : string {
  return `MATCH (n) WHERE id(n) = ${id} MATCH (n)-[r]-(c)  RETURN n, r, c, labels(n) as labelsN, labels(c) as labelsC LIMIT 1000`;
}

export default function cypherBuilder({
  dataset,
  organelleA,
  organelleB,
  measurements
}: builderProps): string | undefined {
  let query = undefined;
  // are all parameters present
  if (
    dataset &&
    organelleA &&
    organelleA.length > 0 &&
    measurements &&
    measurements.length > 0
  ) {
    // is this a contact query or a single organelle query
    const isContactQuery =
      organelleA.length > 0 && organelleB && organelleB.length > 0;
    if (isContactQuery) {
      // organelle order for the contact tag is important as there are only certain combinations
      // eg: er_golgi, mito_mt, mt_nucleus

      // check organelles are in the allowed contacts
      const contactType = contactTypes.filter(
        type =>
          type === `${organelleA}_${organelleB}` ||
          type === `${organelleB}_${organelleA}`
      )[0];

      if (!contactType) {
        throw Error(
          `There are no contacts between ${organelleA} and ${organelleB}`
        );
      }

      const selected = contactType.split("_");

      const contactMatch = `MATCH p=(organelleA:\`${dataset}|${selected[0]}\`)-[contact:\`${dataset}|${contactType}_contacts\`]->(organelleB:\`${dataset}|${selected[1]}\`)`;
      const contactParameters = measurements.map((m: string) => {
        if (m === "ID") {
          return `contact.\`${dataset}|${contactType}_contacts${m}\` as contact_ID`;
        }
        return `contact.${m}`;
      });
      contactParameters.push("organelleA.ID", "organelleB.ID", "id(organelleA) as intIdA", "id(organelleB) as intIdB");
      const contactReturn = `RETURN ${contactParameters.join(", ")}`;
      const completeCypher = `${contactMatch} ${contactReturn} LIMIT 1000;`;
      query = completeCypher;
    } else {
      const returnParameters = measurements
        .map((m: string) => `organelle.${m}`)
        .join(", ");

      query = `MATCH(organelle:\`${dataset}|${organelleA}\`) RETURN ${returnParameters}, id(organelle) as intId;`;
    }
  }
  return query;
}
