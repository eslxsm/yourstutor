# YoursTutor website

A plain HTML/CSS/JS site with no build step. Push it to GitHub and it runs on GitHub Pages as-is.

```
index.html          all page content and text
css/styles.css      design
js/main.js          menu, animations, demo form, video player
js/testimonials.js  the list of video testimonials  <- edit this to add videos
images/             logos and student photos
videos/             optional .mp4 testimonial files
```

## Adding a video testimonial

The "Hear it from our parents and students" section stays hidden until at least one video is added.

### Option A: YouTube (recommended)
1. Upload the video to YouTube. "Unlisted" is fine if you don't want it on the channel.
2. Open `js/testimonials.js` and add a block inside the `[ ]`:

```js
window.TESTIMONIALS = [
  { youtube: "https://youtu.be/VIDEO_ID",
    name: "Asif's mother", detail: "12th CBSE",
    quote: "His Physics marks went from failing to 94%." },
];
```

3. Commit and push. The site updates within a minute or two.

Shorts links (`youtube.com/shorts/...`) show as tall phone-style cards, and normal YouTube links show as wide cards.

### Option B: video file
1. Put the file in `videos/`, for example `videos/jazeel.mp4`. Keep files short and small. GitHub rejects files over 100 MB, and big files make the page slow on mobile data.
2. Optionally add a cover image, for example `videos/jazeel.jpg`.
3. Add it to `js/testimonials.js`:

```js
  { video: "videos/jazeel.mp4", poster: "videos/jazeel.jpg",
    name: "Jazeel", detail: "10th Grade", quote: "From failing to 90%+." },
```

Separate blocks with a comma. Videos appear in the order they're listed. To remove one, delete its block.

## Other common edits
- **Phone numbers and WhatsApp:** search `index.html` for `7907041628`. The demo form's WhatsApp number is `WHATSAPP_NUMBER` at the top of `js/main.js`.
- **Student photos:** replace the file in `images/students/` with the same name, using a square image.
- **"Why parents choose us" images:** custom illustrations made for this site, stored in `images/why/` (1200×675). The progress report and group chat show example data only. To replace one, use a landscape image with the same file name.
- **Text:** edit `index.html` directly. Each section is marked with a comment like `<!-- ============ RESULTS -->`.
