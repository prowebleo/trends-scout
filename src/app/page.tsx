"use client"

import { useEffect, useState } from "react"
import { Users, MessageCircle, ArrowUp, BarChart3, Clock, ExternalLink } from "lucide-react"
import StatCard from "@/components/StatCard"
import EngagementChart from "@/components/EngagementChart"
import PostCard from "@/components/PostCard"
import ExportButton from "@/components/ExportButton"

type SubredditData = {
  subreddit: string
  subscribers: number | null
  totalSnapshots: number
  totalPosts: number
  totalUps: number
  totalComments: number
  avgUps: number | null
  avgComments: number | null
  lastScraped: string
  topPosts: {
    id: string
    title: string | null
    author: string | null
    ups: number | null
    comments: number | null
    upvoteRatio: number | null
    permalink: string | null
  }[]
  engagementHistory: { date: string; ups: number; comments: number }[]
}

export default function Home() {
  const [subreddits, setSubreddits] = useState<SubredditData[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/subreddits")
      .then((r) => r.json())
      .then((data) => {
        setSubreddits(data.subreddits ?? [])
        if (data.subreddits?.length > 0) {
          setSelected(data.subreddits[0].subreddit)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <BarChart3 size={32} className="animate-pulse text-violet-500" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (subreddits.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <MessageCircle size={40} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-bold text-gray-900">Trends Scout</h1>
        <p className="mt-2 text-sm text-gray-500">No data yet. Run the scraper first.</p>
      </div>
    )
  }

  const current = subreddits.find((s) => s.subreddit === selected) ?? subreddits[0]
  const engUps = current.engagementHistory.map((h) => h.ups).filter((u): u is number => u !== null)
  const engComments = current.engagementHistory.map((h) => h.comments).filter((c): c is number => c !== null)
  const totalEng = engUps.reduce((a, b) => a + b, 0) + engComments.reduce((a, b) => a + b, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
              <BarChart3 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Trends Scout</h1>
              <p className="text-sm text-gray-500">Reddit trend intelligence & analytics</p>
            </div>
          </div>
        </div>
        <ExportButton
          data={current.topPosts.map((p) => ({
            Subreddit: current.subreddit,
            Title: p.title ?? "",
            Author: p.author ?? "",
            Upvotes: p.ups ?? "",
            Comments: p.comments ?? "",
            "Upvote Ratio": p.upvoteRatio ?? "",
          }))}
          columns={[
            { key: "Subreddit", label: "Subreddit" },
            { key: "Title", label: "Title" },
            { key: "Author", label: "Author" },
            { key: "Upvotes", label: "Upvotes" },
            { key: "Comments", label: "Comments" },
            { key: "Upvote Ratio", label: "Upvote Ratio" },
          ]}
          filename={`trends-${current.subreddit}`}
        />
      </div>

      <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-violet-500 to-violet-300" />

      <div className="mb-8 flex gap-2">
        {subreddits.map((s) => (
          <button
            key={s.subreddit}
            onClick={() => setSelected(s.subreddit)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selected === s.subreddit
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-violet-200 hover:text-violet-600"
            }`}
          >
            r/{s.subreddit}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              r/{current.subreddit}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Community intelligence & engagement metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-violet-500" />
            <span className="text-lg font-bold text-gray-900">
              {current.subscribers?.toLocaleString() ?? "—"}
            </span>
            <span className="text-xs text-gray-400">subscribers</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            Last scraped {new Date(current.lastScraped).toLocaleString("en")}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 size={14} className="text-gray-400" />
            {current.totalSnapshots} snapshots
          </span>
          <span className="flex items-center gap-1.5">
            <ArrowUp size={14} className="text-gray-400" />
            {current.totalPosts} unique posts
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Engagement"
          value={totalEng.toLocaleString()}
          accent="purple"
          trend="up"
          trendLabel="Upvotes + Comments"
        />
        <StatCard
          label="Total Upvotes"
          value={current.avgUps !== null ? current.avgUps.toLocaleString() : null}
          accent="amber"
        />
        <StatCard
          label="Avg Comments"
          value={current.avgComments !== null ? current.avgComments.toLocaleString() : null}
          accent="green"
        />
        <StatCard
          label="Posts Tracked"
          value={current.totalPosts}
          accent="blue"
        />
      </div>

      <div className="mt-6">
        <EngagementChart
          data={current.engagementHistory}
          subreddit={current.subreddit}
        />
      </div>

      <section className="mt-8">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Top Posts — r/{current.subreddit}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {current.topPosts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              author={post.author}
              ups={post.ups}
              comments={post.comments}
              upvoteRatio={post.upvoteRatio}
              permalink={post.permalink}
            />
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
        Data refreshed daily
      </footer>
    </div>
  )
}
