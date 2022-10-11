import { titled } from "../api/datasets"
import {Dataset} from "../api/datasets"

interface sortOption extends titled{
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
      [...b[1].images.keys()].length - [...a[1].images.keys()].length,
    title: "Dataset Size"
  },
  collected: {
    // datasets.description.imaging.startDate
    func: (a: [string, Dataset], b: [string, Dataset]) =>
      new Date(b[1].acquisition!.startDate!).getTime() -
      new Date(a[1].acquisition!.startDate!).getTime(),
    title: "Date Collected"
  }
};

export default sortFunctions;
