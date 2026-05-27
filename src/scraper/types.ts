export type RedditSnapshot = {
  subreddit: string
  postId: string
  title: string | null
  author: string | null
  ups: number | null
  numComments: number | null
  upvoteRatio: number | null
  permalink: string | null
  url: string | null
  subredditSubscribers: number | null
  createdUtc: number | null
}

export type DecodoRedditRawPost = {
  id?: string
  title?: string
  author?: string
  ups?: number
  num_comments?: number
  upvote_ratio?: number
  permalink?: string
  url?: string
  subreddit_subscribers?: number
  created_utc?: number
  score?: number
  [key: string]: unknown
}

export type DecodoRedditChild = {
  kind?: string
  data?: DecodoRedditRawPost
}

export type DecodoRedditContent = {
  kind?: string
  data?: {
    children?: DecodoRedditChild[]
    dist?: number
  }
}

export type DecodoWrappedResult = {
  content?: DecodoRedditContent
}

export type DecodoResponse = {
  results?: DecodoWrappedResult[] | DecodoRedditRawPost
  errors?: unknown[]
  status_code?: number
  task_id?: string
}
