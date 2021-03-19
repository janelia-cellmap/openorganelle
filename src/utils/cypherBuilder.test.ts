import cypherBuilder from "./cypherBuilder";

test("creates cypher for er volume", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["er"],
      measurements: ["volume"]
    })
  ).toBe("MATCH(organelle:`jrc_hela-2|er`) RETURN organelle.volume");
});

test("creates cypher for er contact with golgi", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["er","golgi"],
      measurements: ["planarity"]
    })
  ).toBe("MATCH p=(organelleA)-[contact:`jrc_hela-2|er_golgi_contacts`]->(organelleB) RETURN contact.planarity, organelleA.ID, organelleB.ID");
});
