import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ASSETS, DISCORD_URL } from '@/lib/config';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/gamemodes', label: 'Gamemodes' },
  { to: '/compare', label: 'Compare' },
  { to: '/staff', label: 'Staff' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0b16]/90 backdrop-blur border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={ASSETS.logo} alt="HarvalMC" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-[#71718e] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-md text-sm font-medium bg-[#5865F2]/10 text-[#8B9BFF] hover:bg-[#5865F2]/20 transition-colors"
            >
              Discord
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[#71718e] hover:text-white">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0b16]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive(link.to)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-[#71718e] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 rounded-md text-sm font-medium text-[#8B9BFF]"
            >
              Discord
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
