# Desk Calendar 2027 · Project context

A handover brief for anyone (or any AI assistant) picking up this project. Last updated November 2026.

---

## 1. What this is

Sim is a photographer based in Malaysia who has made a **2027 desk calendar from their own travel and city photographs**. This repository is the **one-page website that introduces the calendar and takes orders**, plus a page that generates the **Instagram graphics** used to promote it.

## 2. Intention and motivation

- **A passion project, not a business.** Sim is opening it up to friends, not trying to profit from them. Sim explicitly does **not** want to come across as earning money from friends. Pricing is set to roughly cover costs, and the tone must never feel like a sales pitch or a cash grab.
- **The audience is friends.** About 95% of visitors come from Sim's personal Instagram (stories and posts); about 5% are referrals. About 95% are on phones, many inside Instagram's in-app browser. Some friends live abroad.
- **The main goal is to WOW friends.** They already know Sim's photography is good, so the site and calendar should feel high-end, polished and beautiful. Taking orders comes second.
- **Brand feel:** luxury, restrained, editorial. References Sim gave: bang-olufsen.com, rolls-roycemotorcars.com, porsche.com (911 Carrera 4S page), audemarspiguet.com (Code 11.59 page), md-product.com (MD desk calendar).
- **Tone of copy:** warm, understated, first person. Sim dislikes "cringe" taglines (for example "Twelve months, planned. Twelve places, framed." was rejected). The hero carries a tiny byline Sim asked for: **"designed by Sim :D"**.

## 3. The product

- **Format:** desk calendar on a fold-out stand, **wire-bound along the top**.
- **Size:** A5 pages, **148 × 210 mm**; **148 × 220 mm** including the wire binding.
- **Printed on both sides.** On each sheet, the **planner page faces the owner** and the **month's photograph faces the room**: it's on the back of the previous sheet. The website's 3D model and animations are built around this.
- **Cover:** the numerals "2027" filled with the steel roof of King's Cross station (London). Sim calls it the "King's Cross" cover.
- **12 photo pages**, one per month: sequences, colour studies and collages from Lijiang, Kutná Hora, Kuala Lumpur, Hallstatt, Prague, London, Český Krumlov and Dresden. They're listed in `assets/js/content.js`.
- **Planner page** (one per month): Sunday-start grid, holidays printed on the day, week numbers, small calendars of the previous and next month, to-do list and notes.
- **Personalisation** (see pricing): holiday sets, plus up to 10 custom events printed like holidays but in a **different colour and icon**. The exact colour and icon aren't decided yet; the Instagram graphic uses a teal heart as a placeholder.
- **Printing:** Sim has a quote from Taobao of about **15 CNY per copy**. China-to-Malaysia delivery is extra, and customs fees may apply. An earlier assumption was about RM 30 per copy; the Taobao quote makes the margin healthier.
- **Expected volume:** about **20–40 copies**.

## 4. Pricing and offer (current)

| | |
|---|---|
| **Standard** | **RM 39**. Holidays for one country: Malaysia, Singapore or the UK. |
| **Personalised** | **RM 49**. Any mix of holidays (Malaysia by state, e.g. Selangor + KL + Sabah + Sarawak + Kedah, plus Singapore and/or UK), plus **up to 10 custom events** (birthdays, anniversaries, pets…). The character limit is set in the order form. |
| **Two copies** | **RM 10 off the total** (RM 5 per copy). Standard and personalised can be mixed. |
| **Delivery** | **Free anywhere in Malaysia.** Outside Malaysia: postage discussed separately ("message me about postage"). |
| **Deadline** | **Order by 30 November**, delivered in **December**. |

All of this lives in one place: `assets/js/content.js` (`PRICE`, `OPTIONS`, `DEAL`, `WHEN`, `DELIVERY`). Designs 3 and 4 read it from there.

## 5. The website (current state)

**Tech:** plain HTML/CSS/JS, no build step, no framework. It is currently hosted on **GitHub Pages** at `https://hunneesim.github.io/2027-Calendar-Site/` from the branch `claude/fervent-einstein-qejek2` of `hunneesim/2027-Calendar-Site`. Fonts are self-hosted (Inter Tight, Cormorant Garamond, Caveat for handwriting).

**Four designs** are linked by a review tab bar at the top of each page. **Remove the tab bar before launch.**

| File | Design | Status |
|---|---|---|
| `index.html` | 1 · Paper | Older; price updated to "From RM 39" only |
| `design-2.html` | 2 · Noir | Older; price updated to "From RM 39" only |
| `design-3.html` | **3 · Studio** | **Front-runner.** Sim chose it first and loved its **exploded 3D view**. |
| `design-4.html` | **4 · Flip** | **Front-runner.** Built from advisor feedback. |

**Design 3 (Studio)**
1. Pinned 3D hero: the calendar comes apart into layers (an exploded view with numbered labels), goes back together, the cover flips over the binding to the January planner, then the calendar turns round to show January's photo. Story-style progress bars sit at the top.
2. A dark gallery of the 12 photos, tinted by each photo's colour. Swipe to browse, tap one to open it full screen.
3. A swipeable planner tour that zooms into each feature.
4. A note in Sim's voice, details, then the order section.

**Design 4 (Flip)**
1. Opening: 12 photo pages on a dark light table gather into a stack, which becomes the calendar seen from behind, then turns round to show the planner.
2. A planner tour with handwriting that writes itself.
3. "Flip through the year": a 13-sheet double-sided 3D calendar you drag or tap to turn, month by month.
4. Note, details, order.

