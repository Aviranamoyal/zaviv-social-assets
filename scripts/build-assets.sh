#!/bin/zsh

set -euo pipefail

ROOT="${0:A:h:h}"
OUT="$ROOT/assets"
BRAND="$OUT/_brand"
BG="$BRAND/campaign-background.png"
FONT="/System/Library/Fonts/Avenir Next.ttc"
ORANGE="#ff6a1a"
BLUE="#1677ff"
WHITE="#f7f7f5"
MUTED="#a9adb8"
INK="#07080b"
TASK_TMP="$(mktemp -d "${ZAVIV_TMP_ROOT:-/tmp}/zaviv-assets.XXXXXX")"

trap 'rm -rf "$TASK_TMP"' EXIT

require_tool() {
  command -v "$1" >/dev/null || {
    print -u2 "Missing required tool: $1"
    exit 1
  }
}

require_tool magick
require_tool ffmpeg
require_tool ffprobe

mkdir -p "$OUT"

background() {
  local width="$1"
  local height="$2"
  local out="$3"
  magick "$BG" \
    -resize "${width}x${height}^" \
    -gravity center \
    -extent "${width}x${height}" \
    -fill 'rgba(0,0,0,0.13)' \
    -colorize 13 \
    "$out"
}

caption_layer() {
  local text="$1"
  local width="$2"
  local height="$3"
  local pointsize="$4"
  local color="$5"
  local weight="$6"
  local gravity="$7"
  local out="$8"
  magick -size "${width}x${height}" \
    -background none \
    -fill "$color" \
    -font "$FONT" \
    -weight "$weight" \
    -pointsize "$pointsize" \
    -gravity "$gravity" \
    -interline-spacing -5 \
    caption:"$text" \
    "$out"
}

round_image() {
  local src="$1"
  local width="$2"
  local height="$3"
  local radius="$4"
  local out="$5"
  local image="$TASK_TMP/round-image.png"
  local mask="$TASK_TMP/round-mask.png"
  magick "$src" -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" "$image"
  magick -size "${width}x${height}" xc:none -fill white \
    -draw "roundrectangle 1,1,$((width - 2)),$((height - 2)),$radius,$radius" "$mask"
  magick "$image" "$mask" -alpha off -compose CopyOpacity -composite +repage -compose over \
    -bordercolor "$ORANGE" -border 2 "$out"
}

brand_header() {
  local canvas="$1"
  local width="$2"
  local label="$3"
  local logo="$TASK_TMP/logo.png"
  local eyebrow="$TASK_TMP/eyebrow.png"
  caption_layer "Z A V I V" "$((width - 120))" 64 38 "$WHITE" 700 center "$logo"
  caption_layer "$label" "$((width - 120))" 34 20 "$ORANGE" 700 center "$eyebrow"
  magick "$canvas" "$logo" -gravity north -geometry +0+44 -composite \
    "$eyebrow" -gravity north -geometry +0+112 -composite "$canvas"
}

footer_rule() {
  local canvas="$1"
  local width="$2"
  local height="$3"
  magick "$canvas" \
    -fill 'rgba(255,255,255,0.16)' \
    -draw "rectangle 80,$((height - 90)),$((width - 80)),$((height - 88))" \
    -font "$FONT" -weight 500 -pointsize 18 -fill "$MUTED" \
    -gravity south -annotate +0+42 "REMOTE AGENT CONTROL" \
    "$canvas"
}

make_post() {
  local out="$1"
  local section="$2"
  local title="$3"
  local body="$4"
  local source="${5:-}"
  local marker="${6:-}"
  local dir="${out:h}"
  mkdir -p "$dir"

  local canvas="$TASK_TMP/post-canvas.png"
  local title_layer="$TASK_TMP/post-title.png"
  local body_layer="$TASK_TMP/post-body.png"
  background 1080 1350 "$canvas"
  brand_header "$canvas" 1080 "$section"
  caption_layer "$title" 900 250 68 "$WHITE" 700 center "$title_layer"
  caption_layer "$body" 820 145 29 "$MUTED" 500 center "$body_layer"
  magick "$canvas" "$title_layer" -gravity north -geometry +0+168 -composite \
    "$body_layer" -gravity north -geometry +0+415 -composite "$canvas"

  if [[ -n "$source" ]]; then
    local card="$TASK_TMP/post-card.png"
    round_image "$source" 430 538 32 "$card"
    magick "$canvas" \
      \( "$card" -background '#00000080' -shadow 55x16+0+18 \) -gravity south -geometry +0+132 -composite \
      "$card" -gravity south -geometry +0+150 -composite "$canvas"
  else
    local glyph="${marker:-+}"
    magick "$canvas" \
      -fill 'rgba(255,106,26,0.12)' -stroke "$ORANGE" -strokewidth 3 \
      -draw 'circle 540,875 540,690' \
      -fill 'rgba(22,119,255,0.10)' -stroke "$BLUE" -strokewidth 2 \
      -draw 'circle 540,875 540,730' \
      -font "$FONT" -weight 700 -pointsize 142 -fill "$WHITE" -stroke none \
      -gravity center -annotate +0+198 "$glyph" "$canvas"
  fi

  footer_rule "$canvas" 1080 1350
  magick "$canvas" -strip -dither None -colors 256 "PNG8:$out"
}

