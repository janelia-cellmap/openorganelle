import cypherBuilder from "./cypherBuilder";

test("creates cypher for single organelle", () => {
  expect(
    cypherBuilder({
      dataset: "jrc_hela-2",
      organelles: ["mitochondria", "er"],
      measurement: "planarity"
    })
  ).toBe("");
});
