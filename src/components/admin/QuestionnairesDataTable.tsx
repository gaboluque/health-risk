'use client'

import * as React from 'react'
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
import { MoreHorizontal, Search } from 'lucide-react'
import { getQuestionnaireImpactArea } from '@/lib/utils/questionnaires/questionnaire-registry'

interface Question {
  text: string
  possibleAnswers: Array<{
    text: string
    score: number
  }>
}

interface Questionnaire {
  id: string
  name: string
  questions: Question[]
  submissionCount: number
}

interface QuestionnairesDataTableProps {
  questionnaires: Questionnaire[]
}

export function QuestionnairesDataTable({ questionnaires }: QuestionnairesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const getQuestionnaireType = (name: string) => {
    const types = {
      ASCVD: { type: 'Cardiovascular', color: 'bg-red-100 text-red-800' },
      FINDRISK: { type: 'Diabetes', color: 'bg-blue-100 text-blue-800' },
      FRAX: { type: 'Bone Health', color: 'bg-green-100 text-green-800' },
      'GAD-7': { type: 'Mental Health', color: 'bg-purple-100 text-purple-800' },
      ODI: { type: 'Pain', color: 'bg-orange-100 text-orange-800' },
    }

    for (const [key, value] of Object.entries(types)) {
      if (name.toUpperCase().includes(key)) return value
    }
    return { type: 'General', color: 'bg-gray-100 text-gray-800' }
  }

  const columns: ColumnDef<Questionnaire>[] = [
    {
      accessorKey: 'name',
      header: 'Área de Impacto',
      cell: ({ row }) => {
        const questionnaire = row.original
        const impactArea = getQuestionnaireImpactArea(questionnaire.name)
        const typeInfo = getQuestionnaireType(questionnaire.name)

        return (
          <div className="space-y-1">
            <div className="font-medium">{impactArea}</div>
            <Badge variant="secondary" className={`text-xs ${typeInfo.color}`}>
              {questionnaire.name}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'questions',
      header: 'Questions',
      cell: ({ row }) => {
        const questions = row.getValue('questions') as Question[]
        const totalAnswers = questions.reduce((sum, q) => sum + q.possibleAnswers.length, 0)

        return (
          <div>
            <div className="font-medium">{questions.length} questions</div>
            <div className="text-sm text-muted-foreground">{totalAnswers} total answers</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'submissionCount',
      header: 'Submissions',
      cell: ({ row }) => {
        const count = row.getValue('submissionCount') as number

        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{count.toLocaleString()}</span>
            {count > 100 && (
              <Badge variant="default" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: 'scoreRange',
      header: 'Score Range',
      cell: ({ row }) => {
        const questions = row.original.questions
        const minScore = 0
        const maxScore = questions.reduce((sum, q) => {
          const maxQuestionScore = Math.max(...q.possibleAnswers.map((a) => a.score))
          return sum + maxQuestionScore
        }, 0)

        return (
          <div className="text-sm">
            {minScore} - {maxScore}
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const submissionCount = row.original.submissionCount
        const status = submissionCount > 0 ? 'Active' : 'Inactive'
        const variant = submissionCount > 0 ? 'default' : 'secondary'

        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const questionnaire = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(questionnaire.id)}>
                Copy questionnaire ID
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>View submissions</DropdownMenuItem>
              <DropdownMenuItem>Edit questions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: questionnaires,
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
              <CardTitle>Questionnaires</CardTitle>
              <CardDescription>Manage health risk assessment questionnaires</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questionnaires..."
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
                        No questionnaires found.
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
