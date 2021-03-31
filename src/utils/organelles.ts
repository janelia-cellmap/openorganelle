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

type titleIterator = {
  [key: string]: string;
};

export const organelleTitles: titleIterator = {
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
