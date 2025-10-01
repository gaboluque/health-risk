'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart } from 'lucide-react'

export function RiskDistributionChart() {
  const riskData: any[] = []

  const totalAssessments = riskData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Distribución de Riesgo
        </CardTitle>
        <CardDescription>
          Distribución de niveles de riesgo en todas las evaluaciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie chart representation using stacked bars */}
          <div className="space-y-3">
            {riskData.map((risk, _index) => (
              <div key={risk.level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                    <span className="font-medium">{risk.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{risk.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {risk.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${risk.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${risk.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total de Evaluaciones</span>
              <span className="font-medium">{totalAssessments.toLocaleString()}</span>
            </div>
          </div>

          {/* Risk level indicators */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {riskData[0].percentage.toFixed(0)}%
              </div>
              <div className="text-xs text-green-600">Bajo Riesgo</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-700">
                {(riskData[2].percentage + riskData[3].percentage).toFixed(0)}%
              </div>
              <div className="text-xs text-red-600">Alto Riesgo+</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
