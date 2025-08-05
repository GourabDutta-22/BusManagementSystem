import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Bus, 
  Wrench, 
  Play, 
  Square, 
  Filter,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function BusStatus() {
  const { buses, updateBus, getBusCurrentTrip, routes } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStand, setFilterStand] = useState<string>('all');

  // Get unique home stands for filter
  const homeStands = [...new Set(buses.map(bus => bus.homeStand))];

  // Filter buses
  const filteredBuses = buses.filter(bus => {
    const statusMatch = filterStatus === 'all' || bus.status === filterStatus;
    const standMatch = filterStand === 'all' || bus.homeStand === filterStand;
    return statusMatch && standMatch;
  });

  const handleStatusChange = (busId: string, newStatus: 'active' | 'inactive' | 'maintenance') => {
    updateBus(busId, { status: newStatus });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-5 h-5 text-green-600" />;
      case 'in-trip':
        return <Bus className="w-5 h-5 text-blue-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-red-600" />;
      case 'inactive':
        return <Square className="w-5 h-5 text-gray-600" />;
      default:
        return <Square className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-trip':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-amber-600';
    return 'text-green-600';
  };

  const statusCounts = {
    all: filteredBuses.length,
    active: filteredBuses.filter(b => b.status === 'active').length,
    'in-trip': filteredBuses.filter(b => b.status === 'in-trip').length,
    maintenance: filteredBuses.filter(b => b.status === 'maintenance').length,
    inactive: filteredBuses.filter(b => b.status === 'inactive').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bus Fleet Status</h1>
        <p className="text-gray-600">Monitor and manage the status of all buses in your fleet</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All ({statusCounts.all})</option>
                <option value="active">Active ({statusCounts.active})</option>
                <option value="in-trip">In Trip ({statusCounts['in-trip']})</option>
                <option value="maintenance">Maintenance ({statusCounts.maintenance})</option>
                <option value="inactive">Inactive ({statusCounts.inactive})</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <label htmlFor="stand-filter" className="text-sm font-medium text-gray-700">
                Home Stand:
              </label>
              <select
                id="stand-filter"
                value={filterStand}
                onChange={(e) => setFilterStand(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Stands</option>
                {homeStands.map(stand => (
                  <option key={stand} value={stand}>{stand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => {
          const currentTrip = getBusCurrentTrip(bus.id);
          const assignedRoute = bus.assignedRoute ? routes.find(r => r.id === bus.assignedRoute) : null;
          const tripUtilization = (bus.currentTrips / bus.maxTripsPerDay) * 100;
          const hoursUtilization = (bus.activeHours / bus.maxActiveHours) * 100;

          return (
            <div key={bus.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {bus.numberPlate.slice(-2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bus.numberPlate}
                      </h3>
                      <p className="text-sm text-gray-500">{bus.homeStand}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(bus.status)}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bus.status)}`}>
                    {bus.status.charAt(0).toUpperCase() + bus.status.slice(1).replace('-', ' ')}
                  </span>
                  
                  {bus.status !== 'in-trip' && bus.status !== 'maintenance' && (
                    <div className="flex space-x-2">
                      {bus.status !== 'active' && (
                        <button
                          onClick={() => handleStatusChange(bus.id, 'active')}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors duration-200"
                        >
                          Activate
                        </button>
                      )}
                      {bus.status !== 'inactive' && (
                        <button
                          onClick={() => handleStatusChange(bus.id, 'inactive')}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors duration-200"
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(bus.id, 'maintenance')}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors duration-200"
                      >
                        Maintenance
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                {/* Current Trip Info */}
                {currentTrip && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bus className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Current Trip</span>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>Trip #{currentTrip.tripNumber} ({currentTrip.isReturnTrip ? 'Return' : 'Forward'})</p>
                      {assignedRoute && (
                        <p>{assignedRoute.fromLocation} → {assignedRoute.toLocation}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Today's Trips</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getUtilizationColor(tripUtilization)}`}>
                        {bus.currentTrips}
                      </span>
                      <span className="text-sm text-gray-400">/ {bus.maxTripsPerDay}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(tripUtilization, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Active Hours</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getUtilizationColor(hoursUtilization)}`}>
                        {bus.activeHours.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">/ {bus.maxActiveHours}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(hoursUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Route Assignment */}
                {assignedRoute && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Assigned Route</p>
                      <p className="text-sm font-medium text-gray-900">
                        {assignedRoute.fromLocation} ↔ {assignedRoute.toLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Travel Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {assignedRoute.baseTravelTime + (assignedRoute.middleStopCount * assignedRoute.stopDelayPerStop)} min
                      </p>
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {(tripUtilization >= 90 || hoursUtilization >= 90) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">High Utilization</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      This bus is approaching its daily limits
                    </p>
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Last updated</span>
                  </div>
                  <span>{bus.lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBuses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center">
            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all' && filterStand === 'all'
                ? 'No buses are registered in the system'
                : 'No buses match the current filters'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}