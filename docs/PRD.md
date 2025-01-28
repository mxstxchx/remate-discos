# Vinyl Marketplace - PRD

## Overview
Web application for browsing and reserving vinyl records from a personal collection. Features a streamlined browse interface with dynamic filtering and alias-based reservations in a shopping cart.

## Language Support
- Primary: Spanish (Chile) - es-CL
- Secondary: English (United States) - en-US

## Core Features

### 1. Browse Interface

Main Layout:
- 75/25 split with filter sidebar
- Responsive grid for releases
- Filter cards at top menu
- Session management modal
- Cart management modal

[Previous filter components content...]

### 2. Release Display

Browse View:
[Previous content...]

### 3. Cart & Reservations
Cart Page Layout:
[Previous content...]

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
  created_at: Date
  last_active: Date
  preferred_language: 'es-CL' | 'en-US'
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
```

[Rest of the document...]