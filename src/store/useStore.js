import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  transactions: [],
  theme: localStorage.getItem('vc-theme') || 'dark',

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setTransactions: (transactions) => set({ transactions }),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vc-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
    set({ theme: next });
  },

  initTheme: () => {
    const t = get().theme;
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.classList.toggle('light', t === 'light');
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      set({ profile: data });
      return data;
    }
    return null;
  },

  fetchTransactions: async (limit = 5) => {
    const { user, profile } = get();
    const uid = user?.id;
    if (!uid) return;

    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (profile?.role !== 'admin') {
      query = query.eq('user_id', uid);
    }

    const { data, error } = await query;
    if (!error && data) set({ transactions: data });
  },

  fetchAllTransactions: async (limit = 50) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (!error && data) set({ transactions: data });
  },

  optimisticDeductBalance: (userId, amount) => {
    const pointsEarned = Math.max(1, Math.floor(amount * 0.05));
    const { profile } = get();
    if (profile && profile.id === userId) {
      set({
        profile: {
          ...profile,
          vector_balance: profile.vector_balance - amount,
          vector_points: profile.vector_points + pointsEarned,
        },
      });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, transactions: [], loading: false });
  },

  initAuth: () => {
    get().initTheme();

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      set({ user, loading: false });
      if (user) get().fetchProfile();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      set({ user });
      if (user) {
        get().fetchProfile();
      } else {
        set({ profile: null, transactions: [] });
      }

      // Clear the URL hash if it contains an access token to prevent stale session loop warnings
      if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription?.unsubscribe();
  },
}));

export default useStore;
