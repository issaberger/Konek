import { NavLink } from 'react-router-dom';
import { Camera, History, User, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const navItems = [
    { to: '/solver', icon: Camera, label: 'Kamera' },
    { to: '/history', icon: History, label: 'Istwa' },
    { to: '/leaderboard', icon: Trophy, label: 'Klasman' },
    { to: '/profile', icon: User, label: 'Pwofil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                isActive ? "text-[#FF6321]" : "text-gray-500 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-6 h-6" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
