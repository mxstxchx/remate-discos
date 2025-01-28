# Vinyl Marketplace - PRD

## Overview
Web application for browsing and reserving vinyl records from a personal collection. Features a streamlined browse interface with dynamic filtering and alias-based reservations in a shopping cart.

## Language Support
- Primary: Spanish (Chile) - es-CL
- Secondary: English (United States) - en-US

## Currency
All prices in EUR (€) format.

## Core Features

### 1. Browse Interface

Main Layout:
- 75/25 split with filter sidebar
- Responsive grid for releases
- Filter cards at top menu
- Session management modal
- Cart management modal

Filter Components:
1. Top Filter Cards:
   - Artists card with modal
   - Labels card with modal
   - Styles card with modal
   - Multi-select support
   - Selection counts
   - Clear functionality
   - Search bar for each card with dynamic results

2. Sidebar Filters:
   - Price range slider
      * Dynamic min/max based on results
      * Real-time updates
   - Condition checkboxes
   - Clear filter options
   - Sticky positioning
   - Collapsible filter sections

3. Top Filter Modals:
   - Search functionality
   - Multi-select support
   - Selection preview
   - Apply/Clear buttons

4. Session management modal
    - Initial alias modal on first visit
      * Appears before accessing any content
      * Simple form for alias input
      * 30-day session persistence
      * Language selection (es-CL/en-US)
      * Stores in both localStorage and cookies
    - Session tracking
      * Last active timestamp
      * Reserved items association
      * No authentication required
    - Login and logout capability

5. Cart management modal
    - Small temporary modal for cart additions
    - Sliding expandable/collapsable column modal for cart view

### 2. Release Display

Browse View:
- Independent scrolling columns
  * Left: Sticky filter sidebar (25% width)
  * Right: Scrollable results grid (75% width)
- Responsive design
  * Grid adapts to screen size
  * Mobile-optimized filter view
- Release cards showing:
  * Cover image
  * Title, artists and catno
  * Label details
  * Price and condition
  * Reservation status

Content Sections:
1. Media Section
   - Primary image (high resolution)
   - Secondary image (high resolution)
   - YouTube video embeds
   - Compact video layout
   - Audio player (when required)

2. Information Section
   - Title and artist(s)
   - Label and catalog information
   - Release details (year, country)
   - Condition and price
   - Style tags
   - Tracklist
     * Track numbers
     * Titles
     * Durations
     * Additional info (when available)
   - Notes and additional details

3. Reservation Controls
   - Dynamic CTA button states:
     * "Reserve Now" (available)
     * "In Cart" (in_cart)
     * "Reserved" (reserved)
     * "Join Waitlist" (in_queue)
     * "Sold" (sold)
     * "Expired" (expired)
   - Price display
   - Condition badge
   - Waitlist position (when applicable)
   - Reservation expiration countdown

### 3. Cart & Reservations
Cart Page Layout:
- List of reserved items
- Individual item cards showing:
  * Basic release information
  * Reserved price
  * Expiration countdown
  * Remove option
- Total items and value
- WhatsApp checkout button

Reservation System:
- 7-day hold period
- Automatic queue management
- Email-less waitlist
- Status updates without refresh
- Expiration notifications

### 4. Data Structure

Database Schema:
```typescript
interface Release {
  id: number
  title: string
  artists: string[]          // Flattened array of names
  labels: {
    name: string
    catno: string
  }[]
  styles: string[]           // Flattened array
  year: string
  country: string
  notes: string
  condition: string
  price: number
  primary_image: string      // High resolution main image
  secondary_image: string    // Additional high res image
  images: {
    src: string
    blurDataUrl?: string    // For image optimization
    quality: 'high' | 'low'
  }[]
  videos: {
    url: string
    title: string
  }[]
  needs_audio: boolean
  tracklist: {
    position: string
    title: string
    duration: string
  }[]
}

interface UserSession {
  id: string
  alias: string
  preferred_language: 'es-CL' | 'en-US'
  created_at: Date
  last_active: Date
  expires_at: Date
}

interface Reservation {
  id: string
  release_id: number
  user_session_id: string
  status: 'in_cart' | 'reserved' | 'in_queue' | 'expired' | 'sold' | 'cancelled'
  position_in_queue: number
  reserved_at: Date
  expires_at: Date
}