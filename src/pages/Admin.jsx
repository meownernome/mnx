import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ShieldPlus, Users, Gamepad2, FileText, Send, Lock, Crown } from 'lucide-react';
import { fetchPlayers, getPlayerGamemodes } from '@/lib/api';
import { GAMEMODES, TIER_ORDER } from '@/lib/config';

export default function Admin() {
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const [tab, setTab] = useState('match');
  const [form, setForm] = useState({ player1: '', player2: '', gamemode: 'sword', winner: 'player1', date: new Date().toISOString().split('T')[0] });
  const [tierForm, setTierForm] = useState({ player: '', gamemode: 'sword', tier: 'HT1' });

  const tabs = [
    { id: 'match', label: 'Submit Match', icon: ShieldPlus },
    { id: 'tier', label: 'Assign Tier', icon: Crown },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'gamemodes', label: 'Gamemodes', icon: Gamepad2 },
    { id: 'news', label: 'Announcements', icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="text-yellow-400" size={28} />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Tester and admin tools. Login required.</p>
      </motion.div>

      {/* Login notice */}
      <div className="glass-strong rounded-2xl p-4 mb-6 flex items-center gap-3 border border-yellow-500/20">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
          <Lock size={18} className="text-yellow-400" />
        </div>
        <div>
          <div className="font-heading font-semibold text-white">Staff Access Required</div>
          <div className="text-sm text-muted-foreground">Log in with your staff Discord or email account to submit results and manage tiers.</div>
        </div>
        <a href="/login" className="ml-auto px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-heading font-semibold text-sm hover:bg-yellow-500/30 transition-all">
          Login
        </a>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-indigo-500/20 border border-indigo-500/50 text-white' : 'glass text-muted-foreground hover:text-white'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Match submission */}
      {tab === 'match' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-white mb-4">Submit Match Result</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Player 1">
              <input list="player-list" value={form.player1} onChange={(e) => setForm({ ...form, player1: e.target.value })} className="input-base" placeholder="Username" />
            </Field>
            <Field label="Player 2">
              <input list="player-list" value={form.player2} onChange={(e) => setForm({ ...form, player2: e.target.value })} className="input-base" placeholder="Username" />
            </Field>
            <Field label="Gamemode">
              <select value={form.gamemode} onChange={(e) => setForm({ ...form, gamemode: e.target.value })} className="input-base">
                {GAMEMODES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </Field>
            <Field label="Winner">
              <select value={form.winner} onChange={(e) => setForm({ ...form, winner: e.target.value })} className="input-base">
                <option value="player1">{form.player1 || 'Player 1'}</option>
                <option value="player2">{form.player2 || 'Player 2'}</option>
                <option value="draw">Draw</option>
              </select>
            </Field>
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-base" />
            </Field>
          </div>
          <datalist id="player-list">
            {players.map((p) => <option key={p.id} value={p.username} />)}
          </datalist>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-heading font-semibold hover:bg-indigo-500 transition-colors">
            <Send size={16} /> Submit Match
          </button>
        </motion.div>
      )}

      {/* Tier assignment */}
      {tab === 'tier' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-white mb-4">Assign / Update Tier</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Player">
              <input list="player-list" value={tierForm.player} onChange={(e) => setTierForm({ ...tierForm, player: e.target.value })} className="input-base" placeholder="Username" />
            </Field>
            <Field label="Gamemode">
              <select value={tierForm.gamemode} onChange={(e) => setTierForm({ ...tierForm, gamemode: e.target.value })} className="input-base">
                {GAMEMODES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </Field>
            <Field label="Tier">
              <select value={tierForm.tier} onChange={(e) => setTierForm({ ...tierForm, tier: e.target.value })} className="input-base">
                {TIER_ORDER.filter((t) => t !== 'Unranked').map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-heading font-semibold hover:bg-purple-500 transition-colors">
            <Crown size={16} /> Assign Tier
          </button>
        </motion.div>
      )}

      {/* Players list */}
      {tab === 'players' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {players.slice(0, 30).map((p) => (
            <div key={p.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <img src={p.avatar || `https://mc-heads.net/avatar/${p.username}/40`} alt="" className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <div className="font-heading font-bold text-white">{p.username}</div>
                <div className="text-xs text-muted-foreground">{Object.keys(getPlayerGamemodes(p)).length} tiers • {p.totalPoints || p.points || 0} pts</div>
              </div>
              <span className="text-xs font-display font-bold text-indigo-300">{p.tier}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Gamemodes */}
      {tab === 'gamemodes' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMEMODES.map((gm) => (
            <div key={gm.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <img src={gm.icon} alt="" width={28} height={28} />
              <div className="flex-1">
                <div className="font-heading font-bold text-white">{gm.label}</div>
                <div className="text-xs text-muted-foreground">{players.filter((p) => getPlayerGamemodes(p)[gm.id]).length} ranked</div>
              </div>
              <button className="text-xs px-2 py-1 rounded glass text-muted-foreground hover:text-white">Edit</button>
            </div>
          ))}
        </motion.div>
      )}

      {/* News */}
      {tab === 'news' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-white">Post Announcement</h2>
          <Field label="Title"><input className="input-base" placeholder="Announcement title" /></Field>
          <Field label="Body"><textarea className="input-base min-h-24" placeholder="Write your announcement..." /></Field>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-heading font-semibold hover:bg-indigo-500">
            <Send size={16} /> Publish
          </button>
        </motion.div>
      )}

      <style>{`
        .input-base { width: 100%; padding: 0.625rem 0.75rem; border-radius: 0.75rem; background: rgba(18,20,42,0.8); border: 1px solid rgba(91,108,246,0.2); color: white; font-family: 'Rajdhani', sans-serif; font-weight: 500; outline: none; }
        .input-base:focus { border-color: rgba(91,108,246,0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted-foreground font-heading font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}