import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Season 1 Rankings Now Live',
    date: '2026-07-24',
    excerpt: 'The first official HarvalMC PvP tier rankings are live. Testers have evaluated initial placements across all 8 gamemodes.',
    category: 'Announcement',
    color: '#FFD700',
  },
  {
    id: 2,
    title: 'New Tier Testing Season Begins',
    date: '2026-07-23',
    excerpt: 'Players can now request tier tests via our Discord. Our tester team is ready to evaluate your skill in Sword, Pot, UHC, Axe, and more.',
    category: 'Update',
    color: '#5B6CF6',
  },
  {
    id: 3,
    title: 'Crystal PvP Added to Rankings',
    date: '2026-07-20',
    excerpt: 'By popular demand, Crystal PvP has joined the gamemode roster. Get tested and claim your tier today.',
    category: 'New Gamemode',
    color: '#BF5FFF',
  },
  {
    id: 4,
    title: 'Weekly Leaderboard Reset',
    date: '2026-07-15',
    excerpt: 'Weekly points have been reset. Climb the "Most Improved" rankings by earning points this week!',
    category: 'Schedule',
    color: '#00E676',
  },
];

export default function News() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Newspaper size={22} className="text-indigo-400" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">News</h1>
        </div>
        <p className="text-sm text-[#71718e]">Stay up to date with the latest from HarvalMC.</p>
      </div>

      <div className="space-y-3">
        {NEWS_ITEMS.map((item) => (
          <div key={item.id} className="card-base rounded-xl p-5 hover:card-hover transition-all cursor-pointer">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#555]">
                  <Calendar size={11} /> {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
            <h2 className="font-display font-bold text-lg text-white mb-1">{item.title}</h2>
            <p className="text-sm text-[#71718e] leading-relaxed">{item.excerpt}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-indigo-400">
              Read more <ArrowRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
