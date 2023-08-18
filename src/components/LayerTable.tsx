import * as React from 'react'

import {Folder} from '@material-ui/icons'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnDef,
} from '@tanstack/react-table'

import { Image } from '../types/database'
import { s3URItoQuiltURL } from '../api/datasources'

export function Table({images} : {images: Image[]}) {

  const columns = React.useMemo<ColumnDef<Image>[]>(
    () => [      {
      id: 'group0',
      columns: [
        {
          header: 'About',
          accessorKey: 'description',
          cell: info => info.getValue()
        },
        {
          header: 'Type',
          accessorKey: 'contentType',
          cell: info => <span className="badge"> <em>{info.getValue()}</em></span>
        },
        {
          header: 'Format',
          accessorKey: 'format',
          cell: info => <b>{info.getValue()}</b>
        },
        {
          header: 'Files',
          accessorKey: 'url',
          cell: info => <a href={s3URItoQuiltURL(info.getValue()).toString()}><Folder></Folder></a>
        },
        {
          header: 'Access',
          accessorKey: 'url',
          cell: info => <>
        },

      ],
    },], [])

  const [data] = React.useState(() => [...images])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(
            headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{asc: ' 🔼', desc: ' 🔽',}[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows
            .map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
    </div>
  )
}
