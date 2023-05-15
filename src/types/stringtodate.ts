export type DateFields = "createdAt" | "startDate"

export type ToDate<T> = { 
    [P in keyof T]: [P, string] extends [DateFields, T[P]] 
    ? Date 
    : ToDate<T[P]> }