make_diagram_post() {
  local out="$1"
  local section="$2"
  local title="$3"
  local body="$4"
  local mode="$5"
  local canvas="$TASK_TMP/diagram-canvas.png"
  local title_layer="$TASK_TMP/diagram-title.png"
  local body_layer="$TASK_TMP/diagram-body.png"
  mkdir -p "${out:h}"
  background 1080 1350 "$canvas"
  brand_header "$canvas" 1080 "$section"
  caption_layer "$title" 900 220 66 "$WHITE" 700 center "$title_layer"
  caption_layer "$body" 820 120 27 "$MUTED" 500 center "$body_layer"
  magick "$canvas" "$title_layer" -gravity north -geometry +0+160 -composite \
    "$body_layer" -gravity north -geometry +0+370 -composite "$canvas"

  if [[ "$mode" == "ecosystem" ]]; then
    magick "$canvas" \
      -stroke "$ORANGE" -strokewidth 4 -fill 'rgba(255,106,26,0.12)' \
      -draw 'roundrectangle 375,640 705,890 44,44' \
      -stroke 'rgba(255,255,255,0.24)' -strokewidth 2 -fill 'rgba(6,8,12,0.82)' \
      -draw 'roundrectangle 80,590 320,720 30,30' \
      -draw 'roundrectangle 760,590 1000,720 30,30' \
      -draw 'roundrectangle 80,850 320,980 30,30' \
      -draw 'roundrectangle 760,850 1000,980 30,30' \
      -stroke "$ORANGE" -strokewidth 3 -draw 'line 320,655 375,720' \
      -stroke "$BLUE" -draw 'line 705,720 760,655' \
      -stroke "$BLUE" -draw 'line 320,915 375,820' \
      -stroke "$ORANGE" -draw 'line 705,820 760,915' \
      -font "$FONT" -stroke none -fill "$WHITE" -weight 700 -pointsize 58 \
      -gravity north -annotate +0+705 "50+" \
      -pointsize 26 -fill "$ORANGE" -annotate +0+785 "CODING AGENTS" \
      -pointsize 29 -fill "$WHITE" -annotate -340+618 "AGENTS" \
      -annotate +340+618 "MODELS" \
      -annotate -340+878 "WORKSPACES" \
      -annotate +340+878 "TERMINALS" "$canvas"
  else
    magick "$canvas" \
      -stroke "$ORANGE" -strokewidth 4 -fill 'rgba(255,106,26,0.12)' \
      -draw 'roundrectangle 405,650 675,995 54,54' \
      -stroke 'rgba(255,255,255,0.28)' -strokewidth 2 -fill 'rgba(6,8,12,0.82)' \
      -draw 'roundrectangle 80,590 330,730 24,24' \
      -draw 'roundrectangle 750,590 1000,730 24,24' \
      -draw 'roundrectangle 80,940 330,1080 24,24' \
      -stroke "$ORANGE" -strokewidth 3 -draw 'line 330,660 405,740' \
      -stroke "$BLUE" -draw 'line 675,740 750,660' \
      -stroke "$BLUE" -draw 'line 330,1010 405,910' \
      -font "$FONT" -stroke none -fill "$WHITE" -weight 700 \
      -pointsize 36 -gravity north -annotate +0+745 "ZAVIV" \
      -pointsize 23 -fill "$MUTED" -annotate +0+830 "MOBILE CONTROL" \
      -pointsize 27 -fill "$WHITE" -annotate -335+615 "MACBOOK" \
      -annotate +335+615 "DESKTOP" \
      -annotate -335+965 "SSH HOST" "$canvas"
  fi
  footer_rule "$canvas" 1080 1350
  magick "$canvas" -strip -dither None -colors 256 "PNG8:$out"
}

