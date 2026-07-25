import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { ASSETS, DISCORD_URL, SERVER_IP, GAMEMODES } from '@/lib/config';

const DiscordIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative z-10 mt-20 border-t border-indigo-500/15 bg-[#0d0e1a]/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={ASSETS.logo} alt="HarvalMC" className="h-12 w-auto mb-4" />
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The definitive competitive Minecraft PvP tier-ranking platform. Climb the ranks, prove your skill, and etch your name into HarvalMC history.
            </p>
            <button
              onClick={copyIP}
              className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/60 transition-all group"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">Server IP</span>
              </span>
              <span className="font-heading font-bold text-white text-sm">{SERVER_IP}</span>
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-muted-foreground group-hover:text-white" />}
            </button>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">Navigate</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/rankings', label: 'Overall Rankings' },
                { to: '/gamemodes', label: 'Gamemodes' },
                { to: '/compare', label: 'Compare Players' },
                { to: '/staff', label: 'Staff Team' },
                { to: '/news', label: 'News' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gamemodes */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">Gamemodes</h4>
            <ul className="space-y-2">
              {GAMEMODES.slice(0, 6).map((gm) => (
                <li key={gm.id}>
                  <Link to={`/gamemodes/${gm.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors">
                    <img src={gm.icon} alt="" width={14} height={14} /> {gm.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 HarvalMC. All rights reserved. Not affiliated with Mojang or Microsoft.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <DiscordIcon size={18} /> discord.gg/SsA5sajj6S
          </a>
        </div>
      </div>
    </footer>
  );
}