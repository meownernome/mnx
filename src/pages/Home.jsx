import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trophy, TrendingUp, Users, Gamepad2, ArrowRight, Copy, Check } from 'lucide-react';
import { fetchPlayers, rankPlayers, getPlayerGamemodes } from '@/lib/api';
import { ASSETS, SERVER_IP, GAMEMODES, DISCORD_URL } from '@/lib/config';
import TopPlayerCard from '@/components/TopPlayerCard';

export default function Home() {
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [copied, setCopied] = useState(false);

  const ranked = useMemo(() => rankPlayers(players), [players]);
  const topPlayers = ranked.slice(0, 5);
  const mostImproved = useMemo(
    () => [...players].sort((a, b) => (b.weeklyPoints || 0) - (a.weeklyPoints || 0)).slice(0, 5),
    [players]
  );
  const totalPlayers = players.length;
  const totalRanked = players.filter((p) => (p.totalPoints || p.points) > 0).length;
  const mostActiveMode = useMemo(() => {
    const counts = {};
    players.forEach((p) => {
      const gms = getPlayerGamemodes(p);
      Object.keys(gms).forEach((m) => { counts[m] = (counts[m] || 0) + 1; });
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'sword';
  }, [players]);
  const activeLabel = GAMEMODES.find((g) => g.id === mostActiveMode)?.label || 'Sword';

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img src={ASSETS.banner} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b16]/70 via-[#0a0b16]/90 to-[#0a0b16]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-16 sm:pt-20 sm:pb-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <img src={ASSETS.logo} alt="HarvalMC" className="h-16 sm:h-20 mx-auto mb-4" />
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-3 leading-tight">
              Minecraft PvP<br />Tier Rankings
            </h1>
            <p className="text-[#71718e] text-base sm:text-lg mb-6 leading-relaxed">
              Compete, climb, and claim your rank across every major PvP gamemode.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/rankings" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                View Rankings <ArrowRight size={16} />
              </Link>
              <button onClick={copyIP} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.1] text-sm font-medium text-white hover:bg-white/[0.05] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {SERVER_IP}
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-[#555]" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-7 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: 'Players', value: totalPlayers, color: '#5B6CF6' },
            { icon: Trophy, label: 'Ranked', value: totalRanked, color: '#FFD700' },
            { icon: TrendingUp, label: 'Top Mode', text: activeLabel, color: '#00E676' },
            { icon: Gamepad2, label: 'Gamemodes', value: GAMEMODES.length, color: '#BF5FFF' },
          ].map((stat) => (
            <div key={stat.label} className="card-base rounded-xl p-4 text-center">
              <div className="text-2xl font-display font-bold text-white">
                {stat.value !== undefined ? stat.value : stat.text}
              </div>
              <div className="text-xs text-[#71718e] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" /> Top Players
          </h2>
          <Link to="/rankings" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-[#71718e] text-sm">Loading...</div>
          ) : topPlayers.length > 0 ? (
            topPlayers.map((p, i) => <TopPlayerCard key={p.id} player={p} rank={i + 1} />)
          ) : (
            <div className="col-span-full text-center py-12 text-[#71718e] text-sm">No ranked players yet.</div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-10">
        <h2 className="font-display font-bold text-xl text-white mb-5">Gamemodes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GAMEMODES.map((gm) => (
            <Link
              key={gm.id}
              to={`/gamemodes/${gm.id}`}
              className="card-base rounded-xl p-4 flex items-center gap-3 hover:card-hover transition-all group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${gm.color}15` }}>
                <img src={gm.icon} alt="" width={18} height={18} />
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{gm.label}</div>
                <div className="text-xs text-[#71718e]">Leaderboard →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {mostImproved.filter((p) => (p.weeklyPoints || 0) > 0).length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pt-10">
          <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" /> Rising Players
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {mostImproved.filter((p) => (p.weeklyPoints || 0) > 0).slice(0, 5).map((p) => (
              <Link key={p.id} to={`/player/${encodeURIComponent(p.username)}`} className="block group">
                <div className="card-base rounded-xl p-4 text-center group-hover:card-hover transition-all">
                  <img src={`https://mc-heads.net/avatar/${p.username}/100`} alt="" className="w-12 h-12 rounded-lg mx-auto mb-2" />
                  <div className="font-heading font-bold text-sm text-white truncate">{p.username}</div>
                  <div className="text-xs text-green-500 font-semibold">+{p.weeklyPoints || 0} this week</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="block">
          <div className="card-base rounded-xl p-8 text-center hover:card-hover transition-all border-[#5865F2]/20">
            <h2 className="font-display font-bold text-xl text-white mb-2">Join the Community</h2>
            <p className="text-sm text-[#71718e] mb-4">Connect with competitors and stay in the loop.</p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752C4] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
              Join Discord
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}
