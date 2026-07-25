import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Trophy, TrendingUp, Users, Gamepad2, ArrowRight, Sparkles, Check, Copy } from 'lucide-react';
import { fetchPlayers, rankPlayers, getPlayerGamemodes } from '@/lib/api';
import { ASSETS, SERVER_IP, GAMEMODES, DISCORD_URL } from '@/lib/config';
import SearchBar from '@/components/SearchBar';
import TopPlayerCard from '@/components/TopPlayerCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import GamemodeIcon from '@/components/GamemodeIcon';

export default function Home() {
  const { data: players = [], isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  });

  const [search, setSearch] = useState('');
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

  const suggestions = search
    ? players.filter((p) => p.username.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={ASSETS.banner} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b16]/60 via-[#0a0b16]/85 to-[#0a0b16]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-xs font-heading font-semibold tracking-wider text-indigo-300 uppercase">
                Minecraft PvP Tier Rankings
              </span>
            </div>

            <img src={ASSETS.logo} alt="HarvalMC" className="h-20 sm:h-28 mx-auto mb-6 animate-float" />

            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-4 leading-tight">
              RISE THROUGH<br />
              <span className="gradient-text">THE TIERS</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Compete, climb, and claim your rank across every major Minecraft PvP combat gamemode. 
              Your skill, ranked and proven.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search any player..."
                suggestions={suggestions}
                onSuggestionClick={(p) => (window.location.href = `/player/${encodeURIComponent(p.username)}`)}
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/rankings"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-heading font-bold text-lg hover:scale-105 transition-transform glow-blue"
              >
                View Rankings <ArrowRight size={20} />
              </Link>
              <button
                onClick={copyIP}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-purple-900/40 border border-purple-500/40 text-white font-heading font-bold text-lg hover:border-purple-500/70 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                {SERVER_IP}
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pixel ground strip */}
        <div className="pixel-ground h-2 relative z-10" />
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Players', value: totalPlayers, color: '#5B6CF6' },
            { icon: Trophy, label: 'Ranked Players', value: totalRanked, color: '#FFD700' },
            { icon: TrendingUp, label: 'Most Active Mode', text: GAMEMODES.find((g) => g.id === mostActiveMode)?.label || 'Sword', color: '#00E676' },
            { icon: Gamepad2, label: 'Gamemodes', value: GAMEMODES.length, color: '#BF5FFF' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all"
            >
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ background: stat.color }}
              />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}44` }}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div className="font-display font-black text-2xl sm:text-3xl text-white">
                  {stat.value !== undefined ? <AnimatedCounter value={stat.value} /> : stat.text}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-heading mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOP PLAYERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white flex items-center gap-3">
            <Trophy className="text-yellow-400" /> Top Ranked
          </h2>
          <Link to="/rankings" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-heading font-semibold">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">Loading rankings...</div>
          ) : topPlayers.length > 0 ? (
            topPlayers.map((p, i) => <TopPlayerCard key={p.id} player={p} rank={i + 1} index={i} />)
          ) : (
            <div className="col-span-full text-center py-12 glass rounded-2xl text-muted-foreground">No ranked players yet.</div>
          )}
        </div>
      </section>

      {/* GAMEMODES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-6">Gamemodes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {GAMEMODES.map((gm, i) => (
            <motion.div
              key={gm.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/gamemodes/${gm.id}`}
                className="block glass rounded-2xl p-5 hover:glass-strong hover:scale-105 transition-all group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gm.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex items-center gap-4">
                  <GamemodeIcon gamemodeId={gm.id} size={36} />
                  <div>
                    <div className="font-heading font-bold text-white text-lg">{gm.label}</div>
                    <div className="text-xs text-muted-foreground">View Leaderboard</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MOST IMPROVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-6 flex items-center gap-3">
          <TrendingUp className="text-green-400" /> Most Improved This Week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {mostImproved.filter((p) => (p.weeklyPoints || 0) > 0).slice(0, 5).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/player/${encodeURIComponent(p.username)}`}>
                <div className="glass rounded-2xl p-4 text-center hover:glass-strong hover:border-green-500/40 transition-all">
                  <img src={`https://mc-heads.net/avatar/${p.username}/100`} alt="" className="w-16 h-16 rounded-xl mx-auto mb-3 border border-green-500/20" />
                  <div className="font-heading font-bold text-white truncate">{p.username}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="font-display font-bold text-green-400">+{p.weeklyPoints || 0}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DISCORD CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="block">
          <div className="glass-strong rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden hover:border-[#5865F2]/50 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/10 to-purple-600/10 opacity-50" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">Join the Community</h2>
              <p className="text-muted-foreground mb-6">Connect with fellow competitors, get rank-up notifications, and stay in the loop.</p>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#5865F2] text-white font-heading font-bold text-lg group-hover:scale-105 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                Join Discord
              </div>
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}