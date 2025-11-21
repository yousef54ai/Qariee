# Qariee MVP - TODO List

## High Priority - Core Features

### 1. Reciter Detail Screen
- [ ] Create reciter detail screen with surah list
- [ ] Display reciter name and image at top
- [ ] Show all 114 surahs in scrollable list
- [ ] Add tap handler to play selected surah
- [ ] Show download status for each surah
- [ ] Navigate to this screen when reciter card is tapped

### 2. Audio Playback Integration
- [ ] Integrate expo-audio for playback
- [ ] Implement play/pause functionality
- [ ] Add next/previous track controls
- [ ] Handle audio streaming from R2
- [ ] Implement background playback
- [ ] Add notification controls (media session)
- [ ] Handle audio focus and interruptions

### 3. Full Player Screen
- [ ] Create full player modal/screen
- [ ] Large reciter image display
- [ ] Surah name in Arabic and English
- [ ] Playback progress slider
- [ ] Current time and duration display
- [ ] Play/pause and skip controls
- [ ] Download button in player
- [ ] Swipe down to minimize gesture

### 4. Download Functionality
- [ ] Implement surah download with expo-file-system
- [ ] Show download progress indicator
- [ ] Save downloaded files to local storage
- [ ] Update database with download status
- [ ] Handle download errors and retries
- [ ] Allow downloads during playback
- [ ] Calculate and display storage used

### 5. Offline Mode
- [ ] Detect network connectivity
- [ ] Show offline indicator in UI
- [ ] Disable streaming when offline
- [ ] Only show downloaded content when offline
- [ ] Cache reciter images for offline use

## Medium Priority - Polish & UX

### 6. Loading States
- [ ] Add skeleton loaders for reciter grid
- [ ] Add loading states for audio buffering
- [ ] Show download progress animations
- [ ] Add shimmer effects for better UX

### 7. Error Handling
- [ ] Handle network errors gracefully
- [ ] Show retry options for failed operations
- [ ] Display offline mode indicators
- [ ] Handle corrupted download files
- [ ] Add error boundaries for crashes

### 8. Mini Player Enhancements
- [ ] Connect mini player to actual audio playback
- [ ] Update progress bar in real-time
- [ ] Show correct play/pause state
- [ ] Display current surah and reciter
- [ ] Add swipe gestures for skip

### 9. Update Banner Improvements
- [ ] Add app store link to update button
- [ ] Handle different update scenarios (optional vs mandatory)
- [ ] Persist dismissed state (don't show again for this version)
- [ ] Test version comparison logic

## Low Priority - Future Enhancements

### 10. Performance Optimization
- [ ] Optimize reciter grid rendering
- [ ] Implement image caching
- [ ] Lazy load surah lists
- [ ] Reduce app bundle size
- [ ] Optimize database queries

### 11. Accessibility
- [ ] Add screen reader support
- [ ] Ensure proper focus management
- [ ] Add accessibility labels
- [ ] Support dynamic font sizes

### 12. Analytics & Monitoring
- [ ] Add crash reporting (Sentry?)
- [ ] Track key user actions
- [ ] Monitor download success rates
- [ ] Track playback errors
- [ ] Monitor app performance

### 13. Testing
- [ ] Add unit tests for utility functions
- [ ] Test version comparison logic
- [ ] Test database operations
- [ ] Test audio playback functionality
- [ ] Integration tests for key flows

## Content & Data

### 14. Audio Content
- [ ] Source high-quality MP3 files for 3 reciters
- [ ] Ensure all 114 surahs per reciter
- [ ] Optimize file sizes (128-192 kbps)
- [ ] Upload all audio files to R2
- [ ] Verify CDN access and streaming

### 15. Images & Assets
- [ ] Get professional reciter photos
- [ ] Optimize image sizes
- [ ] Create app icon
- [ ] Create splash screen
- [ ] Add placeholder images

## Known Issues

### Bugs to Fix
- [ ] None currently - add as discovered

### Technical Debt
- [ ] Separate AudioContext into dedicated AppContext
- [ ] Add proper TypeScript types for all components
- [ ] Refactor dataSync to separate concerns
- [ ] Add JSDoc comments for public functions

## Completed ✅

### Infrastructure
- [x] Project setup with Expo
- [x] TypeScript configuration
- [x] SQLite database setup
- [x] Background data sync
- [x] i18n setup (English/Arabic)
- [x] Safe area handling

### UI Components
- [x] Home screen with reciter grid
- [x] Mini player component
- [x] Update banner component
- [x] Loading screen

### Features
- [x] Reciter metadata sync
- [x] Color extraction from images
- [x] Version checking
- [x] Update notifications
- [x] Remote configuration (db.json)
- [x] CDN failover support

---

**Last Updated:** 2025-11-21

**Current Sprint:** Core Features (Playback & Downloads)

**Next Milestone:** Functional MVP with playback and downloads
