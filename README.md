# Trends Scout

Reddit trend intelligence & analytics — scrapes top posts from subreddits daily and visualizes engagement metrics.

![Dashboard Screenshot](https://github.com/prowebleo/trends-scout/raw/main/screenshot.png)

## Features

- **Multi-subreddit** — Tracks wallstreetbets, cryptocurrency, python simultaneously
- **Engagement metrics** — Upvotes, comments, upvote ratio per post
- **Subreddit selector** — Pill-shaped buttons to switch between communities
- **Bar charts** — Ups vs comments comparison over time
- **CSV export** — Download post data as CSV with one click
- **Scheduled scraping** — GitHub Action runs daily at 8 AM UTC

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Turso (libSQL) |
| Charts | Recharts |
| Scraping | Automated web scraping pipeline |
| Scheduling | GitHub Actions |
| Deployment | Vercel |

## Live Demo

**[trends-scout-gilt.vercel.app](https://trends-scout-gilt.vercel.app)**

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Run Scraper

```bash
npm run scrape
```
