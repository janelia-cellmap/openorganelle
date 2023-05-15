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
    T extends Json[] 
    ? { 
        [K in keyof T] 
        : K extends number 
        ? Camelized<T[K]> 
        : T[K] 
    }
    : T extends { [key: string]: Json } 
    ? {[P in keyof T & string as SnakeToCamelCase<P>]: Camelized<T[P]>} 
    : T 