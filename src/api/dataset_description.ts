// The contents of the README.json file which can be found in the root folder of each dataset
export interface DescriptionSummary {
  "Acquisition date": string;
  "Dataset ID": string;
  "Voxel size (nm)": string;
  "Dimensions (\u00b5m)": string;
}

export interface DescriptionAbout {
  Sample: string;
  Protocol: string;
  Contributions: string;
}

export interface DescriptionAcquisition {
  "Final voxel size (nm)": string;
  "Dimensions (\u00b5m)": string;
  "Size (GB)": string;
  "Imaging duration (days)": string;
  "Imaging start date": string;
  "Primary energy (eV)": string;
  "Bias (V)": string;
  "Imaging current (nA)": string;
  "Scanning speed (MHz)": string;
}

export interface DatasetDescription {
  Title: string;
  Summary: DescriptionSummary;
  "About this sample": DescriptionAbout;
  "Acquisition information": DescriptionAcquisition;
  "Dataset information": any;
}
