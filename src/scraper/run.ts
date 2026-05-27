import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { scrapeSubreddit } from "./reddit"
import { initDb } from "../db/schema"
import { saveSnapshot } from "../db/queries"

function getSubreddits(): string[] {
  const raw = process.env.REDDIT_SUBREDDITS ?? ""
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

async function main() {
  await initDb()

  const subreddits = getSubreddits()

  if (subreddits.length === 0) {
    console.error("No subreddits configured. Set REDDIT_SUBREDDITS in .env.local")
    console.error("Example: REDDIT_SUBREDDITS=wallstreetbets,cryptocurrency")
    process.exit(1)
  }

  console.log(`Tracking ${subreddits.length} subreddit(s)...\n`)

  for (const subreddit of subreddits) {
    try {
      console.log(`Scraping r/${subreddit}...`)
      const posts = await scrapeSubreddit(subreddit)

      let saved = 0
      for (const post of posts) {
        await saveSnapshot(post)
        saved++
      }

      const topPost = posts.reduce(
        (best, p) => ((p.ups ?? 0) > (best.ups ?? 0) ? p : best),
        posts[0]
      )

      console.log(`  ✓ ${saved} posts — top: ${topPost?.ups} ups "${topPost?.title?.slice(0, 50)}"`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      console.error(`  ✗ r/${subreddit}: ${msg}`)
    }
  }

  console.log("\nDone.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