make_quote_card() {
  local video="$1"
  local quote="$2"
  local source="$3"
  local out="$4"
  local frame="$TASK_TMP/quote-frame.png"
  local quote_layer="$TASK_TMP/quote-copy.png"
  mkdir -p "${out:h}"
  ffmpeg -loglevel error -y -ss 3 -i "$video" -frames:v 1 \
    -vf 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1350:0:540' "$frame"
  magick "$frame" \
    -fill 'rgba(0,0,0,0.18)' -colorize 18 \
    -fill '#07080b' -draw 'rectangle 0,590 1080,1350' \
    -fill "$ORANGE" -draw 'roundrectangle 72,650 88,910 8,8' "$frame"
  caption_layer "“$quote”" 820 430 55 "$WHITE" 700 northwest "$quote_layer"
  magick "$frame" "$quote_layer" -gravity southwest -geometry +125+205 -composite \
    -font "$FONT" -weight 700 -pointsize 23 -fill "$ORANGE" \
    -gravity southwest -annotate +128+118 "$source" \
    -font "$FONT" -weight 700 -pointsize 30 -fill "$WHITE" \
    -gravity north -annotate +0+48 "Z A V I V" \
    -strip -dither None -colors 256 "PNG8:$out"
}

make_meme() {
  local top="$1"
  local bottom="$2"
  local source="$3"
  local out="$4"
  local canvas="$TASK_TMP/meme-canvas.png"
  local source_card="$TASK_TMP/meme-source.png"
  local top_layer="$TASK_TMP/meme-top.png"
  local bottom_layer="$TASK_TMP/meme-bottom.png"
  mkdir -p "${out:h}"
  background 1080 1350 "$canvas"
  round_image "$source" 820 760 42 "$source_card"
  caption_layer "$top" 900 210 54 "$WHITE" 700 center "$top_layer"
  caption_layer "$bottom" 900 190 45 "$ORANGE" 700 center "$bottom_layer"
  magick "$canvas" "$top_layer" -gravity north -geometry +0+55 -composite \
    "$source_card" -gravity center -geometry +0+70 -composite \
    "$bottom_layer" -gravity south -geometry +0+40 -composite \
    -strip -dither None -colors 256 "PNG8:$out"
}

make_banner() {
  local width="$1"
  local height="$2"
  local out="$3"
  local title_size="$4"
  local canvas="$TASK_TMP/banner-canvas.png"
  local title_layer="$TASK_TMP/banner-title.png"
  local sub_layer="$TASK_TMP/banner-sub.png"
  mkdir -p "${out:h}"
  background "$width" "$height" "$canvas"
  caption_layer "Z A V I V" "$((width * 45 / 100))" "$((height * 30 / 100))" "$title_size" "$WHITE" 700 center "$title_layer"
  caption_layer "YOUR CODING AGENTS.\nIN YOUR POCKET." "$((width * 45 / 100))" "$((height * 30 / 100))" "$((title_size * 44 / 100))" "$MUTED" 700 center "$sub_layer"
  magick "$canvas" \
    -fill 'rgba(6,8,12,0.74)' -stroke 'rgba(255,255,255,0.18)' -strokewidth 2 \
    -draw "roundrectangle $((width * 61 / 100)),$((height * 16 / 100)),$((width * 86 / 100)),$((height * 84 / 100)),$((height / 12)),$((height / 12))" \
    -fill "$ORANGE" -stroke none \
    -draw "roundrectangle $((width * 64 / 100)),$((height * 23 / 100)),$((width * 83 / 100)),$((height * 31 / 100)),$((height / 40)),$((height / 40))" \
    -fill "$BLUE" \
    -draw "roundrectangle $((width * 64 / 100)),$((height * 37 / 100)),$((width * 80 / 100)),$((height * 45 / 100)),$((height / 40)),$((height / 40))" \
    -fill 'rgba(255,255,255,0.18)' \
    -draw "roundrectangle $((width * 64 / 100)),$((height * 52 / 100)),$((width * 82 / 100)),$((height * 60 / 100)),$((height / 40)),$((height / 40))" \
    "$title_layer" -gravity west -geometry +"$((width * 9 / 100))"+"$((height * -7 / 100))" -composite \
    "$sub_layer" -gravity west -geometry +"$((width * 9 / 100))"+"$((height * 20 / 100))" -composite \
    -strip -dither None -colors 256 "PNG8:$out"
}

make_avatar() {
  local out="$1"
  local canvas="$TASK_TMP/avatar-canvas.png"
  mkdir -p "${out:h}"
  background 1024 1024 "$canvas"
  magick "$canvas" \
    -fill 'rgba(7,8,11,0.78)' -stroke "$ORANGE" -strokewidth 10 \
    -draw 'circle 512,512 512,130' \
    -font "$FONT" -weight 700 -pointsize 340 -fill "$WHITE" -stroke none \
    -gravity center -annotate +0-8 "Z" \
    -fill "$BLUE" -draw 'circle 760,760 760,718' \
    -strip -dither None -colors 256 "PNG8:$out"
}

