import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Filter, 
  RefreshCw, 
  Play, 
  Square, 
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export default function TripManagement() {
  const { trips, buses, routes, markDeparture, markArrival, cancelTrip } = useData();
  const { formatTime } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filter trips based on selected date and status
  const filteredTrips = trips.filter(trip => {
    const tripDate = trip.departureTime.toISOString().split('T')[0];
    const dateMatch = tripDate === selectedDate;
    const statusMatch = filterStatus === 'all' || trip.status === filterStatus;
    return dateMatch && statusMatch;
  }).sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime());

  const getStatusBadge = (status: string, delayMinutes?: number) => {
    const badges = {
      scheduled: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <Clock className="w-3 h-3 mr-1" />
          Scheduled
        </span>
      ),
      running: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Play className="w-3 h-3 mr-1" />
          Running
        </span>
      ),
      completed: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </span>
      ),
      cancelled: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </span>
      ),
      delayed: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Delayed ({delayMinutes}min)
        </span>
      )
    };

    return badges[status as keyof typeof badges] || badges.scheduled;
  };

  const handleAction = (tripId: string, action: 'depart' | 'arrive' | 'cancel') => {
    switch (action) {
      case 'depart':
        markDeparture(tripId);
        break;
      case 'arrive':
        markArrival(tripId);
        break;
      case 'cancel':
        cancelTrip(tripId);
        break;
    }
  };

  const statusCounts = {
    all: filteredTrips.length,
    scheduled: filteredTrips.filter(t => t.status === 'scheduled').length,
    running: filteredTrips.filter(t => t.status === 'running').length,
    completed: filteredTrips.filter(t => t.status === 'completed').length,
    cancelled: filteredTrips.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Management</h1>
        <p className="text-gray-600">Monitor and control all bus trips in real-time</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Date Picker */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <label htmlFor="date" className="text-sm font-medium text-gray-700">
                Date:
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All ({statusCounts.all})</option>
                <option value="scheduled">Scheduled ({statusCounts.scheduled})</option>
                <option value="running">Running ({statusCounts.running})</option>
                <option value="completed">Completed ({statusCounts.completed})</option>
                <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
              </select>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus & Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Calendar className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">No trips found</p>
                        <p className="text-gray-500">
                          {filterStatus === 'all' 
                            ? 'No trips scheduled for this date' 
                            : `No ${filterStatus} trips for this date`
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const bus = buses.find(b => b.id === trip.busId);
                  const route = routes.find(r => r.id === trip.routeId);

                  return (
                    <tr key={trip.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            Trip #{trip.tripNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {trip.isReturnTrip ? '← Return' : '→ Forward'}
                          </p>
                          {trip.includesLunchBreak && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                              Lunch Break
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {bus?.numberPlate?.slice(-2) || 'XX'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {bus?.numberPlate || 'Unknown Bus'}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {route?.fromLocation} → {route?.toLocation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-gray-500 text-xs">Scheduled:</span>
                            <p className="font-medium">{formatTime(trip.departureTime)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Est. Arrival:</span>
                            <p className="text-gray-700">{formatTime(trip.estimatedArrivalTime)}</p>
                          </div>
                          {trip.actualDepartureTime && (
                            <div>
                              <span className="text-gray-500 text-xs">Actual Dep:</span>
                              <p className="text-green-600">{formatTime(trip.actualDepartureTime)}</p>
                            </div>
                          )}
                          {trip.actualArrivalTime && (
                            <div>
                              <span className="text-gray-500 text-xs">Actual Arr:</span>
                              <p className="text-green-600">{formatTime(trip.actualArrivalTime)}</p>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(trip.status, trip.delayMinutes)}
                          {trip.delayMinutes && trip.delayMinutes > 0 && trip.status !== 'cancelled' && (
                            <p className="text-xs text-orange-600">
                              +{trip.delayMinutes} min delay
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {trip.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleAction(trip.id, 'depart')}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Depart
                              </button>
                              <button
                                onClick={() => handleAction(trip.id, 'cancel')}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Cancel
                              </button>
                            </>
                          )}

                          {trip.status === 'running' && (
                            <button
                              onClick={() => handleAction(trip.id, 'arrive')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark Arrived
                            </button>
                          )}

                          {(trip.status === 'completed' || trip.status === 'cancelled') && (
                            <span className="text-xs text-gray-500 italic">
                              No actions available
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}