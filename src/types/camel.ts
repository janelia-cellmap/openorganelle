import {Json} from './supabase'

// The mapping from snake_case strings to 
// camelCase strings
type SnakeToCamelCase<S extends string> = 
    S extends `${infer T}_${infer U}` 
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}` 
    : S

// Json data where all property names have been converted
// from snake_case to camelCase. 
export type Camelized<T extends Json> = 
    T extends Json[] ? { [K in keyof T]: K extends number ? Camelized<T[K]> : T[K] }
    : T extends { [key: string]: Json } ? {[P in keyof T & string as SnakeToCamelCase<P>]: Camelized<T[P]>} 
    : T 

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