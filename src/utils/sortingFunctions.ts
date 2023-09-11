import {Dataset} from "../types/database"

interface sortOption {
  title: string
  func: (a: [string, Dataset], b: [string, Dataset]) => number;
}

interface sortOptions {
  name: sortOption;
  size: sortOption;
  collected: sortOption;
  [key: string]: sortOption;
}

const sortFunctions: sortOptions = {
  name: {
    func: (a: [string, Dataset], b: [string, Dataset]) =>
      a[1].name.localeCompare(b[1].name, undefined, {
        numeric: true,
        sensitivity: "base"
      }),
    title: "Dataset Name"
  },
  size: {
    func: (a: [string, Dataset], b: [string, Dataset]) =>
      [...b[1].imagery.keys()].length - [...a[1].imagery.keys()].length,
    title: "Dataset Size"
  },
  collected: {
    // datasets.description.imaging.startDate
    func: (a: [string, Dataset], b: [string, Dataset]) =>
      new Date(b[1].imageAcquisition!.startDate!).getTime() -
      new Date(a[1].imageAcquisition!.startDate!).getTime(),
    title: "Date Collected"
  }
};

export default sortFunctions;
