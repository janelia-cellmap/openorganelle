import { Dataset, titled } from "../api/datasets";
import { IFoob } from "../api/datasets2";

interface sortOption extends titled{
  func: (a: IFoob, b: IFoob) => number;
}

interface sortOptions {
  name: sortOption;
  size: sortOption;
  collected: sortOption;
  [key: string]: sortOption;
}

const sortFunctions: sortOptions = {
  name: {
    func: (a: IFoob, b: IFoob) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base"
      }),
    title: "Dataset Name"
  },
  size: {
    func: (a: IFoob, b: IFoob) =>
      b.volumes.length - a.volumes.length,
    title: "Dataset Size"
  },
  collected: {
    // datasets.description.imaging.startDate
    func: (a: IFoob, b: IFoob) =>
      new Date(b.acquisition!.start_date!).getTime() -
      new Date(a.acquisition!.start_date!).getTime(),
    title: "Date Collected"
  }
};

export default sortFunctions;
