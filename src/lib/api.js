// HarvalMC — API helpers
import { API_BASE, TIER_ORDER } from './config';

export async function fetchPlayers() {
  const res = await fetch(`${API_BASE}/players`);
  if (!res.ok) throw new Error('Failed to fetch players');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchPlayer(username) {
  const res = await fetch(`${API_BASE}/players/${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error('Player not found');
  return res.json();
}

export async function fetchStaff() {
  try {
    const res = await fetch(`${API_BASE}/staff`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

// Parse player's gamemode data from stats + roles
export function getPlayerGamemodes(player) {
  const gamemodes = {};
  if (player.stats && typeof player.stats === 'object') {
    for (const [mode, data] of Object.entries(player.stats)) {
      if (data && data.tier) {
        gamemodes[mode.toLowerCase()] = {
          tier: data.tier,
          points: data.points || 0,
          rank: data.rank || 0,
        };
      }
    }
  }
  if (player.roles) {
    for (const role of player.roles) {
      const match = String(role).match(/◆\s*(\w+)\s*•\s*(HT\d|LT\d|Unranked)/i);
      if (match) {
        const mode = match[1].toLowerCase();
        const tier = match[2].toUpperCase();
        if (!gamemodes[mode]) {
          gamemodes[mode] = { tier, points: 0, rank: 0 };
        }
      }
    }
  }
  return gamemodes;
}

export function getBestTier(player) {
  const gamemodes = getPlayerGamemodes(player);
  let best = null;
  let bestRank = 99;
  for (const gm of Object.values(gamemodes)) {
    const tierRank = TIER_ORDER.indexOf(gm.tier);
    if (tierRank >= 0 && tierRank < bestRank) {
      bestRank = tierRank;
      best = gm.tier;
    }
  }
  return best || player.tier || 'Unranked';
}

export function countTiers(player) {
  return Object.keys(getPlayerGamemodes(player)).length;
}

export function rankPlayers(players) {
  return [...players].sort((a, b) => (b.totalPoints || b.points || 0) - (a.totalPoints || a.points || 0));
}

export function getAvatarUrl(username, size = 100) {
  return `https://mc-heads.net/avatar/${encodeURIComponent(username)}/${size}`;
}

export function getBodyUrl(username, size = 200) {
  return `https://mc-heads.net/body/${encodeURIComponent(username)}/${size}`;
}

export function getHeadUrl(username, size = 100) {
  return `https://mc-heads.net/head/${encodeURIComponent(username)}/${size}`;
}

export function getSkin3dUrl(username) {
  return `https://mc-heads.net/body/${encodeURIComponent(username)}/300`;
}