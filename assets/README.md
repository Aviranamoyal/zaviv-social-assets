# Zaviv social asset library

This directory contains the Zaviv campaign asset library. Product imagery comes from the original nine app-feature posts in the repository; interview edits come from the original seven vertical videos.

| # | Deliverable | Files | Format |
|---|---|---:|---|
| 01 | Control-from-anywhere hero poster | 1 | 1080×1350 PNG |
| 02 | Product overview carousel | 6 | 1080×1350 PNG |
| 03 | How Zaviv works carousel | 4 | 1080×1350 PNG |
| 04 | 50+ agent ecosystem graphic | 1 | 1080×1350 PNG |
| 05 | Multi-desktop workflow diagram | 1 | 1080×1350 PNG |
| 06 | Remote-use-case carousel | 5 | 1080×1350 PNG |
| 07 | Pixel View feature demo | 1 | 1080×1920 MP4, 9 seconds |
| 08 | Canvas View feature demo | 1 | 1080×1920 MP4, 9 seconds |
| 09 | Voice-to-terminal feature demo | 1 | 1080×1920 MP4, 9 seconds |
| 10 | Ideas-to-tasks feature demo | 1 | 1080×1920 MP4, 9 seconds |
| 11 | App UI montage | 1 | 1080×1920 MP4, 10.8 seconds |
| 12 | Zaviv launch trailer | 1 | 1080×1920 MP4, 15 seconds |
| 13 | “Your agents don’t stop” cinematic ad | 1 | 1080×1920 MP4, 12 seconds |
| 14 | Founder quote-card series | 7 | 1080×1350 PNG |
| 15 | Retention-hook interview recuts | 7 | 1080×1920 MP4, 12 seconds each |
| 16 | Square and landscape video adaptations | 14 | 1080×1080 and 1920×1080 MP4 |
| 17 | Think-for-yourself carousel | 5 | 1080×1350 PNG |
| 18 | Competitive-moat carousel | 5 | 1080×1350 PNG |
| 19 | Developer/founder meme pack | 6 | 1080×1350 PNG |
| 20 | Social profile kit | 4 | X, LinkedIn, YouTube, and avatar PNGs |
| 21 | “Away from your computer” product story | 3 | 1080×1920 MP4 with BGM, no-BGM MP4, and poster PNG |

## Rebuild

Run from the repository root on macOS:

```sh
./scripts/build-assets.sh all
```

The script also accepts `statics`, `videos`, `adaptations`, or `quotes`. It requires ImageMagick and FFmpeg. Video adaptations use the macOS VideoToolbox H.264 encoder. The source generation plate and its built-in image-generation prompt are documented in [`_brand/IMAGEGEN_PROMPT.md`](./_brand/IMAGEGEN_PROMPT.md).

The feature demos, montage, trailer, and cinematic ad are intentionally silent so they work as caption-first social motion assets. The interview recuts and platform adaptations retain the source audio.

Asset 21 has an editable Remotion project in [`../video-shotcraft/zaviv-away-workflow`](../video-shotcraft/zaviv-away-workflow). Run `npm install`, then `npm run render` or `npm run render:nobgm` from that directory.
