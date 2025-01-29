export interface Database {
  public: {
    Tables: {
      releases: {
        Row: {
          id: number
          title: string
          artists: string[]
          labels: {
            name: string
            catno: string
          }[]
          styles: string[]
          year: string | null
          country: string | null
          notes: string | null
          condition: string
          price: number
          primary_image: string
          secondary_image: string | null
          videos: {
            url: string
            title: string
          }[] | null
          needs_audio: boolean
          tracklist: {
            position: string
            title: string
            duration: string
          }[]
          created_at: string
          updated_at: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          alias: string
          preferred_language: 'es-CL' | 'en-US'
          created_at: string
          last_active: string
          expires_at: string
        }
      }
      reservations: {
        Row: {
          id: string
          release_id: number
          user_session_id: string
          status: 'in_cart' | 'reserved' | 'in_queue' | 'expired' | 'sold' | 'cancelled'
          position_in_queue: number | null
          reserved_at: string
          expires_at: string | null
        }
      }
    }
  }
}