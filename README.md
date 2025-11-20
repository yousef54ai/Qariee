# Qariee

## Forks

This section documents major architectural and infrastructure decisions made during development.

### Storage Solution: Cloudflare R2

**Decision Date:** 2025-11-20

**Chosen Solution:** Cloudflare R2 Object Storage

**Rationale:**
- Storage cost: $0.015/GB/month (~$4.35/month for 300GB)
- Zero egress fees (unlimited free downloads)
- Built-in global CDN for fast downloads
- 10 million free read operations/month
- Scales cost-effectively if traffic explodes
- Protection against surprise bills during viral growth

**Alternatives Considered:**
- **Backblaze B2:** Cheaper at low traffic ($1.80 vs $4.35) but egress costs after 3x storage limit
- **Wasabi:** Good for 1TB+ ($6.99/month) but has 1TB minimum
- **AWS S3:** Most expensive due to egress fees ($0.09/GB)

**Key Advantage:** Predictable costs with unlimited download potential. If the app goes viral, costs remain manageable (~$35-70/month for 1B downloads) vs thousands on other providers.

---

## Project Overview

**Qariee** is a Spotify-style Quran streaming and offline listening app for Android, built with React Native. The app provides a modern, clean interface for discovering Quran reciters (Qaris) and listening to recitations with seamless streaming and offline download capabilities.

**Vision:** "Spotify for Quran"

**Target Platform:** Android (React Native)

**Languages:** English and Arabic with i18n support

---

## Forks - App Design & Architecture

### Platform & Technology

**Decision Date:** 2025-11-20

**Platform:** Android-first with React Native

**Key Technology Decisions:**
- React Native for cross-platform foundation
- Offline-first architecture (major feature)
- Stream-first with integrated downloads
- i18n support for English and Arabic

**Rationale:**
- React Native allows future iOS expansion
- Offline downloads are critical for Quran apps (commutes, travel, data limits)
- Stream-first UX reduces friction (instant playback)

---

### MVP Scope

**Core Features (Minimal but Polished):**

1. **Reciter Library** - Browse 5-10 featured Quran reciters
2. **Surah Streaming** - Instant playback of all 114 surahs per reciter
3. **Persistent Audio Player** - Bottom mini-player + expandable full player
4. **Offline Downloads** - Download surahs for offline listening, integrated with player
5. **Downloaded Library** - Access all offline content

**Explicitly NOT in MVP:**
- User accounts / authentication
- Favorites / bookmarks
- Search functionality
- Playlists
- Translations / Tafsir
- Sleep timer / speed control
- Social features
- Repeat modes
- Continue listening / resume

---

### User Flows

#### Flow 1: First Time User - Discovery & Streaming
```
1. Open App
   ↓
2. Home Screen: Grid of Reciters
   - 2-column grid with reciter photos
   ↓
3. Tap Reciter (e.g., "Mishary Rashid")
   ↓
4. Surah List Screen
   - Header: Reciter photo + name
   - List: 114 surahs with download indicators
   ↓
5. Tap Surah (e.g., "Al-Baqarah")
   ↓
6. ✨ Streams immediately
   - Bottom mini-player appears
   - Background playback enabled
   ↓
7. Tap mini-player → Expands to full player
```

#### Flow 2: Downloading for Offline
```
1. Playing surah (streaming)
   ↓
2. Tap download icon in player or surah list
   ↓
3. Download starts with progress indicator
   - Listening continues during download
   ↓
4. Download completes → Checkmark indicator
   ↓
5. Surah now available offline
   - Next playback uses local file
```

#### Flow 3: Offline Listening
```
1. No internet connection
   ↓
2. Open app → Navigate to Library tab
   ↓
3. See all downloaded surahs grouped by reciter
   ↓
4. Tap to play → Plays from local storage
   ↓
5. Seamless experience (identical to streaming)
```

---

### Navigation Structure

#### Bottom Tab Navigation (2 Tabs)

**Tab 1: Home 🏠**
- Grid of all reciters
- Primary discovery interface

**Tab 2: Library 📥**
- Downloaded content organized by reciter
- Storage usage indicator
- Quick access to offline surahs

#### Screen Stack
```
Home Stack:
  ├─ Reciter Grid (Home)
  └─ Surah List (Reciter Detail)

Library Stack:
  └─ Downloaded Content

Modal/Overlay:
  └─ Full Player Screen (slides up from mini-player)
```

#### Mini Player (Persistent)
- Appears at bottom when playback starts
- Visible across all screens
- Tap or swipe up to expand to full player
- Swipe down to minimize from full player

---

### Design System

#### Visual Style
- **Aesthetic:** Clean, modern, Spotify-inspired
- **Theme:** Dark theme (MVP), light theme support later
- **Photos:** Smooth rounded corners (no hard edges), blended modern look
- **Typography:** Clean, readable, supports Arabic and Latin scripts

#### Component Design Decisions

**Reciter Cards (Home Screen):**
- 2-column grid on mobile
- Square aspect ratio with rounded corners (16-24px radius)
- Reciter photo with subtle shadow/elevation
- Name and surah count below

