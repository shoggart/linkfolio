'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface DataPoint {
  name: string
  clicks: number
  url?: string
}

interface BarChartProps {
  data: DataPoint[]
  className?: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function BarChart({ data, className }: BarChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            width={150}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                    <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
                    {payload[0].payload.url && (
                      <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {payload[0].payload.url}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">{payload[0].value}</span> clicks
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
