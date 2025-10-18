import React, { useState, useEffect } from 'react';
import { Plus, Menu, X, BarChart3, Users, DollarSign, Activity, Calendar, Settings, Trash2, GripVertical, User, Home, FileText, Briefcase, TrendingUp } from 'lucide-react';

const ComponentLibrary = {
  stats: { icon: BarChart3, name: 'Stats Card', color: 'bg-blue-500' },
  users: { icon: Users, name: 'Users', color: 'bg-purple-500' },
  revenue: { icon: DollarSign, name: 'Revenue', color: 'bg-green-500' },
  activity: { icon: Activity, name: 'Activity', color: 'bg-orange-500' },
  calendar: { icon: Calendar, name: 'Calendar', color: 'bg-pink-500' },
  settings: { icon: Settings, name: 'Settings', color: 'bg-gray-500' }
};

const screens = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'projects', name: 'Projects', icon: Briefcase }
];

const DashboardComponent = ({ component, onRemove, index }) => {
  const { icon: Icon, name, color } = ComponentLibrary[component.type];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`${color} p-2 rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
            <p className="text-xs text-gray-500">Component {index + 1}</p>
          </div>
        </div>
        <button
          onClick={() => onRemove(component.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} w-3/4`}></div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-semibold text-gray-700">75%</span>
        </div>
      </div>
    </div>
  );
};

const ComponentModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Add Components</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ComponentLibrary).map(([key, { icon: Icon, name, color }]) => (
              <button
                key={key}
                onClick={() => onAdd(key)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group"
              >
                <div className={`${color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MobileDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [components, setComponents] = useState([]);
  const [draggedOver, setDraggedOver] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const addComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type
    };
    setComponents([...components, newComponent]);
    setModalOpen(false);
  };

  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    
    if (dragIndex !== dropIndex) {
      const newComponents = [...components];
      const [draggedItem] = newComponents.splice(dragIndex, 1);
      newComponents.splice(dropIndex, 0, draggedItem);
      setComponents(newComponents);
    }
    setDraggedOver(null);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">{formatTime()}</div>
          <div className="text-xs text-gray-500">{formatDate()}</div>
        </div>
        
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden flex flex-col`}
        >
          <div className="p-4 w-64 flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Screens</h2>
            <div className="space-y-1 flex-1">
              {screens.map((screen) => {
                const Icon = screen.icon;
                return (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(screen.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeScreen === screen.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{screen.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Component
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Clean Connect</h1>
            <p className="text-sm text-gray-500">Welcome Sarah</p>
          </div>
          
          {components.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Empty Dashboard</h3>
                <p className="text-sm text-gray-500 mb-4">Add components to get started</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Open Components
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {components.map((component, index) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`cursor-move transition-all ${
                    draggedOver === index ? 'scale-105' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <DashboardComponent
                        component={component}
                        onRemove={removeComponent}
                        index={index}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ComponentModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addComponent}
      />
    </div>
  );
}