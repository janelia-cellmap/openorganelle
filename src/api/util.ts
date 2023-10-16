import { Json } from "../types/supabase";

export const dateKeys = ["createdAt", "startDate"];

export function makeQuiltURL(bucket: string, prefix: string): string {
  return `https://open.quiltdata.com/b/${bucket}/tree/${prefix}/`
}

// Check if the browser has webgl2 enabled. This is required for using neuroglancer.
export const checkWebGL2 = (): boolean => {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {return false} 
    else {return true}
  }

  export function ensureNotArray<T>(obj: null | T | T[]) {
    if (obj === null) {
      throw new Error('Object cannot be null')
    }
    else if (Array.isArray(obj)) {
      if (obj.length > 0) {
        return obj[0]
      }
      else {
        throw new Error('Expected a length-1 array or a non-array object as the argument to this function.')
      }
    }
    else {
      return obj
    }
  }
  
  export function ensureArray<T>(obj: null | T | T[]): T[] {
    if (obj === null){
      return []
    }
    else if (!Array.isArray(obj)){
      return [obj]
    }
    else {
      return obj
    }
  }

  // convert 
export function toCamel(s: string): string {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
}

export function camelize(obj: Json): any {
  if (obj === null) {return obj}
  else if (typeof obj === 'number') {return obj} 
  else if (typeof obj === 'string'){return obj}
  else if (typeof obj === 'boolean') {return obj}
  else if (Array.isArray(obj)) {return obj.map(camelize)}
  else
  {
  const entries = Object.entries(obj);
  const mappedEntries = entries.map(
      ([k, v]) => [toCamel(k), camelize(v)])
  return Object.fromEntries(mappedEntries)
  }
}

export function stringToDate(obj: Json): any {
  if (obj === null) {return obj}
  else if (typeof obj === 'number') {return obj} 
  else if (typeof obj === 'string'){return obj}
  else if (typeof obj === 'boolean') {return obj}
  else if (Array.isArray(obj)) {return obj.map(stringToDate)}
  else
  {
  const entries = Object.entries(obj);
  const mappedEntries = entries.map(
      ([k, v]) => {
        return (dateKeys.includes(k) && (typeof v === 'string')) ? [k, new Date(v)] : [k, stringToDate(v)]
      })
  return Object.fromEntries(mappedEntries)
  }
}

export const getStage = () => {
  const maybeDev = process.env.REACT_APP_STAGE
  if (maybeDev === 'dev') {
    return maybeDev
  }
  else if (maybeDev === 'prod') {
    return maybeDev
  }
  else {
    throw new Error('Failed to parse environment variable REACT_APP_DEV_MODE. It should be one of ["dev", "prod"]')
  }
}