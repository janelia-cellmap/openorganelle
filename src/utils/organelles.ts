export const organelleNames = [
  { value: "endo", label: "Endosome" },
  { value: "er", label: "ER" },
  { value: "golgi", label: "Golgi" },
  { value: "mt", label: "Microtubule" },
  { value: "mito", label: "Mitochondria" },
  { value: "nucleus", label: "Nucleus" },
  { value: "ribo", label: "Ribosome" },
  { value: "er-periph", label: "Peripheral ER" },
  { value: "pm", label: "Plasma Membrane" },
  { value: "vesicle", label: "Vesicle" }
];

type lookupIterator = {
  [key: string]: string;
};

export const organelleTitles: lookupIterator = {
  endo: "Endosome",
  er: "ER",
  golgi: "Golgi",
  mt: "Microtubule",
  mito: "Mitochondria",
  nucleus: "Nucleus",
  ribo: "Ribosome",
  "er-periph": "Peripheral ER",
  pm: "Plasma Membrane",
  vesicle: "Vesicle"
};

export const organelleColors: lookupIterator = {
  endo: "#4e79a7",
  er: "#59a14f",
  golgi: "#9c755f",
  mt: "#f28e2b",
  mito: "#edc948",
  nucleus: "#bab0ac",
  ribo: "#e15759",
  "er-periph": "#b07aa1",
  pm: "#76b7b2",
  vesicle: "#ff9da7"
};

export function convertLabelToOrganelleAbbreviation(label: string) {
  const [, organelleAbbr] = label.split('|');
  return organelleAbbr;
}

export function convertLabelToOrganelle(label: string) {
  const organelleAbbr = convertLabelToOrganelleAbbreviation(label);
  return organelleTitles[organelleAbbr];
}
