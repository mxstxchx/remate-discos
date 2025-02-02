import { createClient } from '@supabase/supabase-js';
import useSessionStore from '@/stores/session';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const adminForceExpireReservation = async (
  reservationId: string,
  reason?: string
) => {
  console.log('[APP] Admin force expire:', { reservationId, reason });
  const { alias } = useSessionStore.getState();

  try {
    const { data, error } = await supabase
      .rpc('admin_force_expire_reservation', {
        p_reservation_id: reservationId,
        p_admin_alias: alias,
        p_reason: reason
      });

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('[APP] Admin operation failed:', error);
    throw error;
  }
};

export const adminMarkAsSold = async (
  reservationId: string,
  reason?: string
) => {
  console.log('[APP] Admin mark as sold:', { reservationId, reason });
  const { alias } = useSessionStore.getState();

  try {
    const { data, error } = await supabase
      .rpc('admin_mark_as_sold', {
        p_reservation_id: reservationId,
        p_admin_alias: alias,
        p_reason: reason
      });

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('[APP] Admin operation failed:', error);
    throw error;
  }
};