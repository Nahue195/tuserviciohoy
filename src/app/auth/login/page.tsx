'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { TshButton } from '@/components/ui/TshButton';
import { TshIcon } from '@/components/ui/TshIcon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('email', { email, callbackUrl: '/dashboard', redirect: false });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] bg-paper rounded-3xl p-8 border border-[#EFE5D0] shadow-[0_8px_32px_rgba(60,40,20,0.08)]">
        <div className="text-center mb-7">
          <div className="font-serif font-medium text-[28px] text-ink tracking-[-0.5px]">
            Tu<span className="text-terra italic">Servicio</span>Hoy
          </div>
          <div className="font-sans text-sm text-[#8B7D6B] mt-2">
            Ingresá para reservar o gestionar tu agenda
          </div>
        </div>

        {sent ? (
          <div className="text-center py-5">
            <div className="w-16 h-16 rounded-full bg-[#E3EFE8] mx-auto mb-4 flex items-center justify-center">
              <TshIcon name="msg" size={28} color="#0F6E4E"/>
            </div>
            <div className="font-serif text-xl text-ink mb-2">Revisá tu email</div>
            <div className="font-sans text-sm text-[#5C5048] leading-relaxed">
              Te enviamos un link mágico a <strong>{email}</strong>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full py-3.5 px-5 rounded-xl border-[1.5px] border-[#E5D9C2] bg-paper cursor-pointer flex items-center justify-center gap-3 font-sans text-[15px] font-semibold text-ink mb-5 hover:border-terra transition-colors"
            >
              <svg width={20} height={20} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#EFE5D0]"/>
              <span className="font-sans text-xs text-[#8B7D6B]">o</span>
              <div className="flex-1 h-px bg-[#EFE5D0]"/>
            </div>

            <form onSubmit={handleEmail}>
              <label className="block font-sans text-xs text-[#8B7D6B] uppercase tracking-[0.6px] font-bold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-[#E5D9C2] bg-paper font-sans text-[15px] text-ink outline-none mb-4 focus:border-terra transition-colors"
              />
              <TshButton type="submit" variant="primary" size="lg" full disabled={loading}>
                {loading ? 'Enviando…' : 'Recibir link mágico'}
              </TshButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