make_story_frame() {
  local source="$1"
  local section="$2"
  local title="$3"
  local body="$4"
  local out="$5"
  local canvas="$TASK_TMP/story-canvas.png"
  local title_layer="$TASK_TMP/story-title.png"
  local body_layer="$TASK_TMP/story-body.png"
  local card="$TASK_TMP/story-card.png"
  background 1080 1920 "$canvas"
  brand_header "$canvas" 1080 "$section"
  caption_layer "$title" 900 300 76 "$WHITE" 700 center "$title_layer"
  caption_layer "$body" 820 170 31 "$MUTED" 500 center "$body_layer"
  round_image "$source" 820 1025 34 "$card"
  magick "$canvas" "$title_layer" -gravity north -geometry +0+175 -composite \
    "$body_layer" -gravity north -geometry +0+455 -composite \
    \( "$card" -background '#00000080' -shadow 55x18+0+22 \) -compose over \
      -gravity south -geometry +0+165 -composite \
    "$card" -gravity south -geometry +0+188 -composite \
    -fill 'rgba(255,255,255,0.16)' -draw 'rectangle 90,1820 990,1822' \
    -font "$FONT" -weight 600 -pointsize 20 -fill "$MUTED" \
    -gravity south -annotate +0+45 "REMOTE AGENT CONTROL" \
    -strip -dither None -colors 256 "PNG8:$out"
}

animate_story() {
  local frame="$1"
  local duration="$2"
  local out="$3"
  mkdir -p "${out:h}"
  ffmpeg -loglevel error -y -loop 1 -framerate 30 -i "$frame" -t "$duration" \
    -vf "scale=1080:1920,zoompan=z='min(zoom+0.00020,1.045)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p" \
    -an -c:v libx264 -preset veryfast -crf 24 -movflags +faststart "$out"
}

make_demo_video() {
  local source="$1"
  local section="$2"
  local title="$3"
  local body="$4"
  local out="$5"
  local frame="$TASK_TMP/demo-frame.png"
  make_story_frame "$source" "$section" "$title" "$body" "$frame"
  animate_story "$frame" 9 "$out"
}

concat_segments() {
  local out="$1"
  shift
  local list="$TASK_TMP/concat-$RANDOM.txt"
  : > "$list"
  local segment
  for segment in "$@"; do
    print -r -- "file '$segment'" >> "$list"
  done
  mkdir -p "${out:h}"
  ffmpeg -loglevel error -y -f concat -safe 0 -i "$list" -c copy -movflags +faststart "$out"
}

make_montage_video() {
  local out="$OUT/11-ui-montage/ui-montage.mp4"
  local -a labels=(
    "DESKTOP + SSH" "PIXEL VIEW" "CANVAS VIEW" "LIVE TERMINALS" "EVERY MACHINE"
    "50+ AGENTS" "IDEAS TO TASKS" "VOICE CONTROL" "YOUR TERMINAL THEME"
  )
  local -a segments=()
  local index source frame segment
  for index in {1..9}; do
    source="$ROOT/zaviv-$(printf '%02d' "$index").png"
    frame="$TASK_TMP/montage-frame-$index.png"
    segment="$TASK_TMP/montage-segment-$index.mp4"
    make_story_frame "$source" "PRODUCT TOUR · $index/9" "${labels[$index]}" \
      "One mobile control layer for the work already running on your machines." "$frame"
    animate_story "$frame" 1.2 "$segment"
    segments+=("$segment")
  done
  concat_segments "$out" "${segments[@]}"
}

make_launch_trailer() {
  local -a sources=(
    "$OUT/01-hero-poster/hero-poster.png"
    "$ROOT/zaviv-05.png"
    "$ROOT/zaviv-06.png"
    "$ROOT/zaviv-04.png"
    "$OUT/04-agent-ecosystem/agent-ecosystem.png"
  )
  local -a titles=(
    "THE DESK IS OPTIONAL."
    "CONNECT EVERY MACHINE."
    "CHOOSE ANY AGENT."
    "WATCH THE WORK."
    "KEEP SHIPPING."
  )
  local -a bodies=(
    "Your coding agents are already working. Take the control layer with you."
    "Pair desktops and SSH hosts in one mobile workspace."
    "Pick the agent, model, and workspace that fit the task."
    "Monitor live sessions and step in at the right moment."
    "Zaviv puts your coding agents in your pocket."
  )
  local -a segments=()
  local index frame segment
  for index in {1..5}; do
    frame="$TASK_TMP/launch-frame-$index.png"
    segment="$TASK_TMP/launch-segment-$index.mp4"
    make_story_frame "${sources[$index]}" "ZAVIV LAUNCH · $index/5" \
      "${titles[$index]}" "${bodies[$index]}" "$frame"
    animate_story "$frame" 3 "$segment"
    segments+=("$segment")
  done
  concat_segments "$OUT/12-launch-trailer/launch-trailer-15s.mp4" "${segments[@]}"
}

