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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search, Download, Filter } from 'lucide-react'
import { RiskLevel } from '@/lib/types/questionnaire'

interface Submission {
  id: string
  questionnaire:
    | {
        name: string
      }
    | string
  totalScore: number
  riskLevel: RiskLevel
  submittedAnswers: Array<{
    questionText: string
    selectedAnswerText: string
    score: number
  }>
  createdAt: string
}

interface SubmissionsDataTableProps {
  submissions: Submission[]
  totalCount: number
}

export function SubmissionsDataTable({ submissions, totalCount }: SubmissionsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const getRiskBadgeVariant = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.LOW:
        return 'secondary'
      case RiskLevel.MODERATE:
        return 'default'
      case RiskLevel.HIGH:
        return 'destructive'
      case RiskLevel.SEVERE:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.LOW:
        return 'text-green-600'
      case RiskLevel.MODERATE:
        return 'text-yellow-600'
      case RiskLevel.HIGH:
        return 'text-orange-600'
      case RiskLevel.SEVERE:
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: 'questionnaire',
      header: 'Assessment',
      cell: ({ row }) => {
        const questionnaire = row.original.questionnaire
        const name = typeof questionnaire === 'string' ? 'Unknown' : questionnaire.name

        return (
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">ID: {row.original.id.slice(-8)}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'totalScore',
      header: 'Score',
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue('totalScore')}</div>
      },
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Level',
      cell: ({ row }) => {
        const rowRiskLevel = row.getValue('riskLevel') as RiskLevel

        return (
          <div className="space-y-1">
            <Badge
              variant={getRiskBadgeVariant(rowRiskLevel)}
              className={getRiskColor(rowRiskLevel)}
            >
              {rowRiskLevel}
            </Badge>
            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
              {rowRiskLevel}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'submittedAnswers',
      header: 'Questions',
      cell: ({ row }) => {
        const answers = row.original.submittedAnswers
        return <div className="text-sm">{answers.length} questions answered</div>
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return (
          <div>
            <div className="font-medium">{formatDistanceToNow(date, { addSuffix: true })}</div>
            <div className="text-sm text-muted-foreground">{date.toLocaleDateString()}</div>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const submission = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(submission.id)}>
                Copy submission ID
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Export data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: submissions,
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

  // Calculate stats
  const riskDistribution = submissions.reduce(
    (acc, submission) => {
      acc[submission.riskLevel] = (acc[submission.riskLevel] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const averageScore =
    submissions.length > 0
      ? (submissions.reduce((sum, s) => sum + s.totalScore, 0) / submissions.length).toFixed(1)
      : '0'

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(riskDistribution.high || 0) + (riskDistribution.severe || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{riskDistribution.low || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>All questionnaire submissions and risk assessments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
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
                        No submissions found.
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
