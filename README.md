# Trends Scout

Pulls top posts from Reddit subreddits (wallstreetbets, cryptocurrency, python) and shows engagement metrics — upvotes, comments, upvote ratio. Subreddit selector to switch between communities.

## Why

Wanted to see what content gains traction in different communities without manually browsing. The scraper collects 25 posts per subreddit daily at 8 AM UTC.

## Stack

Next.js 15, Turso (libSQL), Recharts, GitHub Actions, Vercel

## Live

**[trends-scout-gilt.vercel.app](https://trends-scout-gilt.vercel.app)**

## Running locally

```bash
npm install
# configure .env.local with your tokens
npm run dev
npm run scrape
```
