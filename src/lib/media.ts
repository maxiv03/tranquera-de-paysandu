// Local media conventions (files in public/, credited in CREDITS.md).

/** Poster image of a local video: /videos/name.mp4 → /videos/name-poster.webp */
export function posterFor(videoUrl: string) {
  return videoUrl.replace(/\.mp4$/, "-poster.webp");
}

/** Sample footage looped on the live page (demo broadcast). */
export const LIVE_VIDEO = "/videos/herd-aerial.mp4";
