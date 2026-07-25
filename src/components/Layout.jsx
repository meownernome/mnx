import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StarfieldBackground from './StarfieldBackground';

export default function Layout() {
  return (
    <div className="min-h-screen bg-obsidian scanline-bg flex flex-col">
      <StarfieldBackground count={70} />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}