import { ArrowUp, MessageCircle, ExternalLink } from "lucide-react"

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
  const ratio = upvoteRatio ? Math.round(upvoteRatio * 100) : null
  const ratioColor = ratio !== null
    ? ratio >= 90 ? "bg-emerald-500" : ratio >= 70 ? "bg-amber-500" : "bg-red-500"
    : "bg-gray-300"

  return (
    <a
      href={permalink ? `https://www.reddit.com${permalink}` : "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-violet-200"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {title ?? "Untitled"}
        </h4>
        <ExternalLink size={14} className="mt-0.5 shrink-0 text-gray-300 group-hover:text-violet-400 transition-colors" />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="font-medium text-gray-700">u/{author ?? "unknown"}</span>
        <span className="flex items-center gap-1">
          <ArrowUp size={12} className="text-emerald-500" />
          {ups?.toLocaleString() ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={12} className="text-blue-400" />
          {comments?.toLocaleString() ?? 0}
        </span>
      </div>
      {ratio !== null && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${ratioColor}`}
              style={{ width: `${ratio}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-gray-400">{ratio}%</span>
        </div>
      )}
    </a>
  )
}
