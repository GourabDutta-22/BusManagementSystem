import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bus, 
  Route, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import StatsCard from './StatsCard';
import ActiveTripsTable from './ActiveTripsTable';
import BusStatusGrid from './BusStatusGrid';

export default function Dashboard() {
  const { buses, routes, trips } = useData();
  const { user, formatTime } = useAuth();

  // Calculate statistics
  const activeBuses = buses.filter(bus => bus.status === 'active').length;
  const busesInTrip = buses.filter(bus => bus.status === 'in-trip').length;
  const busesInMaintenance = buses.filter(bus => bus.status === 'maintenance').length;
  
  const todaysTrips = trips.filter(trip => {
    const today = new Date();
    return trip.departureTime.toDateString() === today.toDateString();
  });
  
  const completedTrips = todaysTrips.filter(trip => trip.status === 'completed').length;
  const scheduledTrips = todaysTrips.filter(trip => trip.status === 'scheduled').length;
  const cancelledTrips = todaysTrips.filter(trip => trip.status === 'cancelled').length;
  const runningTrips = todaysTrips.filter(trip => trip.status === 'running').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your bus fleet today.
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(new Date())}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Buses"
          value={activeBuses}
          total={buses.length}
          icon={Bus}
          color="green"
          trend="+2.3%"
        />
        <StatsCard
          title="Buses in Trip"
          value={busesInTrip}
          total={buses.length}
          icon={Route}
          color="blue"
          trend="+5.1%"
        />
        <StatsCard
          title="Completed Trips"
          value={completedTrips}
          total={todaysTrips.length}
          icon={CheckCircle}
          color="emerald"
          trend="+12.5%"
        />
        <StatsCard
          title="Cancelled Trips"
          value={cancelledTrips}
          total={todaysTrips.length}
          icon={XCircle}
          color="red"
          trend="-1.2%"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Running Trips</p>
              <p className="text-2xl font-bold text-blue-600">{runningTrips}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled Trips</p>
              <p className="text-2xl font-bold text-amber-600">{scheduledTrips}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
              <p className="text-2xl font-bold text-purple-600">{routes.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Trips Table */}
        <div className="lg:col-span-2">
          <ActiveTripsTable />
        </div>

        {/* Bus Status Grid */}
        <div className="lg:col-span-1">
          <BusStatusGrid />
        </div>
      </div>

      {/* Alerts Section */}
      {(cancelledTrips > 0 || busesInMaintenance > 0) && (
        <div className="mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-800">Attention Required</h3>
            </div>
            <div className="space-y-2 text-sm text-amber-700">
              {cancelledTrips > 0 && (
                <p>• {cancelledTrips} trip(s) cancelled today due to delays</p>
              )}
              {busesInMaintenance > 0 && (
                <p>• {busesInMaintenance} bus(es) currently under maintenance</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}