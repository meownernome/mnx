import { Link } from 'react-router-dom';
import { ASSETS, DISCORD_URL, GAMEMODES } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <img src={ASSETS.logo} alt="HarvalMC" className="h-8 w-auto mb-3" />
            <p className="text-sm text-[#71718e] leading-relaxed max-w-xs">
              Minecraft PvP tier rankings. Compete across every major gamemode and prove your skill.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Pages</h4>
            <ul className="space-y-1.5">
              {[
                { to: '/rankings', label: 'Rankings' },
                { to: '/gamemodes', label: 'Gamemodes' },
                { to: '/compare', label: 'Compare' },
                { to: '/staff', label: 'Staff' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[#71718e] hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Gamemodes</h4>
            <ul className="space-y-1.5">
              {GAMEMODES.slice(0, 6).map((gm) => (
                <li key={gm.id}>
                  <Link to={`/gamemodes/${gm.id}`} className="text-sm text-[#71718e] hover:text-white transition-colors">{gm.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Community</h4>
            <ul className="space-y-1.5">
              <li>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-[#71718e] hover:text-white transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#555]">© 2026 HarvalMC. Not affiliated with Mojang or Microsoft.</p>
        </div>
      </div>
    </footer>
  );
}
