import cypherBuilder from "./cypherBuilder";

test("creates cypher for er volume", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["er"],
      measurements: ["volume"]
    })
  ).toBe("MATCH(organelle:`jrc_hela-2|er`) RETURN organelle.volume;");
});

test("creates cypher for er contact with golgi", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["er","golgi"],
      measurements: ["planarity"]
    })
  ).toBe("MATCH p=(organelleA:`jrc_hela-2|er`)-[contact:`jrc_hela-2|er_golgi_contacts`]->(organelleB:`jrc_hela-2|golgi`) RETURN contact.planarity, organelleA.ID, organelleB.ID LIMIT 30;");
});

test("creates cypher for golgi contact with er", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["golgi", "er"],
      measurements: ["planarity"]
    })
  ).toBe("MATCH p=(organelleA:`jrc_hela-2|er`)-[contact:`jrc_hela-2|er_golgi_contacts`]->(organelleB:`jrc_hela-2|golgi`) RETURN contact.planarity, organelleA.ID, organelleB.ID LIMIT 30;");
});

test("creates cypher for er contact with er", () => {
  expect(() =>
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["er", "er"],
      measurements: ["planarity"]
    })
  ).toThrow("There are no contacts between er and er");
});

test("creates cypher for nucleus contact with er", () => {
  expect(() =>
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["nucleus", "er"],
      measurements: ["length"]
    })
  ).toThrow("There are no contacts between nucleus and er");
});
