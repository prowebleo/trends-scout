"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

type Props = {
  data: { date: string; ups: number; comments: number }[]
  subreddit: string
}

export default function EngagementChart({ data, subreddit }: Props) {
  const chartData = data
    .filter((d) => d.ups > 0)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      ups: d.ups,
      comments: d.comments,
    }))

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400">
        Not enough data for chart
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Top Post Engagement — r/{subreddit}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
            }}
          />
          <Legend />
          <Bar dataKey="ups" name="Upvotes" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comments" name="Comments" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
