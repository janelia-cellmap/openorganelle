// Check if the browser has webgl2 enabled. This is required for using neuroglancer.
export const checkWebGL2 = (): boolean => {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {return false} 
    else {return true}
  }