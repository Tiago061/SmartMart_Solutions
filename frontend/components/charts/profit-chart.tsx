"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts"

interface ProfitChartProps {
  sales: any[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Profit: <span className="font-medium text-foreground">${Number(payload[0].value).toFixed(2)}</span>
        </p>
      </div>
    )
  }
  return null
}

export function ProfitChart({ sales }: ProfitChartProps) {
  // Aggregate profit by month
  const monthlyData = MONTHS.map((month, index) => {
    const monthSales = sales.filter((s: any) => s.month === index + 1)
    const totalProfit = monthSales.reduce((acc: number, s: any) => acc + s.total_price, 0)
    return {
      month,
      profit: totalProfit,
    }
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Sales Profit</CardTitle>
        <CardDescription>Monthly profit variation over the year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(142, 71%, 45%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