**Surah List Items:**
- Row layout: [Number] [Arabic Name / Transliteration] [Download Icon] [Duration]
- 72px height per item
- Tap row → play, tap download icon → download
- Visual indicator for download status

**Mini Player:**
- Fixed at bottom, above navigation tabs
- Shows: small reciter image, surah name, play/pause, skip controls
- Progress bar
- Swipe up or tap to expand

**Full Player:**
- Large reciter image (rounded corners)
- Surah name in Arabic and transliteration
- Reciter name
- Playback controls (previous, play/pause, next)
- Scrubber with timestamps
- Download button integrated
- Swipe down or back button to minimize

**Download State Indicators:**
- Not downloaded: Outline download icon
- Downloading: Circular progress (0-100%)
- Downloaded: Filled checkmark (success color)

#### Micro-interactions
- Card press: Subtle scale animation
- Player transitions: Smooth slide animations (300ms)
- Download progress: Animated circular indicator
- Play/Pause: Icon morph animation
- Haptic feedback on key interactions

#### Gestures
- Mini player: Swipe up to expand, swipe left/right to skip
- Full player: Swipe down to minimize, swipe left/right to skip
- Surah list: Tap to play, long press for options (future)

---

### Technical Architecture

**Frontend:**
- React Native
- React Navigation (stack + bottom tabs)
- React Native Track Player (audio playback)
- i18n for internationalization

**Local Storage:**
- SQLite for metadata (reciters, surahs, download status)
- React Native FileSystem for audio files
- AsyncStorage for app preferences

**Remote Storage:**
- Cloudflare R2 for audio file hosting
- Free egress/CDN for streaming

**Audio Strategy:**
- Stream-first (instant playback)
- Progressive download to local storage
- Format: MP3 (128-192 kbps)
- Background playback support
- Notification controls

---

### Data Architecture

**Decision Date:** 2025-11-20

#### Background Update Strategy

**First Launch:**
- App fetches metadata from R2
- Populates local SQLite database
- Shows loading screen during initial setup
- Bundles static surah metadata (never changes)

**Subsequent Launches:**
- App starts instantly using cached SQLite data
- Home screen appears immediately (no loading)
- Metadata updates silently in background
- No interruption to user experience

**Rationale:**
- Instant app startup after first launch
- No "checking for updates" delays
- Offline-first approach
- Seamless user experience
- Data stays fresh without user awareness

#### R2 Storage Structure

```
qariee-audio/                    (R2 Bucket)
├── metadata/
│   └── reciters.json            (Reciter list - updated as needed)
│
├── audio/
│   ├── mishary-alafasy/
│   │   ├── 001.mp3              (Al-Fatihah)
│   │   ├── 002.mp3              (Al-Baqarah)
│   │   └── ... (all 114 surahs)
│   ├── abdul-basit/
│   └── sudais/
│
└── images/
    └── reciters/
        ├── mishary-alafasy.jpg
        ├── abdul-basit.jpg
        └── sudais.jpg
```

**Naming Convention:**
- Reciter IDs: kebab-case (e.g., `mishary-alafasy`, `abdul-basit`)
- Audio files: 3-digit zero-padded (e.g., `001.mp3`, `002.mp3`, `114.mp3`)
- Consistent structure across all reciters

#### Data Structure

**reciters.json** (Remote - minimal structure):
- Reciter ID (used to construct all URLs)
- Name in English
- Name in Arabic
- No redundant data (photos/audio URLs derived from ID)

**surahs.json** (Bundled in app - static):
- Surah number (1-114)
- Arabic name
- English name
- Verse count

#### URL Construction

All URLs constructed from reciter ID:
- Photo: `https://cdn.qariee.com/images/reciters/{reciter-id}.jpg`
- Audio: `https://cdn.qariee.com/audio/{reciter-id}/{surah-number}.mp3`
- Single CDN base URL configured in app

**Benefits:**
- Minimal JSON payload
- Single source of truth for CDN URL
- Easy to migrate CDN providers
- No URL redundancy in data

#### SQLite Schema

**Reciters Table:**
- ID (primary key)
- Name (English and Arabic)

**Surahs Table:**
- Number (1-114)
- Name (English and Arabic)
- Verse count

**Downloads Table:**
- Reciter ID + Surah number (composite key)
- Local file path
- Download timestamp

**App Metadata:**
- Key-value store for app state
- First launch flag
- User preferences

#### Content Management

**Adding New Reciters:**
1. Prepare complete reciter folder (all 114 surahs required)
2. Upload audio files to R2: `/audio/{reciter-id}/001.mp3` through `114.mp3`
3. Upload reciter photo to R2: `/images/reciters/{reciter-id}.jpg`
4. Update `reciters.json` with new entry
5. Users receive update on next app launch automatically

**Rules:**
- Only complete reciters (all 114 surahs) are added
- No partial collections
- Ensures consistent experience across all reciters

---

## Getting Started

[Setup instructions coming soon...]
