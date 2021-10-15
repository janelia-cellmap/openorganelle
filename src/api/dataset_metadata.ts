import {DatasetIndex} from './datasets'

type softwareAvailability = "open" | "partial" | "closed"


interface IImagingMetadata {
  id: string
  institution: string
  gridSpacing: UnitfulVector
  dimensions: UnitfulVector
  startDate: string
  duration: string
  biasVoltage: Number
  scanRate: Number
  current: Number
  primaryEnergy: Number
}

interface ISampleMetadata {
  description: string
  protocol: string
  contributions: string
  organism: string[]
  type: string[]
  subtype: string[]
  treatment: string[]
}

interface IDOIMetadata {
  id: string
  DOI: string
}

interface IDatasetMetadata{
  title: string
  id: string
  imaging: IImagingMetadata
  sample: ISampleMetadata
  institution: string[]
  softwareAvailability: softwareAvailability
  DOI: IDOIMetadata[]
  publications: string[]
}

abstract class DatasetMetadataSource {
  url: URL
  constructor(url: string) {
    this.url = new URL(url);
  }
  abstract GetThumbnailURL(): void
  abstract GetMetadata(): void
  abstract GetIndex(): void
}

async function getObjectFromJSON<T>(url: URL): Promise<T> {
   const response = await fetch(url.toString())
   const metadata = response.json();

   if (response.ok){
     if (metadata) {
       return metadata
     }
     else{
       return Promise.reject(new Error(`Could not access "${url.toString()}"`))
     }
   }
   else {
     const error = new Error(`Could not access "${url.toString()}"`)
     return Promise.reject(error)
   }
  }


export class GithubDatasetMetadataSource extends DatasetMetadataSource {
  constructor(url: string){
    super(url);
  }

  async GetThumbnailURL(): Promise<URL>{
    let rawified = this.rawifyURL(this.url);
    rawified.pathname += '/thumbnail.jpg'
    return rawified;
  }

 async GetMetadata(): Promise<IDatasetMetadata | undefined> {
   let rawified = this.rawifyURL(this.url);
   rawified.pathname += '/readme.json';
   let metadata;
   try {
   const metadata_json = await getObjectFromJSON<IDatasetMetadata>(rawified);
   metadata = DatasetMetadata.fromJSON(metadata_json);
   }
   catch(error)
    {
      console.log(`Could not generate metadata from ${rawified.toString()} due to ${error}`)
    }
   return metadata
 }

 async GetIndex(): Promise<DatasetIndex | undefined> {
  let rawified = this.rawifyURL(this.url);
  rawified.pathname += '/index.json';
  let index;
  try {
    index = await getObjectFromJSON<DatasetIndex>(rawified);
  }
  catch (error) {
    console.log(`Could not generate index from ${rawified.toString()} due to ${error}`)
    index = undefined;
  }

  return index
}

rawifyURL(url: URL): URL{
  // map https://github.com/$user/$repo/blob/$branch/path to
  // https://raw.githubusercontent.com/$user/$repo/$branch/path

  // replace github.com with raw.githubusercontent
  let result: URL = new URL(url.toString());
  result.hostname = 'raw.githubusercontent.com';
  result.pathname = result.pathname.replace('/blob', '');
  return result;
}

}

class UnitfulVector {
  unit: string;
  values: Map<string, number>;
  constructor(
    unit: any,
    values: any
  ){
    this.unit = String(unit);
    this.values = new Map(Object.entries(values))
  }
  string_repr(decimals: number): string {
    const val_array = [...this.values.values()].map(v => v.toFixed(decimals));
    const axis_array = [...this.values.keys()];
    if (val_array.length === 0){return 'N/A'}
    else {
      return `${val_array.join(' x ')} (${axis_array.join(', ')})`
    }
  }
}