**Shared files**
- `assets/js/motion.js`: scroll engine. Measured against a 100svh probe so Safari's toolbar doesn't cause jumps; optional smoothing.
- `Calendar3D`: CSS 3D desk calendar with flip, explode, lazy images.
- `PlannerTour`: the planner zoom camera.
- `assets/js/site.js`: nav colours, tint fades, story bars, full-screen photo viewer, planner section, order section.
- `assets/css/site.css`: the design system (type scale, spacing, tokens).
- `assets/css/calendar3d.css`: the 3D model's styles.
- `assets/js/content.js`: all content (prices, pages, alt text, order link).

**Instagram graphics:** `stories.html` generates **7 graphics in 2 sizes**: Stories 1080×1920 and feed posts 1080×1350. The seven are Cover, Two sides, What's inside, Twelve months, Taken apart (exploded view), Details, and Make it yours (personalisation). Images are embedded so it works offline. Stories say "Tap the link to order"; posts say "Link in bio". All say "from RM 39 · Free delivery within Malaysia".

**Quality bar already applied:**
- Mobile-first; smooth (60 fps, transform/opacity only).
- Tested at iPhone SE to desktop, plus landscape and iPad.
- Reduced motion supported; keyboard accessible; content still visible without JavaScript.
- Contrast-checked colours.
- Not yet tested on a real iPhone or inside Instagram's browser.

## 6. Plans and next steps

1. **Pick Design 3 or 4.** Make it `index.html` and remove the review tabs. If Design 4 is picked, consider adding Design 3's exploded view to it.
2. **Order form** (planned, not built). Build a custom, on-brand form on the site, not a Google Form:
   - It saves each order to **a Google Sheet via Google Apps Script** (a `doPost` web app).
   - Personalised orders pick holidays by tapping (MY states / SG / UK) and get "+ add a date" rows (max 10) with a character counter.
   - A live price total applies the RM 10 two-copy discount.
   - The confirmation page shows an **order number** (e.g. `CAL-027`), the total, and DuitNow/bank details.
   - An **automatic email** goes to the buyer and to Sim (Apps Script MailApp/GmailApp).
   - A **"Message Sim on WhatsApp"** button (`wa.me` link with a pre-filled message) lets the buyer send a payment screenshot.
   - **No payment gateway.** Sim matches payments to order numbers by hand in the bank app (fine for 20–40 orders).
   - Automated WhatsApp messages were ruled out (they need the Business API; unofficial bots are risky).
   - Still needed from Sim: the Gmail account, WhatsApp number, DuitNow/bank details, the buyer fields to collect (name, WhatsApp, IG handle, address…), and the custom-event character limit.
   - A fallback if the custom form is too much: Tally.so, which is prettier than Google Forms.
3. **Hosting:** move to the subdomain **`calendar.hansim.vip`**. It's still GitHub Pages: add a `CNAME` file, a DNS CNAME `calendar → hunneesim.github.io`, and enforce HTTPS. Then update the absolute `og:url`, `og:image` and `canonical` URLs in Designs 3 and 4.
4. **Email on the domain:** the free route was chosen.
   - **Receiving:** email forwarding (Cloudflare Email Routing if DNS is on Cloudflare, otherwise ImprovMX) to Sim's Gmail.
   - **Sending:** Gmail "Send mail as" (smtp.gmail.com, app password, 2-step verification).
   - Desired address: **`HantNhing@hansim.vip`**, possibly also `orders@hansim.vip`.
   - First step: an NS lookup on `hansim.vip` to see where DNS is hosted (not yet done).
   - Add SPF and DMARC records for deliverability.

## 7. Open items and things to verify

- **ORDER_URL** in `content.js` is empty. Until the order flow exists, the button shows "Orders open soon…". Don't promote the link until ordering works.
- **The note in Sim's voice is a draft.** Sim should rewrite it.
- **Holidays:**
  - Thaipusam is shown on 22 Jan 2027; confirm against the official Malaysian 2027 list.
  - UK holidays differ between England & Wales, Scotland and Northern Ireland; ask which in the order form.
- **Artwork ratio:** the page artwork was made at 1632×2112 px (US Letter ratio), but the print is A5 (1:1.41), so it needs re-laying out for A5 before printing.
- **Print a proof first.** Several photo pages are dark (Library, Charles Bridge, Hallstatt at blue hour).
- **The 12 photo pages are the recommended set** from an earlier page-picker, not a confirmed final selection. The small city line printed on the cover mentions Vienna and Oxford, which aren't in the current 12; check it.
- **Personalised event style:** the actual colour and icon aren't decided yet. The "Make it yours" graphic uses a placeholder.
- **Designs 1 and 2** weren't fully updated for the new pricing; they only show "From RM 39".

## 8. Where things came from

- The 30 candidate page designs and 5 cover options were made in an earlier Claude session from Sim's photos. They're in a claude.ai artifact called **"2027 Page Picker"**. Source photos are on Sim's Windows PC in OneDrive, folder **"calendar project 2027"**.
- Two rounds of AI "advisor" reviews shaped Designs 3 and 4 (UI/UX, luxury brand, performance, QA/accessibility, creative tech, launch/pricing). Their findings are reflected in the current code.

## 9. How Sim likes to work

- Honest, factual answers without sugar-coating or confirmation bias.
- Ask clarifying questions when something is ambiguous, but don't stall. When Sim says "just proceed", make sensible calls and report them.
- Mobile-first, ultra smooth, intuitive: progress mainly by scrolling; swipe for optional browsing, with an easy way to skip.
- Values seeing real screenshots of the result.
