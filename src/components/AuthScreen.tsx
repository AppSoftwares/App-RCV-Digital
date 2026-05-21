import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

export const AuthScreen: React.FC<{ onLogin: (user: UserProfile) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });
        if (signInError) throw signInError;

        if (data.user) {
          onLogin({
            id: data.user.id,
            nombre: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'Usuario',
            email: data.user.email || '',
            role: (data.user.user_metadata?.role as UserRole) || 'cliente',
            status: 'active'
          });
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            data: {
              username: username,
              role: 'cliente'
            },
          },
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          alert('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    // Simulación de Google Auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-mesh">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 mb-4">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">RCV Digital</h2>
          <p className="text-slate-500 text-sm font-medium italic mt-1">
            {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta de grado empresarial'}
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">Usuario</p>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-primary outline-none transition-all uppercase"
                  placeholder="NOMBRE DE USUARIO"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">Email</p>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-primary outline-none transition-all uppercase"
                placeholder="CORREO@EJEMPLO.COM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">Contraseña</p>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-primary outline-none transition-all uppercase"
                placeholder="********"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarse'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-slate-700">
          <div className="h-px bg-white/5 flex-1"></div>
          <span className="text-[10px] font-bold uppercase">O continuar con</span>
          <div className="h-px bg-white/5 flex-1"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <Chrome size={18} />
          Google / Gmail
        </button>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};