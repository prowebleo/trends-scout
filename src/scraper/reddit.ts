import type {
  RedditSnapshot,
  DecodoResponse,
  DecodoWrappedResult,
  DecodoRedditContent,
  DecodoRedditRawPost,
} from "./types"

const API_URL = "https://scraper-api.decodo.com/v2/scrape"

function getAuth(): string {
  const token = process.env.DECODO_API_TOKEN
  if (!token) throw new Error("Falta DECODO_API_TOKEN en .env.local")
  return `Basic ${token}`
}

function toInteger(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value) : null
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : null
}

function extractPost(raw: DecodoRedditRawPost, subreddit: string): RedditSnapshot {
  return {
    subreddit,
    postId: raw.id ?? "",
    title: raw.title ?? null,
    author: raw.author ?? null,
    ups: toInteger(raw.ups ?? raw.score),
    numComments: toInteger(raw.num_comments),
    upvoteRatio: typeof raw.upvote_ratio === "number" ? raw.upvote_ratio : null,
    permalink: raw.permalink ?? null,
    url: raw.url ?? null,
    subredditSubscribers: toInteger(raw.subreddit_subscribers),
    createdUtc: toInteger(raw.created_utc),
  }
}

function hasContent(data: DecodoResponse): data is { results: [DecodoWrappedResult] } {
  return Array.isArray(data.results) && data.results.length > 0 && "content" in data.results[0]
}

function getChildren(data: DecodoResponse): DecodoRedditRawPost[] {
  if (hasContent(data)) {
    const content = data.results[0].content as DecodoRedditContent | undefined
    const children = content?.data?.children
    if (Array.isArray(children)) {
      return children.map((c) => c.data ?? {}).filter(Boolean)
    }
  }
  return []
}

export async function scrapeSubreddit(subreddit: string): Promise<RedditSnapshot[]> {
  const url = `https://www.reddit.com/r/${subreddit}/`

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuth(),
    },
    body: JSON.stringify({
      target: "reddit_subreddit",
      url,
    }),
  })

  if (!response.ok) {
    throw new Error(`Decodo error ${response.status}: ${await response.text()}`)
  }

  const data: DecodoResponse = await response.json()
  const posts = getChildren(data)
  return posts.map((raw) => extractPost(raw, subreddit))
}
