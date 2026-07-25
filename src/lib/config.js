const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

// HarvalMC — Site configuration

const RAW_API = import.meta.env.VITE_API || process.env.API || 'https://fuckers.onrender.com';
export const API_BASE = RAW_API.replace(/\/+$/, '') + '/api';

export const ASSETS = {
  logo: '/logo.png',
  banner: '/banner.png',
  favicon: '/favicon.png',
  crest: '/favicon.png',
};

export const ICONS = {
  sword: '/sword.svg',
  pot: '/pot.svg',
  uhc: '/uhc.svg',
  vanilla: '/vanilla.svg',
  axe: '/axe.svg',
  nethop: '/nethop.svg',
  smp: '/smp.svg',
  overall: '/overall.svg',
  mace: '/mace.svg',
};

export const GAMEMODES = [
  { id: 'sword', label: 'Sword', icon: ICONS.sword, color: '#E53935', gradient: 'from-red-600/20 to-red-900/10' },
  { id: 'pot', label: 'Pot PvP', icon: ICONS.pot, color: '#00D4FF', gradient: 'from-cyan-500/20 to-blue-900/10' },
  { id: 'uhc', label: 'UHC', icon: ICONS.uhc, color: '#FFD700', gradient: 'from-yellow-500/20 to-amber-900/10' },
  { id: 'vanilla', label: 'Vanilla', icon: ICONS.vanilla, color: '#4CAF50', gradient: 'from-green-500/20 to-green-900/10' },
  { id: 'axe', label: 'Axe', icon: ICONS.axe, color: '#FF7043', gradient: 'from-orange-500/20 to-red-900/10' },
  { id: 'nethop', label: 'NethPot', icon: ICONS.nethop, color: '#CE93D8', gradient: 'from-purple-400/20 to-purple-900/10' },
  { id: 'smp', label: 'SMP', icon: ICONS.smp, color: '#80DEEA', gradient: 'from-teal-300/20 to-cyan-900/10' },
  { id: 'crystal', label: 'Crystal', icon: ICONS.overall, color: '#E040FB', gradient: 'from-fuchsia-500/20 to-purple-900/10' },
  { id: 'mace', label: 'Mace', icon: ICONS.mace, color: '#7E57C2', gradient: 'from-purple-600/20 to-indigo-900/10' },
];

export const TIER_CONFIG = {
  HT1: { label: 'High Tier 1', short: 'HT1', color: '#FFD700', glow: 'rgba(255,215,0,0.5)', rank: 1, gem: '💎' },
  LT1: { label: 'Low Tier 1', short: 'LT1', color: '#E8E8E8', glow: 'rgba(232,232,232,0.4)', rank: 2, gem: '💠' },
  HT2: { label: 'High Tier 2', short: 'HT2', color: '#5B8FFF', glow: 'rgba(91,143,255,0.5)', rank: 3, gem: '🔷' },
  LT2: { label: 'Low Tier 2', short: 'LT2', color: '#00D4FF', glow: 'rgba(0,212,255,0.4)', rank: 4, gem: '🔵' },
  HT3: { label: 'High Tier 3', short: 'HT3', color: '#00E676', glow: 'rgba(0,230,118,0.4)', rank: 5, gem: '🟢' },
  LT3: { label: 'Low Tier 3', short: 'LT3', color: '#9E9E9E', glow: 'rgba(158,158,158,0.3)', rank: 6, gem: '⚪' },
  Unranked: { label: 'Unranked', short: '—', color: '#555', glow: 'rgba(85,85,85,0.2)', rank: 7, gem: '⚫' },
};

export const TIER_ORDER = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'Unranked'];

export const REGIONS = [
  { id: 'all', label: 'Global', flag: '🌍' },
  { id: 'NA', label: 'North America', flag: '🇺🇸' },
  { id: 'EU', label: 'Europe', flag: '🇪🇺' },
  { id: 'AS', label: 'Asia', flag: '🇯🇵' },
  { id: 'OCE', label: 'Oceania', flag: '🇦🇺' },
  { id: 'SA', label: 'South America', flag: '🇧🇷' },
];

export const DISCORD_URL = 'https://discord.gg/SsA5sajj6S';
export const SERVER_IP = 'play.harvalmc.fun';

export function getGamemode(id) {
  return GAMEMODES.find((g) => g.id === id) || { id, label: id, icon: ICONS.overall, color: '#888' };
}

export function getTierConfig(tier) {
  return TIER_CONFIG[tier] || TIER_CONFIG.Unranked;
}

export const TITLES = [
  { min: 400, label: 'Combat Grandmaster', color: '#FFD700' },
  { min: 250, label: 'Combat Master', color: '#5B8FFF' },
  { min: 200, label: 'Combat Ace', color: '#BF5FFF' },
  { min: 150, label: 'Combat Expert', color: '#00E676' },
  { min: 100, label: 'Combat Veteran', color: '#00D4FF' },
  { min: 50, label: 'Combat Soldier', color: '#E8E8E8' },
  { min: 0, label: 'Combat Rookie', color: '#9E9E9E' },
];

export function getTitle(points) {
  return TITLES.find((t) => points >= t.min) || TITLES[TITLES.length - 1];
}

export function getRegion(id) {
  return REGIONS.find((r) => r.id === id) || REGIONS[0];
}