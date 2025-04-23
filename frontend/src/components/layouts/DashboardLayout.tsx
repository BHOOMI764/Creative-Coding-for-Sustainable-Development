import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  GraduationCap, 
  Home, 
  Users, 
  Layers, 
  Settings, 
  BarChart2, 
  LogOut, 
  ChevronDown, 
  Bell, 
  Search, 
  Menu, 
  X 
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard/viewer', icon: <Home size={20} />, label: 'Project Gallery', roles: ['viewer', 'student', 'faculty', 'admin', 'management'] },
    { path: '/dashboard/student', icon: <Layers size={20} />, label: 'My Projects', roles: ['student', 'faculty', 'admin', 'management'] },
    { path: '/dashboard/faculty', icon: <Users size={20} />, label: 'Student Reviews', roles: ['faculty', 'admin', 'management'] },
    { path: '/dashboard/admin', icon: <Settings size={20} />, label: 'Administration', roles: ['admin', 'management'] },
    { path: '/dashboard/management', icon: <BarChart2 size={20} />, label: 'Analytics', roles: ['management'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">CreativeCodingHub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none relative"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>
            
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-1"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center uppercase">
                {user.firstName ? user.firstName[0] : user.username[0]}
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Desktop Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out z-20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}>
          <div className="p-4 border-b lg:flex items-center space-x-2 hidden">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">CreativeCodingHub</span>
          </div>
          
          <div className="py-4">
            <div className="px-4 mb-6">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 text-sm
                      ${location.pathname === item.path 
                        ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto pb-10">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white shadow-sm py-3 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {filteredNavItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none relative"
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      3
                    </span>
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border">
                      <div className="px-4 py-2 border-b">
                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 hover:bg-gray-50 border-b">
                          <p className="text-sm text-gray-800 font-medium">New feedback received</p>
                          <p className="text-xs text-gray-500">On project "AI Image Generator" - 10 minutes ago</p>
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-50 border-b">
                          <p className="text-sm text-gray-800 font-medium">Project approved</p>
                          <p className="text-xs text-gray-500">Your project "Data Visualization" was approved - 2 hours ago</p>
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-50">
                          <p className="text-sm text-gray-800 font-medium">SDG mapping updated</p>
                          <p className="text-xs text-gray-500">Faculty updated SDG mapping for your project - 1 day ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center uppercase">
                      {user.firstName ? user.firstName[0] : user.username[0]}
                    </div>
                    <div className="text-sm text-left">
                      <p className="font-medium text-gray-800">{user.firstName || user.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;