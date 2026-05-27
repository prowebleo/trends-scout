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

export type RedditRawPost = {
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

export type RedditChild = {
  kind?: string
  data?: RedditRawPost
}

export type RedditContent = {
  kind?: string
  data?: {
    children?: RedditChild[]
    dist?: number
  }
}

export type WrappedResult = {
  content?: RedditContent
}

export type ScraperResponse = {
  results?: WrappedResult[] | RedditRawPost
  errors?: unknown[]
  status_code?: number
  task_id?: string
}
