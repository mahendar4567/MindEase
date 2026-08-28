import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between z-50">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <Brain className="w-8 h-8 text-primary" />
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MindEase
        </span>
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors font-medium">
              Dashboard
            </Link>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Hi, <span className="font-semibold text-white">{user.name}</span></span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 border border-slate-600 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-full font-medium transition-all"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
