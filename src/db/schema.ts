import { getDb } from "./client"

export async function initDb() {
  const db = await getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reddit_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subreddit TEXT NOT NULL,
      post_id TEXT NOT NULL,
      title TEXT,
      author TEXT,
      ups INTEGER,
      num_comments INTEGER,
      upvote_ratio REAL,
      permalink TEXT,
      url TEXT,
      subreddit_subscribers INTEGER,
      created_utc INTEGER,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_reddit_subreddit ON reddit_snapshots(subreddit)`
  )
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_reddit_post_id ON reddit_snapshots(post_id)`
  )
}