make_cinematic_ad() {
  local -a sources=("$ROOT/zaviv-01.png" "$ROOT/zaviv-04.png" "$OUT/01-hero-poster/hero-poster.png")
  local -a titles=("YOUR AGENTS DON’T STOP." "WHEN YOU LEAVE YOUR DESK." "KEEP THEM MOVING.")
  local -a bodies=(
    "Work keeps running on your machines."
    "See sessions, send instructions, and unblock the next step from your phone."
    "Zaviv. Remote agent control."
  )
  local -a segments=()
  local index frame segment
  for index in {1..3}; do
    frame="$TASK_TMP/cinematic-frame-$index.png"
    segment="$TASK_TMP/cinematic-segment-$index.mp4"
    make_story_frame "${sources[$index]}" "CINEMATIC PRODUCT AD" \
      "${titles[$index]}" "${bodies[$index]}" "$frame"
    animate_story "$frame" 4 "$segment"
    segments+=("$segment")
  done
  concat_segments "$OUT/13-cinematic-ad/cinematic-ad-12s.mp4" "${segments[@]}"
}

make_hook_clip() {
  local input="$1"
  local hook="$2"
  local out="$3"
  local banner="$TASK_TMP/hook-banner.png"
  local hook_layer="$TASK_TMP/hook-copy.png"
  mkdir -p "${out:h}"
  magick -size 1080x280 xc:none \
    -fill 'rgba(0,0,0,0.80)' -draw 'roundrectangle 40,38 1040,252 42,42' \
    -stroke 'rgba(255,106,26,0.75)' -strokewidth 3 -fill none \
    -draw 'roundrectangle 40,38 1040,252 42,42' "$banner"
  caption_layer "$hook" 900 170 49 "$WHITE" 700 center "$hook_layer"
  magick "$banner" "$hook_layer" -gravity center -geometry +0+5 -composite "$banner"
  ffmpeg -loglevel error -y -i "$input" -loop 1 -i "$banner" -t 12 \
    -filter_complex '[0:v][1:v]overlay=0:28:shortest=1,format=yuv420p[v]' \
    -map '[v]' -map '0:a?' -c:v libx264 -preset veryfast -crf 24 \
    -c:a aac -b:a 96k -movflags +faststart "$out"
}

make_platform_versions() {
  local input="$1"
  local stem="$2"
  local square="$OUT/16-platform-adaptations/square/${stem}-square.mp4"
  local landscape="$OUT/16-platform-adaptations/landscape/${stem}-landscape.mp4"
  mkdir -p "${square:h}" "${landscape:h}"
  ffmpeg -loglevel error -y -i "$input" \
    -filter_complex '[0:v]split=2[bg][fg];[bg]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,boxblur=24:2[bg2];[fg]scale=-2:1020[fg2];[bg2][fg2]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]' \
    -map '[v]' -map '0:a?' -c:v h264_videotoolbox -b:v 1800k -realtime true -allow_sw 1 \
    -c:a aac -b:a 96k -movflags +faststart "$square"
  ffmpeg -loglevel error -y -i "$input" \
    -filter_complex '[0:v]split=2[bg][fg];[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=28:2[bg2];[fg]scale=-2:1040[fg2];[bg2][fg2]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]' \
    -map '[v]' -map '0:a?' -c:v h264_videotoolbox -b:v 2000k -realtime true -allow_sw 1 \
    -c:a aac -b:a 96k -movflags +faststart "$landscape"
}

