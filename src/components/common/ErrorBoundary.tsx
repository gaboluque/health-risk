'use client'

import React, { Component, PropsWithChildren, ErrorInfo } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorFallbackProps {
  error?: Error
  onReset?: () => void
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Algo salió mal</h2>
        <p className="text-slate-600 mb-4">
          Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>
        {error && process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-slate-50 p-3 rounded-lg mb-4">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">
              Detalles del error
            </summary>
            <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{ onReset?: () => void }>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{ onReset?: () => void }>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Here you could log to an error reporting service
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}
