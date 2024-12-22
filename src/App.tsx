import { useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import type { Database } from './types/database';
import GrantReviewer from './components/GrantReviewer';
import Auth from './components/Auth';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <GrantReviewer /> : <Auth />}
    </div>
  );
}

export default App;