build_videos() {
  make_demo_video "$ROOT/zaviv-02.png" "FEATURE DEMO · PIXEL VIEW" \
    "See every agent at a glance." \
    "Pixel View turns your workspace into a live visual map." \
    "$OUT/07-pixel-view-demo/pixel-view-demo-9s.mp4"
  make_demo_video "$ROOT/zaviv-03.png" "FEATURE DEMO · CANVAS VIEW" \
    "One endless board for every session." \
    "Keep terminal shells and agents visible side by side." \
    "$OUT/08-canvas-view-demo/canvas-view-demo-9s.mp4"
  make_demo_video "$ROOT/zaviv-08.png" "FEATURE DEMO · VOICE" \
    "Talk to your terminal." \
    "Dispatch tasks by voice and stay in control without typing." \
    "$OUT/09-voice-terminal-demo/voice-terminal-demo-9s.mp4"
  make_demo_video "$ROOT/zaviv-07.png" "FEATURE DEMO · WORK" \
    "Turn ideas into tasks." \
    "Create, review, and track agent work from one focused queue." \
    "$OUT/10-ideas-to-tasks-demo/ideas-to-tasks-demo-9s.mp4"

  make_montage_video
  make_launch_trailer
  make_cinematic_ad

  make_hook_clip "$ROOT/videos/Automating_good_morning_texts_for_dating.mp4" \
    "WHEN DOES AUTOMATION GO TOO FAR?" \
    "$OUT/15-hook-clips/hook-01-automation.mp4"
  make_hook_clip "$ROOT/videos/Think_for_yourself_or_be_replaced.mp4" \
    "AI REWARDS PEOPLE WHO THINK." \
    "$OUT/15-hook-clips/hook-02-think-for-yourself.mp4"
  make_hook_clip "$ROOT/videos/my_competitors_in_my_app_moat.mp4" \
    "MY COMPETITORS STRENGTHEN MY MOAT." \
    "$OUT/15-hook-clips/hook-03-competitors.mp4"
  make_hook_clip "$ROOT/videos/From_rivals_to_friends.mp4" \
    "RIVALS CAN BECOME FRIENDS." \
    "$OUT/15-hook-clips/hook-04-rivals.mp4"
  make_hook_clip "$ROOT/videos/Learn_on_the_way.mp4" \
    "YOU DON’T NEED THE WHOLE MAP." \
    "$OUT/15-hook-clips/hook-05-learn.mp4"
  make_hook_clip "$ROOT/videos/10_years_to_get_rich_with_AI.mp4" \
    "AI OPENED A TEN-YEAR WINDOW." \
    "$OUT/15-hook-clips/hook-06-ai-window.mp4"
  make_hook_clip "$ROOT/videos/Make_existing_markets_better.mp4" \
    "YOU DON’T NEED A NEW MARKET." \
    "$OUT/15-hook-clips/hook-07-markets.mp4"

  build_adaptations
}

build_adaptations() {
  make_platform_versions "$ROOT/videos/Automating_good_morning_texts_for_dating.mp4" "automation"
  make_platform_versions "$ROOT/videos/Think_for_yourself_or_be_replaced.mp4" "think-for-yourself"
  make_platform_versions "$ROOT/videos/my_competitors_in_my_app_moat.mp4" "competitors"
  make_platform_versions "$ROOT/videos/From_rivals_to_friends.mp4" "rivals-to-friends"
  make_platform_versions "$ROOT/videos/Learn_on_the_way.mp4" "learn-on-the-way"
  make_platform_versions "$ROOT/videos/10_years_to_get_rich_with_AI.mp4" "ai-window"
  make_platform_versions "$ROOT/videos/Make_existing_markets_better.mp4" "existing-markets"
}

build_quotes() {
  make_quote_card "$ROOT/videos/Automating_good_morning_texts_for_dating.mp4" \
    "Automation turns a good-morning text into a system." "AUTOMATION" \
    "$OUT/14-founder-quotes/quote-01-automation.png"
  make_quote_card "$ROOT/videos/Think_for_yourself_or_be_replaced.mp4" \
    "Think for yourself—or be replaced." "INDEPENDENT THINKING" \
    "$OUT/14-founder-quotes/quote-02-think-for-yourself.png"
  make_quote_card "$ROOT/videos/my_competitors_in_my_app_moat.mp4" \
    "My competitors are part of my app’s moat." "COMPETITIVE MOATS" \
    "$OUT/14-founder-quotes/quote-03-competitors.png"
  make_quote_card "$ROOT/videos/From_rivals_to_friends.mp4" \
    "Rivals can become friends." "RELATIONSHIPS" \
    "$OUT/14-founder-quotes/quote-04-rivals.png"
  make_quote_card "$ROOT/videos/Learn_on_the_way.mp4" \
    "Learn on the way." "BUILDING" \
    "$OUT/14-founder-quotes/quote-05-learn.png"
  make_quote_card "$ROOT/videos/10_years_to_get_rich_with_AI.mp4" \
    "AI gives you a ten-year window to build wealth." "AI OPPORTUNITY" \
    "$OUT/14-founder-quotes/quote-06-ai-window.png"
  make_quote_card "$ROOT/videos/Make_existing_markets_better.mp4" \
    "Make existing markets better." "MARKET STRATEGY" \
    "$OUT/14-founder-quotes/quote-07-markets.png"
}

