import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">🎵 오늘 하루, 수고했어</h1>
        <div className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'
              }`
            }
          >
            ✏️ 일기 쓰기
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'
              }`
            }
          >
            📚 기록
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
