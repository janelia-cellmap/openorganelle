import {DatasetIndex} from './datasets'

interface iImagingMetadata {
  startDate: string
  duration: string
  biasVoltage: Number
  scanRate: Number
  current: Number
  primaryEnergy: Number
  id: string
  dimensions: UnitfulVector
  gridSpacing: UnitfulVector
}

interface iSampleMetadata {
  description: string
  protocol: string
  contributions: string
}

interface iDOIMetadata {
  id: string
  DOI: string
}

interface iDatasetMetadata{
  title: string
  id: string
  publications: string[]
  imaging: iImagingMetadata
  sample: iSampleMetadata
  DOI: iDOIMetadata[]
}

type TypedJSONResponse<T> = {
  data?: T 
  errors?: Array<{message: string}>
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

 async GetMetadata(): Promise<iDatasetMetadata | undefined> {
   let rawified = this.rawifyURL(this.url);
   rawified.pathname += '/readme.json';
   let metadata;
   try {
   const metadata_json = await getObjectFromJSON<iDatasetMetadata>(rawified);
   metadata = DatasetMetadata.fromJSON(metadata_json);
   }
   catch(error)
    {
      console.log(`Could not generate metadata from ${rawified.toString()}`)  
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
    console.log(`Could not generate index from ${rawified.toString()}`)
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

export class ImagingMetadata implements iImagingMetadata{
  startDate: string
  duration: string
  biasVoltage: Number
  scanRate: Number
  current: Number
  primaryEnergy: Number
  id: string
  dimensions: UnitfulVector
  gridSpacing: UnitfulVector
  constructor(
  startDate: any,
  duration: any,
  biasVoltage: any,
  scanRate: any,
  current: any,
  primaryEnergy: any,
  id: any,
  dimensions: any,
  gridSpacing: any
  )
  {
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

export class SampleMetadata implements iSampleMetadata{
  description: string
  protocol: string
  contributions: string
  constructor(
    description: any,
    protocol: any,
    contributions: any)
  {
    this.description = String(description);
    this.protocol = String(protocol);
    this.contributions = String(contributions);

  }
}

export class DOIMetadata implements iDOIMetadata{
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



export class DatasetMetadata implements iDatasetMetadata
{
  title: string
  id: string
  publications: string[]
  imaging: iImagingMetadata
  sample: iSampleMetadata
  DOI: iDOIMetadata[]
constructor(
  title: any,
  id: any,
  publications: any,
  imaging: any,
  sample: any,
  DOI: any
){
  this.title = String(title);
  this.id = String(id);
  this.imaging = new ImagingMetadata(imaging.startDate, 
                                     imaging.duration, 
                                     imaging.biasVoltage, 
                                     imaging.scanRate, 
                                     imaging.current,
                                     imaging.primaryEnergy,
                                     imaging.id, 
                                     imaging.dimensions,
                                     imaging.gridSpacing);

  this.sample = new SampleMetadata(sample.description, 
                                   sample.protocol, 
                                   sample.contributions);
  
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

 static fromJSON(json: iDatasetMetadata) {
  return new DatasetMetadata(json.title, json.id, json.publications, json.imaging, json.sample, json.DOI)
}
}