export class ImagingMetadata implements IImagingMetadata{
  id: string
  institution: string
  gridSpacing: UnitfulVector
  dimensions: UnitfulVector
  startDate: string
  duration: string
  biasVoltage: Number
  scanRate: Number
  current: Number
  primaryEnergy: Number
  constructor(
    id: any,
    institution: any,
    gridSpacing: any,
    dimensions: any,
    startDate: any,
    duration: any,
    biasVoltage: any,
    scanRate: any,
    current: any,
    primaryEnergy: any
  )
  {
    this.institution = institution;
    this.startDate = String(startDate);
    this.duration = String(duration);
    this.biasVoltage = Number(biasVoltage);
    this.scanRate = Number(scanRate);
    this.current  = Number(current);
    this.primaryEnergy  = Number(primaryEnergy);
    this.id = String(id);

    let _dimensions = dimensions;
    if (dimensions === undefined) {
    _dimensions = {unit: undefined, values: new Map()}
    }

    let _gridSpacing = gridSpacing;
    if (gridSpacing === undefined) {
    _gridSpacing = {unit: undefined, values: new Map()}
    }

    this.dimensions = new UnitfulVector(_dimensions.unit, _dimensions.values);
    this.gridSpacing = new UnitfulVector(_gridSpacing.unit, _gridSpacing.values);
  }
}

export class SampleMetadata implements ISampleMetadata{
  description: string
  protocol: string
  contributions: string
  organism: string[]
  type: string[]
  subtype: string[]
  treatment: string[]
  constructor(
    description: any,
    protocol: any,
    contributions: any,
    organism: any,
    type: any,
    subtype: any,
    treatment: any)
  {
    this.description = String(description);
    this.protocol = String(protocol);
    this.contributions = String(contributions);
    this.organism = organism ? Array.from(organism).map(String) : [];
    this.type = type? Array.from(type).map(String): [];
    this.subtype = subtype? Array.from(subtype).map(String): [];
    this.treatment = treatment? Array.from(treatment).map(String): [];
  }
}

export class DOIMetadata implements IDOIMetadata{
  id: string
  DOI: string
  constructor(
    id: any,
    DOI: any
  )
  {
    this.id = String(id);
    this.DOI = String(DOI)
  }
}



export class DatasetMetadata implements IDatasetMetadata
{
  title: string
  id: string
  imaging: IImagingMetadata
  sample: ISampleMetadata
  institution: string[]
  softwareAvailability: softwareAvailability
  DOI: IDOIMetadata[]
  publications: string[]
constructor(
  title: any,
  id: any,
  imaging: IImagingMetadata,
  sample: ISampleMetadata,
  institution: any,
  softwareAvailability: any,
  DOI: any,
  publications: any,
){
  this.title = String(title);
  this.id = String(id);
  this.institution = Array.from(institution).map(String);
  this.softwareAvailability = softwareAvailability
  this.imaging = new ImagingMetadata(imaging.id,
                                     imaging.institution,
                                     imaging.gridSpacing,
                                     imaging.dimensions,
                                     imaging.startDate,
                                     imaging.duration,
                                     imaging.biasVoltage,
                                     imaging.scanRate,
                                     imaging.current,
                                     imaging.primaryEnergy,
                                     );

  this.sample = new SampleMetadata(sample.description,
                                   sample.protocol,
                                   sample.contributions,
                                   sample.organism,
                                   sample.type,
                                   sample.subtype,
                                   sample.treatment);

  if (Array.isArray(DOI)){
    this.DOI = DOI.map(v => new DOIMetadata(v.id, v.DOI));
  }
  else{
    this.DOI = [];
  }
  if (Array.isArray(publications)){
  this.publications = publications.map(String);
  }
  else {this.publications = []}
}

 static fromJSON(json: IDatasetMetadata) {
  return new DatasetMetadata(json.title,
                             json.id,
                             json.imaging,
                             json.sample,
                             json.institution,
                             json.softwareAvailability,
                             json.DOI,
                             json.publications)
}
}
