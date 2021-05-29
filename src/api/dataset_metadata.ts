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
  string_repr(): string {
    const val_array = [...this.values.values()].map(v => v.toFixed(2));
    const axis_array = [...this.values.keys()];
    if (val_array.length == 0){return 'N/A'}
    else {
      return `${val_array.join(' x ')} (${axis_array.join(', ')})`
    }    
  }
}

export class ImagingMetadata {
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

export class SampleMetadata {
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

export class DOIMetadata {
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

export class DatasetMetadata
{
  title: string
  id: string
  publications: string[]
  imaging: ImagingMetadata
  sample: SampleMetadata
  DOI: DOIMetadata[]
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
}
