import { scrapeSubreddit } from "@/scraper/reddit"
import { initDb } from "@/db/schema"
import { saveSnapshot, getHistory } from "@/db/queries"

export async function GET() {
  try {
    await initDb()

    const subreddit = "wallstreetbets"
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

    return Response.json({
      success: true,
      subreddit,
      posts_scraped: saved,
      top_post: {
        title: topPost?.title?.slice(0, 100),
        ups: topPost?.ups,
        comments: topPost?.numComments,
        author: topPost?.author,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
