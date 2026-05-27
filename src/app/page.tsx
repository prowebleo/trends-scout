"use client"

import { useEffect, useState } from "react"
import KpiCard from "@/components/KpiCard"
import EngagementChart from "@/components/EngagementChart"
import PostCard from "@/components/PostCard"

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
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  if (subreddits.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Trends Scout</h1>
        <p className="mt-2 text-sm text-gray-500">
          No data yet. Run the scraper first.
        </p>
      </div>
    )
  }

  const current = subreddits.find((s) => s.subreddit === selected) ?? subreddits[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Trends Scout
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Reddit trend intelligence & analytics
        </p>
        <div className="mt-4 flex gap-2">
          {subreddits.map((s) => (
            <button
              key={s.subreddit}
              onClick={() => setSelected(s.subreddit)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selected === s.subreddit
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              r/{s.subreddit}
            </button>
          ))}
        </div>
      </header>

      <div className="mb-8 grid grid-cols-4 gap-4">
        <KpiCard
          label="Subscribers"
          value={
            current.subscribers !== null
              ? current.subscribers.toLocaleString()
              : null
          }
          color="blue"
        />
        <KpiCard
          label="Total Posts Tracked"
          value={current.totalPosts}
          color="green"
        />
        <KpiCard
          label="Avg Upvotes"
          value={current.avgUps ?? null}
        />
        <KpiCard
          label="Avg Comments"
          value={current.avgComments ?? null}
          subtitle={
            current.lastScraped
              ? `⏱ ${new Date(current.lastScraped).toLocaleString("en")}`
              : undefined
          }
        />
      </div>

      <div className="mb-8">
        <EngagementChart
          data={current.engagementHistory}
          subreddit={current.subreddit}
        />
      </div>

      <section>
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
        Data refreshed daily via Decodo API
      </footer>
    </div>
  )
}
