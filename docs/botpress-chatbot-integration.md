# Botpress Chatbot Integration — Technical Analysis

## Overview

This document outlines how to integrate a free AI chatbot into the Fadzyll portfolio website using **Botpress Cloud** (free tier). The chatbot will allow visitors to ask questions about Fadzil's skills, projects, career, and availability.

---

## Why Botpress?

| Feature | Botpress Free | Tidio Free | Crisp Free |
|---|---|---|---|
| AI-powered | Yes | No | No |
| Messages/month | 2,000 | Limited | Unlimited (live only) |
| Custom knowledge base | Yes | No | No |
| No backend required | Yes | Yes | Yes |
| Branding on free tier | Yes (small) | Yes | Yes |

Botpress is the best fit because it supports a **custom knowledge base** — you can feed it your bio, projects, and career info so it gives accurate answers about you specifically.

---

## Free Tier Limits

- **2,000 messages/month** — sufficient for a portfolio site
- **1 bot** — enough for this use case
- **Botpress branding** shown on the widget
- No credit card required

---

## Implementation Plan

### Step 1 — Create a Botpress Account

1. Go to [botpress.com](https://botpress.com) and sign up for free
2. Click **Create Bot**
3. Name it something like `Fadzyll Portfolio Bot`
4. Choose **Start from scratch**

---

### Step 2 — Set Up the Knowledge Base

This is what makes the bot actually useful. In Botpress:

1. Go to your bot → **Knowledge Base**
2. Click **Add Content** → **Text**
3. Add the following information blocks:

**About Fadzil:**
```
Fadzil Bin Ismail is a final year Software Engineering student at Universiti Malaysia Sabah (UMS). 
He is currently doing his internship at ST Advisory in Kota Kinabalu as a Software Engineer & 
Database Administrator Intern. He is from Tuaran, Sabah, Malaysia.
```

**Education:**
```
Fadzil is studying Bachelor of Computer Science (Software Engineering) at UMS. 
His current CGPA is 3.52 and he has been on the Dean's List 5 times. His best semester GPA is 3.67.
He previously studied at Labuan Matriculation College (CGPA 3.46) and SM St John, Tuaran.
```

**Projects:**
```
Fadzil has built the following projects:
1. eKAFA PIUMS — A web-based school management system for KAFA schools. Built with PHP, Yii2 MVC, JavaScript, MySQL. This was his Final Year Project (FYP). Private repo.
2. Kindergarten Management App — A mobile app for managing student data, attendance and payments. Built with Kotlin, Jetpack Compose, Room Database, MVVM, Material 3.
3. CGPA Calculator — A web app for Malaysian university students to calculate their GPA and CGPA. Built with Astro, JavaScript, TypeScript, CSS. Live at cgpa-calculator-unimy.vercel.app.
```

**Skills:**
```
Languages: Java, C++, Python, PHP, JavaScript, TypeScript, Kotlin, Ruby, HTML, CSS, SCSS
Frameworks: Ruby on Rails, Ionic Angular, Quasar Vue, Capacitor, Yii2 MVC, Jetpack Compose, Astro
Tools: Docker, Git, GitHub, MySQL, PostgreSQL, Figma, Android Studio
```

**Contact & Availability:**
```
Fadzil is open to internship opportunities, freelance projects, and collaborations.
You can reach him at fadzzf8@gmail.com or connect on LinkedIn at linkedin.com/in/fadzilismail/.
He is also on GitHub at github.com/Fadzyll.
```

---

### Step 3 — Configure the Bot Personality

In Botpress → **Agent** → **Personality**, set:

```
You are a helpful assistant on Fadzil Bin Ismail's personal portfolio website. 
Your job is to help visitors learn about Fadzil — his skills, projects, education, 
and how to contact him. Be friendly, concise, and professional. 
If you don't know the answer, direct visitors to contact Fadzil directly at fadzzf8@gmail.com.
```

---

### Step 4 — Get the Embed Script

1. In Botpress → **Integrations** → **Webchat**
2. Click **Configure**
3. Customize the widget:
   - **Bot name:** Fadzyll Assistant
   - **Bot avatar:** Upload a profile photo or use the F favicon
   - **Color:** `#38bdf8` (matches the site accent color)
4. Click **Share** → **Embed** tab
5. Copy the embed script — it looks like this:

```html
<script src="https://cdn.botpress.cloud/webchat/v2/inject.js"></script>
<script src="https://mediafiles.botpress.cloud/YOUR_BOT_ID/webchat/v2/config.js"></script>
```

---

### Step 5 — Add to the Astro Site

In `src/components/BaseHead.astro`, add the embed script before the closing `</head>` equivalent (or in the Layout):

```astro
<!-- Botpress Chatbot -->
<script src="https://cdn.botpress.cloud/webchat/v2/inject.js" is:inline></script>
<script src="https://mediafiles.botpress.cloud/YOUR_BOT_ID/webchat/v2/config.js" is:inline></script>
```

Replace `YOUR_BOT_ID` with the actual ID from your Botpress dashboard.

> **Note:** Use `is:inline` so Astro doesn't process these scripts and they load as-is.

---

### Step 6 — Style the Widget (Optional)

To position the widget so it doesn't overlap the back-to-top button, add this to `global.css`:

```css
/* Push Botpress widget above the back-to-top button */
#bp-web-widget-container {
  bottom: 5em !important;
  right: 1.5em !important;
}
```

---

## File Changes Summary

| File | Change |
|---|---|
| `src/components/BaseHead.astro` | Add Botpress embed scripts |
| `src/styles/global.css` | Optional: reposition widget |

---

## Testing Checklist

- [ ] Bot responds to "Who is Fadzil?"
- [ ] Bot responds to "What projects has he built?"
- [ ] Bot responds to "What are his skills?"
- [ ] Bot responds to "How can I contact him?"
- [ ] Bot responds to "Is he open to work?"
- [ ] Widget appears correctly on mobile
- [ ] Widget doesn't overlap other UI elements
- [ ] Dark and light mode — widget still visible

---

## When to Upgrade

If the site gets more traffic and hits the 2,000 message/month limit, the next option is:
- **Botpress Team plan** — paid, higher limits
- **Switch to Gemini API** — free 1,500 req/day, but requires a Vercel serverless function to hide the API key

---

## Resources

- Botpress Dashboard: [app.botpress.cloud](https://app.botpress.cloud)
- Botpress Docs: [botpress.com/docs](https://botpress.com/docs)
- Webchat Embed Guide: [botpress.com/docs/webchat](https://botpress.com/docs/webchat)
