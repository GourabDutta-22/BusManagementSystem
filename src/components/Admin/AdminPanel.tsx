import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Bus, 
  Route, 
  Calendar, 
  Settings, 
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const { buses, routes, trips, generateDailySchedule } = useData();

  // Calculate statistics
  const totalBuses = buses.length;
  const activeBuses = buses.filter(bus => bus.status === 'active').length;
  const maintenanceBuses = buses.filter(bus => bus.status === 'maintenance').length;
  const totalRoutes = routes.length;

  const todaysTrips = trips.filter(trip => {
    const today = new Date();
    return trip.departureTime.toDateString() === today.toDateString();
  });

  const completedTrips = todaysTrips.filter(trip => trip.status === 'completed').length;
  const cancelledTrips = todaysTrips.filter(trip => trip.status === 'cancelled').length;
  const runningTrips = todaysTrips.filter(trip => trip.status === 'running').length;

  const quickActions = [
    {
      title: 'Manage Buses',
      description: 'Add, edit, and configure bus fleet',
      icon: Bus,
      href: '/buses',
      color: 'blue'
    },
    {
      title: 'Manage Routes',
      description: 'Configure routes and stops',
      icon: Route,
      href: '/routes',
      color: 'green'
    },
    {
      title: 'Generate Schedule',
      description: 'Auto-generate daily trip schedules',
      icon: Calendar,
      action: generateDailySchedule,
      color: 'purple'
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: Settings,
      href: '/settings',
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage your bus dispatch system configuration and operations</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-3xl font-bold text-blue-600">{totalBuses}</p>
              <p className="text-sm text-green-600">{activeBuses} active</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Bus className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
              <p className="text-3xl font-bold text-green-600">{totalRoutes}</p>
              <p className="text-sm text-gray-500">Configured</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Trips</p>
              <p className="text-3xl font-bold text-purple-600">{todaysTrips.length}</p>
              <p className="text-sm text-green-600">{completedTrips} completed</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-emerald-600">
                {Math.round(((totalBuses - maintenanceBuses) / totalBuses) * 100)}%
              </p>
              <p className="text-sm text-gray-500">Operational</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const content = (
              <div className={`p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                action.href ? 'hover:border-blue-300' : 'hover:border-purple-300'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${getColorClasses(action.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            );

            if (action.href) {
              return (
                <Link key={action.title} to={action.href}>
                  {content}
                </Link>
              );
            } else if (action.action) {
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="text-left w-full"
                >
                  {content}
                </button>
              );
            }
            return content;
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fleet Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Active Buses</span>
              </div>
              <span className="text-sm font-bold text-green-600">{activeBuses}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Buses in Trip</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {buses.filter(bus => bus.status === 'in-trip').length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Maintenance</span>
              </div>
              <span className="text-sm font-bold text-red-600">{maintenanceBuses}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Inactive</span>
              </div>
              <span className="text-sm font-bold text-gray-600">
                {buses.filter(bus => bus.status === 'inactive').length}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Completed Trips</span>
              </div>
              <span className="text-sm font-bold text-green-600">{completedTrips}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">Running Trips</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{runningTrips}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-900">Cancelled Trips</span>
              </div>
              <span className="text-sm font-bold text-red-600">{cancelledTrips}</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Completion Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {todaysTrips.length > 0 
                    ? Math.round((completedTrips / todaysTrips.length) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${todaysTrips.length > 0 
                      ? (completedTrips / todaysTrips.length) * 100 
                      : 0
                    }%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {(cancelledTrips > 0 || maintenanceBuses > 0) && (
        <div className="mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-800">System Alerts</h3>
            </div>
            <div className="space-y-2 text-sm text-amber-700">
              {cancelledTrips > 0 && (
                <p>• {cancelledTrips} trip(s) cancelled today - review scheduling conflicts</p>
              )}
              {maintenanceBuses > 0 && (
                <p>• {maintenanceBuses} bus(es) currently under maintenance - consider backup plans</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}