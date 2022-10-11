import { UnitfulVector } from "./datasets";

// Check if the browser has webgl2 enabled. This is required for using neuroglancer.
export const checkWebGL2 = (): boolean => {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {return false} 
    else {return true}
  }

  export async function getObjectFromJSON<T>(url: URL): Promise<T> {
    const response = await fetch(url.toString())
    const metadata = response.json();
  
    if (response.ok) {
      if (metadata) {
        return metadata
      }
      else {
        return Promise.reject(new Error(`Could not access "${url.toString()}"`))
      }
    }
    else {
      const error = new Error(`Could not access "${url.toString()}"`)
      return Promise.reject(error)
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
