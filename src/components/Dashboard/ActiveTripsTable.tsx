import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Play, 
  Square, 
  Clock, 
  MapPin, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function ActiveTripsTable() {
  const { trips, buses, routes, markDeparture, markArrival } = useData();
  const { formatTime } = useAuth();

  // Get today's active trips (running or scheduled)
  const activeTrips = trips.filter(trip => {
    const today = new Date();
    return trip.departureTime.toDateString() === today.toDateString() &&
           (trip.status === 'running' || trip.status === 'scheduled');
  }).sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Play className="w-3 h-3 mr-1" />
            Running
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Delayed
          </span>
        );
      default:
        return null;
    }
  };

  const handleDeparture = (tripId: string) => {
    markDeparture(tripId);
  };

  const handleArrival = (tripId: string) => {
    markArrival(tripId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Active Trips Today</h3>
        <p className="text-sm text-gray-600">Monitor and manage ongoing bus trips</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
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
            {activeTrips.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Clock className="w-8 h-8 text-gray-400" />
                    <p>No active trips at the moment</p>
                    <p className="text-sm">Trips will appear here when scheduled</p>
                  </div>
                </td>
              </tr>
            ) : (
              activeTrips.map((trip) => {
                const bus = buses.find(b => b.id === trip.busId);
                const route = routes.find(r => r.id === trip.routeId);
                
                return (
                  <tr key={trip.id} className="hover:bg-gray-50 transition-colors duration-150">
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
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          Dep: {formatTime(trip.departureTime)}
                        </p>
                        <p className="text-gray-500">
                          Est: {formatTime(trip.estimatedArrivalTime)}
                        </p>
                        {trip.actualDepartureTime && (
                          <p className="text-green-600 text-xs">
                            Left: {formatTime(trip.actualDepartureTime)}
                          </p>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(trip.status)}
                        {trip.delayMinutes && trip.delayMinutes > 0 && (
                          <p className="text-xs text-red-600">
                            +{trip.delayMinutes} min delay
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Trip #{trip.tripNumber} {trip.isReturnTrip ? '(Return)' : '(Forward)'}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {trip.status === 'scheduled' && (
                          <button
                            onClick={() => handleDeparture(trip.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Depart
                          </button>
                        )}
                        
                        {trip.status === 'running' && (
                          <button
                            onClick={() => handleArrival(trip.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Arrive
                          </button>
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
  );
}