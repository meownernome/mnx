import { useState } from 'react';
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
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={20} className="text-yellow-500" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-[#71718e]">Tester and admin tools. Login required.</p>
      </div>

      <div className="card-base rounded-xl p-4 mb-5 flex items-center gap-3 border border-yellow-500/20">
        <div className="text-yellow-500">
          <Lock size={16} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">Staff Access Required</div>
          <div className="text-xs text-[#71718e]">Log in to submit results and manage tiers.</div>
        </div>
        <a href="/login" className="px-3 py-1.5 rounded-lg bg-yellow-500/15 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/25 transition-colors border border-yellow-500/30">
          Login
        </a>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              tab === t.id ? 'bg-white/[0.08] text-white' : 'text-[#71718e] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'match' && (
        <div className="card-base rounded-xl p-5 space-y-4">
          <h2 className="font-display font-bold text-base text-white">Submit Match Result</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
            <Send size={14} /> Submit Match
          </button>
        </div>
      )}

      {tab === 'tier' && (
        <div className="card-base rounded-xl p-5 space-y-4">
          <h2 className="font-display font-bold text-base text-white">Assign / Update Tier</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors">
            <Crown size={14} /> Assign Tier
          </button>
        </div>
      )}

      {tab === 'players' && (
        <div className="space-y-1.5">
          {players.slice(0, 30).map((p) => (
            <div key={p.id} className="card-base rounded-lg px-4 py-3 flex items-center gap-3">
              <img src={p.avatar || `https://mc-heads.net/avatar/${p.username}/40`} alt="" className="w-8 h-8 rounded-lg" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{p.username}</div>
                <div className="text-xs text-[#71718e]">{Object.keys(getPlayerGamemodes(p)).length} tiers · {p.totalPoints || p.points || 0} pts</div>
              </div>
              <span className="text-xs font-display font-bold text-indigo-400">{p.tier}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'gamemodes' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GAMEMODES.map((gm) => (
            <div key={gm.id} className="card-base rounded-xl p-4 flex items-center gap-3">
              <img src={gm.icon} alt="" width={22} height={22} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{gm.label}</div>
                <div className="text-xs text-[#71718e]">{players.filter((p) => getPlayerGamemodes(p)[gm.id]).length} ranked</div>
              </div>
              <button className="text-[10px] px-2 py-1 rounded text-[#555] hover:text-white hover:bg-white/[0.06] transition-colors">Edit</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'news' && (
        <div className="card-base rounded-xl p-5 space-y-4">
          <h2 className="font-display font-bold text-base text-white">Post Announcement</h2>
          <Field label="Title"><input className="input-base" placeholder="Announcement title" /></Field>
          <Field label="Body"><textarea className="input-base min-h-24" placeholder="Write your announcement..." /></Field>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500">
            <Send size={14} /> Publish
          </button>
        </div>
      )}

      <style>{`
        .input-base { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(17,19,31,0.8); border: 1px solid rgba(255,255,255,0.06); color: white; font-size: 0.875rem; outline: none; }
        .input-base:focus { border-color: rgba(91,108,246,0.4); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-[#555] font-semibold mb-1">{label}</label>
      {children}
    </div>
  );
}
