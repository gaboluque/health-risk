'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search } from 'lucide-react'

interface User {
  id: string
  email: string
  role: 'user' | 'admin' | 'superadmin'
  profile?: {
    firstName: string
    lastName: string
    age?: number
    sex: 'male' | 'female'
    bmi?: number
  }
  createdAt: string
}

interface UsersDataTableProps {
  users: User[]
}

export function UsersDataTable({ users }: UsersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'profile',
      header: 'Patient',
      cell: ({ row }) => {
        const user = row.original
        const profile = user.profile
        const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user.email
        const initials =
          profile && profile.firstName && profile.lastName
            ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
            : user.email.substring(0, 2).toUpperCase()

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{displayName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        const variant =
          role === 'superadmin' ? 'destructive' : role === 'admin' ? 'default' : 'secondary'
        const label = role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Patient'

        return <Badge variant={variant}>{label}</Badge>
      },
    },
    {
      accessorKey: 'profile.age',
      header: 'Age',
      cell: ({ row }) => {
        const profile = row.original.profile
        return profile?.age ? `${profile.age} years` : '—'
      },
    },
    {
      accessorKey: 'profile.sex',
      header: 'Sex',
      cell: ({ row }) => {
        const profile = row.original.profile
        return profile?.sex ? profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1) : '—'
      },
    },
    {
      accessorKey: 'profile.bmi',
      header: 'BMI',
      cell: ({ row }) => {
        const profile = row.original.profile
        if (!profile?.bmi) return '—'

        const bmi = profile.bmi
        let category = 'Normal'
        let color = 'text-green-600'

        if (bmi < 18.5) {
          category = 'Underweight'
          color = 'text-blue-600'
        } else if (bmi >= 25 && bmi < 30) {
          category = 'Overweight'
          color = 'text-yellow-600'
        } else if (bmi >= 30) {
          category = 'Obese'
          color = 'text-red-600'
        }

        return (
          <div>
            <div className="font-medium">{bmi.toFixed(1)}</div>
            <div className={`text-xs ${color}`}>{category}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => {
        return formatDistanceToNow(new Date(row.getValue('createdAt')), { addSuffix: true })
      },
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage and view all system users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-8"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
