export type Tag<T> = {
    value: string
    category: T
  }
  
export class OSet<T>{
  public map: Map<string, T>
  constructor(){
    this.map = new Map();
  }
  add(element: T) {
    this.map.set(JSON.stringify(element), element)
  }
  has(element: T): boolean {
    return [...this.map.keys()].includes(JSON.stringify(element))
  }
  delete(element: T): boolean {
    return this.map.delete(JSON.stringify(element))
  }
  [Symbol.iterator](){
    return this.map[Symbol.iterator]()
  }
}

type TagCategories = "Software Availability" |
  "Contributing institution" |
  "Volumes" |
  "Sample: Organism" |
  "Sample: Type" |
  "Sample: Subtype" |
  "Sample: Treatment" |
  "Acquisition institution" |
  "Lateral voxel size" |
  "Axial voxel size"

export type DatasetTag = Tag<TagCategories>