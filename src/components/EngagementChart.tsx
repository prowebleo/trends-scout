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
    .map((d) => {
      const dt = new Date(d.date)
      return {
        date: dt.toISOString(),
        label: dt.toLocaleDateString("en", { month: "short", day: "numeric" }) +
          " " + dt.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
        ups: d.ups,
        comments: d.comments,
      }
    })

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400">
        Not enough data for chart
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Post Engagement</h3>
        <p className="text-xs text-gray-400">r/{subreddit} — top post upvotes & comments</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "13px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
          <Bar
            dataKey="ups"
            name="Upvotes"
            fill="#7c3aed"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="comments"
            name="Comments"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
