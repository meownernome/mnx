import { motion } from 'framer-motion';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="text-indigo-400" size={28} />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">News & Announcements</h1>
        </div>
        <p className="text-muted-foreground">Stay up to date with the latest from HarvalMC.</p>
      </motion.div>

      <div className="space-y-5">
        {NEWS_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ x: 4 }}
            className="glass rounded-2xl p-6 hover:glass-strong transition-all relative overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: item.color }}
            />
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}33`, color: item.color }}
                >
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} /> {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 group-hover:gradient-text transition-all">
              {item.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{item.excerpt}</p>
            <div className="flex items-center gap-1 mt-4 text-sm font-heading font-semibold text-indigo-400 group-hover:text-indigo-300">
              Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}