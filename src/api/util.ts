import { UnitfulVector } from "./datasets";

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

export function stringifyUnitfulVector(vec: UnitfulVector, decimals: number): string {
      const val_array = [...Object.values(vec.values)].map(v => v.toFixed(decimals));
      const axis_array = [...Object.keys(vec.values)];
      if (val_array.length === 0) { return 'N/A' }
      else {
        return `${val_array.join(' x ')} (${axis_array.join(', ')})`
      }
    }
