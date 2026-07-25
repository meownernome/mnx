import { useQuery } from '@tanstack/react-query';
import { Shield, Crown, Swords, Eye, Star, Globe } from 'lucide-react';
import { fetchStaff, fetchPlayers, getAvatarUrl } from '@/lib/api';

const ROLES = [
  { key: 'admin', label: 'Administrators', icon: Crown, color: '#FFD700', desc: 'Full access to all systems' },
  { key: 'tester', label: 'Tier Testers', icon: Swords, color: '#5B6CF6', desc: 'Conducts tier tests' },
  { key: 'moderator', label: 'Moderators', icon: Shield, color: '#00E676', desc: 'Keeps the community in check' },
  { key: 'viewer', label: 'Viewers', icon: Eye, color: '#9E9E9E', desc: 'Read-only staff access' },
];

export default function Staff() {
  const { data: staff = null, isLoading } = useQuery({ queryKey: ['staff'], queryFn: fetchStaff });
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });

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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">Staff Team</h1>
        <p className="text-sm text-[#71718e] max-w-xl mx-auto">
          The staff behind HarvalMC's tier testing and rankings.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-sm text-[#71718e]">Loading...</div>
      ) : grouped.length > 0 ? (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${group.color}15`, border: `1px solid ${group.color}30` }}>
                  <group.icon size={16} style={{ color: group.color }} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base" style={{ color: group.color }}>{group.label}</h2>
                  <p className="text-xs text-[#71718e]">{group.desc}</p>
                </div>
                <div className="ml-auto text-xs text-[#555] font-medium">{group.members.length}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {group.members.map((member, i) => (
                  <div key={member.username + i} className="card-base rounded-xl p-4 text-center">
                    <div className="relative inline-block mb-2">
                      <img
                        src={member.avatar || getAvatarUrl(member.username, 120)}
                        alt={member.username}
                        className="w-14 h-14 rounded-xl"
                        style={{ border: `1px solid ${group.color}30` }}
                      />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-white truncate">{member.username}</h3>
                    <div
                      className="inline-flex items-center px-2 py-0.5 rounded mt-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: `${group.color}15`, color: group.color }}
                    >
                      {member.role || group.label.replace(/s$/, '')}
                    </div>
                    {member.region && member.region !== 'all' && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-[#555]">
                        <Globe size={10} /> {member.region}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-base rounded-xl p-12 text-center">
          <Star className="mx-auto text-[#555] mb-3" size={36} />
          <h2 className="font-display font-bold text-lg text-white mb-1">Staff Coming Soon</h2>
          <p className="text-sm text-[#71718e]">Our team is being assembled.</p>
        </div>
      )}
    </div>
  );
}
