import { isSupabaseConfigured, supabase } from './supabase';

export const validateSignupEmail = (email = '') => {
  const trimmed = String(email).trim();
  const errors = [];

  if (trimmed.length < 8) errors.push('Email must be at least 8 characters.');
  if (!/\d/.test(trimmed)) errors.push('Email must include at least 1 number.');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmed)) errors.push('Email must include at least 1 special character.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) errors.push('Enter a valid email address.');

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const authService = {
  async signUp(email, password, fullName) {
    if (!isSupabaseConfigured) throw new Error('Authentication is not configured for this local demo.');
    const { isValid, errors } = validateSignupEmail(email);
    if (!isValid) throw new Error(errors.join(' '));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured) throw new Error('Authentication is not configured for this local demo.');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured) return null;
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.user) return null;

    const user = session.user;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // Missing profile row should not collapse auth state.
    if (profileError) {
      return { ...user, profile: null };
    }

    return { ...user, profile: profile || null };
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe() { } } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};