build_statics() {
  make_post "$OUT/01-hero-poster/hero-poster.png" "PRODUCT STORY" \
    "Control your coding agents from anywhere." \
    "See every terminal, choose any agent, and keep work moving from your phone." \
    "$ROOT/zaviv-06.png"

  make_post "$OUT/02-product-overview-carousel/slide-01.png" "PRODUCT OVERVIEW · 1/6" \
    "Your coding agents. In your pocket." \
    "Zaviv connects your phone to the terminals and AI agents already running on your machines." \
    "" "01"
  make_post "$OUT/02-product-overview-carousel/slide-02.png" "PRODUCT OVERVIEW · 2/6" \
    "One control layer." \
    "See every desktop, agent, and terminal session from one mobile workspace." \
    "$ROOT/zaviv-05.png"
  make_post "$OUT/02-product-overview-carousel/slide-03.png" "PRODUCT OVERVIEW · 3/6" \
    "Choose any agent." \
    "Launch the right coding agent, model, and workspace without returning to your desk." \
    "$ROOT/zaviv-06.png"
  make_post "$OUT/02-product-overview-carousel/slide-04.png" "PRODUCT OVERVIEW · 4/6" \
    "Watch work happen." \
    "Use Pixel View for the big picture or Canvas View for side-by-side detail." \
    "$ROOT/zaviv-02.png"
  make_post "$OUT/02-product-overview-carousel/slide-05.png" "PRODUCT OVERVIEW · 5/6" \
    "Turn ideas into tasks." \
    "Create, review, and track agent work from one focused queue." \
    "$ROOT/zaviv-07.png"
  make_post "$OUT/02-product-overview-carousel/slide-06.png" "PRODUCT OVERVIEW · 6/6" \
    "Leave the desk. Keep shipping." \
    "Monitor progress, send instructions, and jump into live sessions from anywhere." \
    "$ROOT/zaviv-04.png"

  make_post "$OUT/03-how-zaviv-works-carousel/slide-01.png" "HOW IT WORKS · 1/4" \
    "Desktop power. Mobile control." \
    "A three-step workflow for keeping your agents moving wherever you are." \
    "" "3"
  make_post "$OUT/03-how-zaviv-works-carousel/slide-02.png" "HOW IT WORKS · 2/4" \
    "1. Connect your machines." \
    "Pair desktops or SSH hosts, then see them together in one mobile workspace." \
    "$ROOT/zaviv-05.png"
  make_post "$OUT/03-how-zaviv-works-carousel/slide-03.png" "HOW IT WORKS · 3/4" \
    "2. Choose an agent." \
    "Pick the coding agent, model, and workspace that fit the task." \
    "$ROOT/zaviv-06.png"
  make_post "$OUT/03-how-zaviv-works-carousel/slide-04.png" "HOW IT WORKS · 4/4" \
    "3. Dispatch and monitor." \
    "Send the task, watch the session, and step in from your phone when needed." \
    "$ROOT/zaviv-04.png"

  make_diagram_post "$OUT/04-agent-ecosystem/agent-ecosystem.png" "AGENT ECOSYSTEM" \
    "50+ coding agents. One mobile app." \
    "Bring agents, models, workspaces, and terminals into a single control layer." "ecosystem"

  make_diagram_post "$OUT/05-multi-desktop-workflow/multi-desktop-workflow.png" "WORKFLOW MAP" \
    "One phone. Every machine." \
    "Monitor local desktops and remote SSH hosts without losing the thread." "desktops"

  make_post "$OUT/06-remote-use-cases/slide-01.png" "REMOTE USE CASES · 1/5" \
    "The desk is optional." \
    "Four moments when mobile agent control keeps work moving." "" "04"
  make_post "$OUT/06-remote-use-cases/slide-02.png" "REMOTE USE CASES · 2/5" \
    "On the commute." \
    "Check overnight runs, answer an agent, and set the next task before you arrive." "$ROOT/zaviv-01.png"
  make_post "$OUT/06-remote-use-cases/slide-03.png" "REMOTE USE CASES · 3/5" \
    "At the coffee shop." \
    "Keep your full machines working while your phone handles the control layer." "$ROOT/zaviv-02.png"
  make_post "$OUT/06-remote-use-cases/slide-04.png" "REMOTE USE CASES · 4/5" \
    "Between meetings." \
    "Review progress and unblock the next step without opening a laptop." "$ROOT/zaviv-07.png"
  make_post "$OUT/06-remote-use-cases/slide-05.png" "REMOTE USE CASES · 5/5" \
    "From the couch." \
    "Stay close to the work without staying chained to the desk." "$ROOT/zaviv-04.png"

  build_quotes

  make_post "$OUT/17-think-for-yourself-carousel/slide-01.png" "FOUNDER IDEA · 1/5" \
    "Think for yourself—or be replaced." \
    "AI makes independent judgment more valuable, not less." "" "AI"
  make_post "$OUT/17-think-for-yourself-carousel/slide-02.png" "FOUNDER IDEA · 2/5" \
    "AI can produce an answer." \
    "That does not mean it understands your customer, constraints, or taste." "$ROOT/zaviv-08.png"
  make_post "$OUT/17-think-for-yourself-carousel/slide-03.png" "FOUNDER IDEA · 3/5" \
    "Judgment is the moat." \
    "The advantage is knowing what to ask, what to trust, and what to reject." "$ROOT/zaviv-09.png"
  make_post "$OUT/17-think-for-yourself-carousel/slide-04.png" "FOUNDER IDEA · 4/5" \
    "Use agents as leverage." \
    "Delegate execution while keeping product direction and standards human." "$ROOT/zaviv-07.png"
  make_post "$OUT/17-think-for-yourself-carousel/slide-05.png" "FOUNDER IDEA · 5/5" \
    "Stay in the loop." \
    "Zaviv keeps agent work visible so your judgment can land at the right moment." "$ROOT/zaviv-04.png"

  make_post "$OUT/18-competitive-moat-carousel/slide-01.png" "FOUNDER IDEA · 1/5" \
    "What if competitors strengthen your moat?" \
    "Platforms win when choice becomes part of the product." "" "↗"
  make_post "$OUT/18-competitive-moat-carousel/slide-02.png" "FOUNDER IDEA · 2/5" \
    "Choice attracts users." \
    "People can bring the coding agent, model, and workflow they already prefer." "$ROOT/zaviv-06.png"
  make_post "$OUT/18-competitive-moat-carousel/slide-03.png" "FOUNDER IDEA · 3/5" \
    "Variety increases utility." \
    "Every supported agent makes the control layer useful in more situations." "$ROOT/zaviv-02.png"
  make_post "$OUT/18-competitive-moat-carousel/slide-04.png" "FOUNDER IDEA · 4/5" \
    "The layer becomes the habit." \
    "Users return to the place where all their machines and sessions already live." "$ROOT/zaviv-05.png"
  make_post "$OUT/18-competitive-moat-carousel/slide-05.png" "FOUNDER IDEA · 5/5" \
    "The ecosystem is the moat." \
    "Zaviv turns agent competition into user choice—and user choice into retention." "$ROOT/zaviv-01.png"

  make_meme "THE BUILD IS GREEN" "ME, ALREADY OUTSIDE" "$ROOT/zaviv-04.png" \
    "$OUT/19-meme-pack/meme-01-build-is-green.png"
  make_meme "I’LL CHECK IT WHEN I’M BACK" "ZAVIV: YOU CAN CHECK IT NOW" "$ROOT/zaviv-02.png" \
    "$OUT/19-meme-pack/meme-02-check-it-now.png"
  make_meme "ONE MORE PROMPT" "SENT FROM THE COUCH" "$ROOT/zaviv-06.png" \
    "$OUT/19-meme-pack/meme-03-couch-prompt.png"
  make_meme "MY AGENT NEEDS INPUT" "GOOD THING MY PHONE HAS A KEYBOARD" "$ROOT/zaviv-08.png" \
    "$OUT/19-meme-pack/meme-04-agent-input.png"
  make_meme "REMOTE WORK" "BUT THE WORK IS AN AI AGENT" "$ROOT/zaviv-05.png" \
    "$OUT/19-meme-pack/meme-05-remote-work.png"
  make_meme "TOUCH GRASS" "KEEP TERMINAL ACCESS" "$ROOT/zaviv-01.png" \
    "$OUT/19-meme-pack/meme-06-touch-grass.png"

  make_banner 1500 500 "$OUT/20-social-profile-kit/x-header-1500x500.png" 82
  make_banner 1584 396 "$OUT/20-social-profile-kit/linkedin-banner-1584x396.png" 72
  make_banner 2560 1440 "$OUT/20-social-profile-kit/youtube-banner-2560x1440.png" 126
  make_avatar "$OUT/20-social-profile-kit/avatar-1024x1024.png"
}

case "${1:-all}" in
  statics)
    build_statics
    print "Static assets rendered under $OUT"
    ;;
  videos)
    build_videos
    print "Video assets rendered under $OUT"
    ;;
  adaptations)
    build_adaptations
    print "Platform adaptations rendered under $OUT"
    ;;
  quotes)
    build_quotes
    print "Founder quote cards rendered under $OUT"
    ;;
  all)
    build_statics
    build_videos
    print "All assets rendered under $OUT"
    ;;
  *)
    print -u2 "Usage: ${0:t} [all|statics|videos|adaptations|quotes]"
    exit 2
    ;;
esac
