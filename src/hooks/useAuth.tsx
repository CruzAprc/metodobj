
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para limpar completamente o estado de autenticação
const cleanupAuthState = () => {
  // Remove todos os dados de autenticação do localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove do sessionStorage também se existir
  try {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Ignora erros se sessionStorage não estiver disponível
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, nome: string, whatsapp: string) => {
    try {
      // Limpar estado antes de cadastrar
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome,
            whatsapp
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        throw error;
      }

      console.log('Cadastro realizado:', data);

      // Create user profile in teste_app table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('teste_app')
          .insert({
            user_id: data.user.id,
            nome,
            whatsapp,
            email
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Erro no signUp:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      
      // Limpar estado antes de fazer login
      cleanupAuthState();
      
      // Tentar logout global antes
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Logout preventivo - ok');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return { error };
      }

      console.log('Login bem-sucedido:', data);
      return { error: null };
    } catch (error) {
      console.error('Erro no signIn:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Fazendo logout...');
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      // Força refresh da página
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, força o refresh
      window.location.href = '/login';
    }
  };

  const forceSignOut = async () => {
    try {
      console.log('Fazendo logout forçado...');
      // Limpa o estado local primeiro
      cleanupAuthState();
      
      // Tenta fazer logout no Supabase
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignora erros do logout
        console.log('Logout forçado - ignorando erros do Supabase');
      }
      
      // Força refresh completo da página
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro no logout forçado:', error);
      // Mesmo com erro, força o refresh
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signOut,
      forceSignOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
