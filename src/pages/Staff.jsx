import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Shield, Crown, Swords, Eye, Star, Globe } from 'lucide-react';
import { fetchStaff, fetchPlayers, getAvatarUrl } from '@/lib/api';

const ROLES = [
  { key: 'admin', label: 'Administrators', icon: Crown, color: '#FFD700', desc: 'Full access to all systems' },
  { key: 'tester', label: 'Tier Testers', icon: Swords, color: '#5B6CF6', desc: 'Conducts tier tests and assigns ranks' },
  { key: 'moderator', label: 'Moderators', icon: Shield, color: '#00E676', desc: 'Keeps the community in check' },
  { key: 'viewer', label: 'Viewers', icon: Eye, color: '#9E9E9E', desc: 'Read-only staff access' },
];

export default function Staff() {
  const { data: staff = null, isLoading } = useQuery({ queryKey: ['staff'], queryFn: fetchStaff });
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });

  // Derive staff from API or fallback: find players with roles or staff-like indicators
  const staffList = staff && staff.length > 0
    ? staff
    : players.filter((p) => {
        const roles = (p.roles || []).join(' ').toLowerCase();
        return roles.includes('admin') || roles.includes('tester') || roles.includes('mod') || roles.includes('staff');
      }).map((p) => ({
        username: p.username,
        avatar: p.avatar,
        role: (p.roles || []).find((r) => /admin|tester|mod/i.test(r)) || 'Staff',
        title: p.roles?.[0] || '',
        region: p.region,
      }));

  const getRoleKey = (roleStr) => {
    const r = (roleStr || '').toLowerCase();
    if (r.includes('admin')) return 'admin';
    if (r.includes('tester')) return 'tester';
    if (r.includes('mod')) return 'moderator';
    return 'viewer';
  };

  const grouped = ROLES.map((roleDef) => ({
    ...roleDef,
    members: staffList.filter((s) => getRoleKey(s.role) === roleDef.key),
  })).filter((g) => g.members.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-2">The Team</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The dedicated staff behind HarvalMC's tier testing and rankings. Each member helps keep the competitive scene fair and thriving.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Loading staff...</div>
      ) : grouped.length > 0 ? (
        <div className="space-y-10">
          {grouped.map((group, gi) => (
            <motion.div key={group.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${group.color}15`, border: `1px solid ${group.color}44` }}>
                  <group.icon size={20} style={{ color: group.color }} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl" style={{ color: group.color }}>{group.label}</h2>
                  <p className="text-sm text-muted-foreground">{group.desc}</p>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full glass text-sm font-heading font-semibold text-muted-foreground">
                  {group.members.length}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.members.map((member, i) => (
                  <motion.div
                    key={member.username + i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: gi * 0.1 + i * 0.05 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className="glass rounded-2xl p-5 text-center relative overflow-hidden group transition-all"
                    style={{ borderColor: `${group.color}22` }}
                  >
                    {/* Glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${group.color}15, transparent 70%)` }}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ boxShadow: `0 0 24px ${group.color}40, inset 0 0 12px ${group.color}10` }}
                    />

                    <div className="relative z-10">
                      {/* Avatar */}
                      <div className="relative inline-block mb-3">
                        <img
                          src={member.avatar || getAvatarUrl(member.username, 120)}
                          alt={member.username}
                          className="w-20 h-20 rounded-2xl border-2"
                          style={{ borderColor: `${group.color}44` }}
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#0d0e1a]"
                          style={{ background: group.color }}
                        >
                          <group.icon size={14} className="text-[#0d0e1a]" />
                        </div>
                      </div>

                      <h3 className="font-heading font-bold text-white text-lg truncate">{member.username}</h3>
                      {/* Role badge */}
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2 text-xs font-display font-bold uppercase tracking-wider"
                        style={{ background: `${group.color}15`, border: `1px solid ${group.color}44`, color: group.color }}
                      >
                        {member.role || group.label.replace(/s$/, '')}
                      </div>
                      {/* Title */}
                      {member.title && (
                        <p className="text-xs text-muted-foreground mt-2 truncate">{member.title}</p>
                      )}
                      {member.region && member.region !== 'all' && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Globe size={12} /> {member.region}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl">
          <Star className="mx-auto text-muted-foreground mb-4" size={48} />
          <h2 className="font-display font-bold text-xl text-white mb-2">Staff Coming Soon</h2>
          <p className="text-muted-foreground">Our team is being assembled. Check back shortly!</p>
        </div>
      )}
    </div>
  );
}