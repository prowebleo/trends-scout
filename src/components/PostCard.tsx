type Props = {
  title: string | null
  author: string | null
  ups: number | null
  comments: number | null
  upvoteRatio: number | null
  permalink: string | null
}

export default function PostCard({
  title,
  author,
  ups,
  comments,
  upvoteRatio,
  permalink,
}: Props) {
  return (
    <a
      href={permalink ? `https://www.reddit.com${permalink}` : "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
        {title ?? "Untitled"}
      </h4>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        <span>u/{author ?? "unknown"}</span>
        <span className="flex items-center gap-1">
          ▲ {ups ?? 0}
        </span>
        <span className="flex items-center gap-1">
          💬 {comments ?? 0}
        </span>
        {upvoteRatio && (
          <span className="text-gray-400">
            {Math.round(upvoteRatio * 100)}%
          </span>
        )}
      </div>
    </a>
  )
}
