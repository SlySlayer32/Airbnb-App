import React, { useState } from 'react';
import { User, Home, Users, Calendar, FileText, Wrench, BarChart3, Settings, LogIn, UserPlus, Lock, Eye, Edit, Plus, CheckSquare, Phone, Wifi, MapPin, Clock, AlertTriangle, Star } from 'lucide-react';

const AppMindMap = () => {
  const [activeView, setActiveView] = useState('mindmap');
  const [selectedRole, setSelectedRole] = useState('property_owner');
  const [expandedNode, setExpandedNode] = useState(null);

  const roleColors = {
    property_owner: '#3b82f6',
    cleaner: '#10b981',
    co_host: '#f59e0b'
  };

  const authFlow = {
    entry: 'App Launch',
    paths: [
      {
        condition: 'No User Session',
        destination: 'Login Screen',
        actions: ['Sign In', 'Sign Up', 'Forgot Password']
      },
      {
        condition: 'User Authenticated',
        check: 'Profile.onboarded',
        paths: [
          {
            condition: 'onboarded = false',
            destination: 'Onboarding Flow',
            steps: ['Welcome', 'Manage Properties', 'Coordinate Team', 'Automate Scheduling']
          },
          {
            condition: 'onboarded = true',
            destination: 'Dashboard',
            roleBasedContent: true
          }
        ]
      }
    ]
  };

  const dashboardStructure = {
    property_owner: {
      greeting: 'Good morning, [Name]! Manage your properties',
      components: [
        {
          name: 'Dashboard Stats',
          items: ['Total Properties', 'Active Cleanings', 'Pending Issues', 'Monthly Revenue']
        },
        {
          name: 'Quick Actions',
          items: ['Add Property', 'Schedule Cleaning', 'View Reports', 'Manage Team']
        },
        {
          name: 'Recent Activity',
          content: 'Property management updates and notifications'
        }
      ],
      navigation: [
        {
          name: 'Properties',
          icon: 'Home',
          features: ['Search & Filter', 'Property Cards', 'Add/Edit Properties', 'Schedule Cleanings', 'Assign Cleaners']
        },
        {
          name: 'Team',
          icon: 'Users',
          features: ['Team Member Cards', 'Role Filters', 'Invite Members', 'Performance Ratings']
        },
        {
          name: 'Schedule',
          icon: 'Calendar',
          features: ['Day/Week/Month Views', 'Cleaning Schedule Cards', 'Airbnb Sync', 'Manual Scheduling']
        },
        {
          name: 'Invoices',
          icon: 'FileText',
          features: ['Invoice Management', 'Status Filtering', 'Payment Tracking', 'Export Reports']
        },
        {
          name: 'Maintenance',
          icon: 'Wrench',
          features: ['Ticket Management', 'Priority Filtering', 'Assignment System', 'Status Tracking']
        },
        {
          name: 'Reports',
          icon: 'BarChart3',
          features: ['Performance Analytics', 'Expense Breakdown', 'Property Performance', 'Export Capabilities']
        },
        {
          name: 'Profile',
          icon: 'Settings',
          features: ['Personal Info', 'Account Settings', 'Notifications', 'Sign Out']
        }
      ]
    },
    cleaner: {
      greeting: 'Good morning, [Name]! Your cleaning schedule',
      components: [
        {
          name: 'Today\'s Schedule',
          content: 'Assigned cleaning sessions with priority information'
        }
      ],
      navigation: [
        {
          name: 'Properties',
          icon: 'Home',
          features: ['Assigned Properties', 'Cleaner Property Cards', 'Access Codes', 'Special Instructions', 'Linen Requirements']
        },
        {
          name: 'Schedule',
          icon: 'Calendar',
          features: ['Personal Schedule View', 'Task Status Updates', 'Time Tracking', 'Completion Marking']
        },
        {
          name: 'Profile',
          icon: 'Settings',
          features: ['Personal Info', 'Availability Settings', 'Performance Stats', 'Sign Out']
        }
      ]
    },
    co_host: {
      greeting: 'Good morning, [Name]! Property coordination',
      components: [
        {
          name: 'Dashboard Stats',
          items: ['Assigned Properties', 'Active Cleanings', 'Pending Issues', 'Team Performance']
        },
        {
          name: 'Quick Actions',
          items: ['Schedule Cleaning', 'View Reports', 'Coordinate Team', 'Handle Issues']
        }
      ],
      navigation: [
        {
          name: 'Properties',
          icon: 'Home',
          features: ['Assigned Properties', 'Schedule Management', 'Issue Tracking', 'Guest Communication']
        },
        {
          name: 'Team',
          icon: 'Users',
          features: ['Team Coordination', 'Performance Monitoring', 'Schedule Management']
        },
        {
          name: 'Schedule',
          icon: 'Calendar',
          features: ['Multi-Property Scheduling', 'Team Coordination', 'Guest Management']
        },
        {
          name: 'Reports',
          icon: 'BarChart3',
          features: ['Performance Reports', 'Property Analytics', 'Team Statistics']
        },
        {
          name: 'Profile',
          icon: 'Settings',
          features: ['Personal Info', 'Account Settings', 'Sign Out']
        }
      ]
    }
  };

  const propertyDetailFlow = {
    cleanerView: {
      primaryInfo: [
        'Property Name & Address',
        'Guest Count (for linen prep)',
        'Check-in/Check-out Times',
        'Access Method & Code',
        'Session Status'
      ],
      secondaryInfo: [
        'WiFi Credentials',
        'Emergency Contact',
        'Special Instructions',
        'Cleaning Duration',
        'Linen Requirements'
      ],
      actions: [
        'Start Cleaning',
        'Report Issue',
        'Update Status',
        'Complete Session'
      ]
    },
    ownerView: {
      primaryInfo: [
        'Property Overview',
        'Current Status',
        'Assigned Cleaners',
        'Next Scheduled Clean',
        'Revenue Stats'
      ],
      managementOptions: [
        'Edit Property',
        'Schedule Clean',
        'Assign Cleaner',
        'View History',
        'Maintenance Requests'
      ]
    }
  };

  const dataStructure = {
    coreEntities: [
      {
        name: 'Properties',
        fields: ['Basic Info', 'Access Details', 'Features', 'Cleaning Logistics', 'Emergency Contacts']
      },
      {
        name: 'Cleaning Sessions',
        fields: ['Property Link', 'Cleaner Assignment', 'Guest Info', 'Timing', 'Status', 'Linen Requirements']
      },
      {
        name: 'Team Members',
        fields: ['Profile Info', 'Role', 'Assignments', 'Performance', 'Availability']
      },
      {
        name: 'User Profiles',
        fields: ['Auth Info', 'Personal Details', 'Role', 'Preferences', 'Onboarding Status']
      }
    ]
  };

  const keyFeatures = {
    cleanerFocused: [
      'Guest count prominently displayed for linen preparation',
      'Access codes and instructions clearly visible',
      'Automatic linen requirements based on guest count',
      'Clear cancellation handling with notice period',
      'Special areas and cleaning requirements highlighted',
      'Emergency contact information readily available',
      'WiFi credentials for cleaner mobile access',
      'Offline mobile capability for poor connectivity areas'
    ],
    ownerFocused: [
      'Multi-property dashboard with stats',
      'Team management and performance tracking',
      'Automated scheduling with Airbnb sync',
      'Invoice and payment management',
      'Maintenance ticket system',
      'Comprehensive reporting and analytics'
    ]
  };

  const IconComponent = ({ name, size = 20, color = 'currentColor' }) => {
    const icons = {
      Home, Users, Calendar, FileText, Wrench, BarChart3, Settings, 
      User, LogIn, UserPlus, Lock, Eye, Edit, Plus, CheckSquare, 
      Phone, Wifi, MapPin, Clock, AlertTriangle, Star
    };
    const Icon = icons[name] || Home;
    return <Icon size={size} color={color} />;
  };

  const MindMapNode = ({ node, level = 0, color = '#6b7280' }) => {
    const isExpanded = expandedNode === node.id;
    
    return (
      <div className={`ml-${level * 4} my-2`}>
        <div 
          className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-100"
          onClick={() => setExpandedNode(isExpanded ? null : node.id)}
        >
          {node.icon && <IconComponent name={node.icon} size={18} color={color} />}
          <span className="ml-2 font-medium" style={{ color }}>{node.name}</span>
          {node.children && (
            <span className="ml-2 text-sm text-gray-500">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
        
        {node.description && (
          <div className="ml-8 text-sm text-gray-600 mb-2">
            {node.description}
          </div>
        )}
        
        {node.features && (
          <div className="ml-8">
            {node.features.map((feature, idx) => (
              <div key={idx} className="text-sm text-gray-500 mb-1">
                • {feature}
              </div>
            ))}
          </div>
        )}
        
        {isExpanded && node.children && (
          <div className="ml-4 border-l border-gray-200 pl-4">
            {node.children.map((child, idx) => (
              <MindMapNode 
                key={idx} 
                node={child} 
                level={level + 1} 
                color={color}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const createMindMapData = () => {
    const roleData = dashboardStructure[selectedRole];
    
    return {
      id: 'root',
      name: 'Cleaner Management App',
      icon: 'Home',
      children: [
        {
          id: 'auth',
          name: 'Authentication Flow',
          icon: 'Lock',
          children: [
            {
              id: 'login',
              name: 'Login Screen',
              icon: 'LogIn',
              features: ['Email/Password', 'Forgot Password Link', 'Sign Up Link']
            },
            {
              id: 'register',
              name: 'Registration',
              icon: 'UserPlus',
              features: ['Full Name', 'Email', 'Password', 'Role Selection', 'Email Verification']
            },
            {
              id: 'onboarding',
              name: 'Onboarding Flow',
              icon: 'Eye',
              features: ['Welcome Screen', 'Feature Introduction', 'Setup Guidance']
            }
          ]
        },
        {
          id: 'dashboard',
          name: `Dashboard (${selectedRole.replace('_', ' ')})`,
          icon: 'BarChart3',
          description: roleData.greeting,
          children: roleData.components.map((comp, idx) => ({
            id: `comp-${idx}`,
            name: comp.name,
            features: comp.items || [comp.content]
          }))
        },
        {
          id: 'navigation',
          name: 'Main Navigation',
          children: roleData.navigation.map((nav, idx) => ({
            id: `nav-${idx}`,
            name: nav.name,
            icon: nav.icon,
            features: nav.features
          }))
        }
      ]
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🧹 Cleaner Management App - Architecture & User Flow
        </h1>
        
        <div className="mb-6 flex space-x-4">
          <div className="flex space-x-2 bg-white p-2 rounded-lg">
            {['mindmap', 'userflow', 'features'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded capitalize font-medium ${
                  activeView === view 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {view === 'mindmap' ? 'Mind Map' : 
                 view === 'userflow' ? 'User Flow' : 
                 'Key Features'}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2 bg-white p-2 rounded-lg">
            {Object.keys(dashboardStructure).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  selectedRole === role 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{
                  backgroundColor: selectedRole === role ? roleColors[role] : 'transparent'
                }}
              >
                {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {activeView === 'mindmap' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: roleColors[selectedRole] }}>
              App Structure - {selectedRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} View
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Navigation Structure</h3>
                <MindMapNode 
                  node={createMindMapData()} 
                  color={roleColors[selectedRole]}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Role-Based Access</h3>
                <div className="space-y-4">
                  {Object.entries(dashboardStructure).map(([role, data]) => (
                    <div 
                      key={role}
                      className={`p-4 rounded-lg border-2 ${
                        role === selectedRole ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold text-lg mb-2" style={{ color: roleColors[role] }}>
                        {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{data.greeting}</p>
                      <div className="text-sm">
                        <strong>Navigation:</strong> {data.navigation.map(n => n.name).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'userflow' && (
          <div className="space-y-6">
            {/* Authentication Flow */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Authentication & Onboarding Flow</h2>
              <div className="flex items-center space-x-4 overflow-x-auto pb-4">
                <div className="min-w-0 flex-1">
                  <div className="flow-diagram">
                    {/* App Launch */}
                    <div className="flow-step bg-gray-100 p-4 rounded-lg text-center min-w-[150px]">
                      <div className="font-bold">App Launch</div>
                      <div className="text-sm text-gray-600 mt-1">Initial Load</div>
                    </div>
                    
                    <div className="flow-arrow">→</div>
                    
                    {/* Auth Check */}
                    <div className="flow-step bg-yellow-100 p-4 rounded-lg text-center min-w-[150px]">
                      <div className="font-bold">Auth Check</div>
                      <div className="text-sm text-gray-600 mt-1">Session Exists?</div>
                    </div>
                    
                    <div className="flow-split">
                      <div className="flow-path">
                        <div className="flow-arrow-down">↓</div>
                        <div className="text-xs text-gray-500">No Session</div>
                        <div className="flow-step bg-blue-100 p-4 rounded-lg text-center min-w-[150px] mt-2">
                          <div className="font-bold">Login/Register</div>
                          <div className="text-sm text-gray-600 mt-1">Authentication</div>
                        </div>
                      </div>
                      
                      <div className="flow-path">
                        <div className="flow-arrow-down">↓</div>
                        <div className="text-xs text-gray-500">Has Session</div>
                        <div className="flow-step bg-green-100 p-4 rounded-lg text-center min-w-[150px] mt-2">
                          <div className="font-bold">Profile Check</div>
                          <div className="text-sm text-gray-600 mt-1">Onboarded?</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flow-arrow mt-4">→</div>
                    
                    {/* Final Destination */}
                    <div className="flow-step bg-green-200 p-4 rounded-lg text-center min-w-[150px]">
                      <div className="font-bold">Dashboard</div>
                      <div className="text-sm text-gray-600 mt-1">Role-based UI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Flow */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">
                Dashboard Flow - {selectedRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Dashboard Components</h3>
                  {dashboardStructure[selectedRole].components.map((comp, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded mb-2">
                      <div className="font-medium">{comp.name}</div>
                      {comp.items && (
                        <div className="text-sm text-gray-600 mt-1">
                          {comp.items.join(' • ')}
                        </div>
                      )}
                      {comp.content && (
                        <div className="text-sm text-gray-600 mt-1">{comp.content}</div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Navigation Options</h3>
                  {dashboardStructure[selectedRole].navigation.map((nav, idx) => (
                    <div key={idx} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <IconComponent name={nav.icon} size={18} color={roleColors[selectedRole]} />
                      <span className="ml-2 font-medium">{nav.name}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Key Actions</h3>
                  <div className="space-y-2">
                    {selectedRole === 'cleaner' ? [
                      'View Assigned Properties',
                      'Update Cleaning Status',
                      'Report Issues',
                      'Track Time',
                      'Complete Sessions'
                    ] : [
                      'Add New Property',
                      'Schedule Cleanings',
                      'Manage Team',
                      'Generate Reports',
                      'Handle Maintenance'
                    ].map((action, idx) => (
                      <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                        • {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Detail Flow */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Property Detail View Flow</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Cleaner View</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Primary Information</h4>
                      <div className="bg-green-50 p-3 rounded">
                        {propertyDetailFlow.cleanerView.primaryInfo.map((item, idx) => (
                          <div key={idx} className="text-sm mb-1">• {item}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Secondary Information</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        {propertyDetailFlow.cleanerView.secondaryInfo.map((item, idx) => (
                          <div key={idx} className="text-sm mb-1">• {item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Owner View</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Property Overview</h4>
                      <div className="bg-blue-50 p-3 rounded">
                        {propertyDetailFlow.ownerView.primaryInfo.map((item, idx) => (
                          <div key={idx} className="text-sm mb-1">• {item}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Management Options</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        {propertyDetailFlow.ownerView.managementOptions.map((item, idx) => (
                          <div key={idx} className="text-sm mb-1">• {item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'features' && (
          <div className="space-y-6">
            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Key Features & Differentiators</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">🧹 Cleaner-Focused Features</h3>
                  {keyFeatures.cleanerFocused.map((feature, idx) => (
                    <div key={idx} className="flex items-start mb-3">
                      <CheckSquare className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">🏠 Owner-Focused Features</h3>
                  {keyFeatures.ownerFocused.map((feature, idx) => (
                    <div key={idx} className="flex items-start mb-3">
                      <CheckSquare className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Structure */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Data Architecture</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {dataStructure.coreEntities.map((entity, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{entity.name}</h3>
                    {entity.fields.map((field, fieldIdx) => (
                      <div key={fieldIdx} className="text-sm text-gray-600 mb-2">
                        • {field}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Notes */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-800">🚀 Implementation Roadmap</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-red-600 mb-3">Phase 1: Foundation</h3>
                  <div className="space-y-2 text-sm">
                    <div>• Complete authentication system</div>
                    <div>• Role-based dashboard</div>
                    <div>• Property management</div>
                    <div>• Basic cleaner assignment</div>
                    <div>• Mobile responsiveness</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibent text-orange-600 mb-3">Phase 2: Core Features</h3>
                  <div className="space-y-2 text-sm">
                    <div>• Advanced scheduling</div>
                    <div>• Linen management</div>
                    <div>• Real-time notifications</div>
                    <div>• Offline capability</div>
                    <div>• Payment processing</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">Phase 3: Advanced</h3>
                  <div className="space-y-2 text-sm">
                    <div>• PMS integrations</div>
                    <div>• Advanced analytics</div>
                    <div>• Multi-language support</div>
                    <div>• AI-powered features</div>
                    <div>• Enterprise tools</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .flow-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .flow-step {
          transition: transform 0.2s;
        }
        
        .flow-step:hover {
          transform: scale(1.02);
        }
        
        .flow-arrow {
          font-size: 1.5rem;
          color: #6b7280;
        }
        
        .flow-arrow-down {
          font-size: 1.5rem;
          color: #6b7280;
          text-align: center;
        }
        
        .flow-split {
          display: flex;
          gap: 2rem;
          justify-content: center;
          width: 100%;
        }
        
        .flow-path {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default AppMindMap;