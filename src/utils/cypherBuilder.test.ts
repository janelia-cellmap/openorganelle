import cypherBuilder, { getContacts } from "./cypherBuilder";

test("creates cypher for er volume", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelleA: "er",
      measurements: ["volume"]
    })
  ).toBe("MATCH(organelle:`jrc_hela-2|er`) RETURN organelle.volume;");
});

test("creates cypher for er contact with golgi", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelleA: "er",
      organelleB: "golgi",
      measurements: ["planarity"]
    })
  ).toBe("MATCH p=(organelleA:`jrc_hela-2|er`)-[contact:`jrc_hela-2|er_golgi_contacts`]->(organelleB:`jrc_hela-2|golgi`) RETURN contact.planarity, organelleA.ID, organelleB.ID LIMIT 30;");
});

test("creates cypher for golgi contact with er", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelleB: "er",
      organelleA: "golgi",
      measurements: ["planarity"]
    })
  ).toBe("MATCH p=(organelleA:`jrc_hela-2|er`)-[contact:`jrc_hela-2|er_golgi_contacts`]->(organelleB:`jrc_hela-2|golgi`) RETURN contact.planarity, organelleA.ID, organelleB.ID LIMIT 30;");
});

test("creates cypher for er contact with er", () => {
  expect(() =>
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelleA: "er",
      organelleB: "er",
      measurements: ["planarity"]
    })
  ).toThrow("There are no contacts between er and er");
});

test("creates cypher for nucleus contact with er", () => {
  expect(() =>
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelleA: "nucleus",
      organelleB: "er",
      measurements: ["length"]
    })
  ).toThrow("There are no contacts between nucleus and er");
});

test("gets correct contacts for er", () => {
  expect(
    getContacts("er").sort()
  ).toEqual(["endo", "golgi", "mito", "mt", "pm", "ribo", "vesicle"]);
});

test("gets correct contacts for er-periph", () => {
  expect(
    getContacts("er-periph").sort()
  ).toEqual(["mito", "mt", "ribo"]);
});

test("gets correct contacts for nucleus", () => {
  expect(
    getContacts("nucleus").sort()
  ).toEqual(["mt"]);
});

test("gets correct contacts for golgi", () => {
  expect(
    getContacts("golgi").sort()
  ).toEqual(["endo", "er"]);
});
