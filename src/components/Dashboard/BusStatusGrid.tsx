import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Bus, Wrench, Play, Square } from 'lucide-react';

export default function BusStatusGrid() {
  const { buses } = useData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-600" />;
      case 'in-trip':
        return <Bus className="w-4 h-4 text-blue-600" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-red-600" />;
      case 'inactive':
        return <Square className="w-4 h-4 text-gray-600" />;
      default:
        return <Square className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-200 bg-green-50';
      case 'in-trip':
        return 'border-blue-200 bg-blue-50';
      case 'maintenance':
        return 'border-red-200 bg-red-50';
      case 'inactive':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'in-trip':
        return 'In Trip';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Bus Fleet Status</h3>
        <p className="text-sm text-gray-600">Real-time status of all buses</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(bus.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(bus.status)}
                  <span className="font-medium text-gray-900 text-sm">
                    {bus.numberPlate}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  bus.status === 'active' ? 'bg-green-100 text-green-800' :
                  bus.status === 'in-trip' ? 'bg-blue-100 text-blue-800' :
                  bus.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(bus.status)}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Home Stand:</span>
                  <span className="font-medium">{bus.homeStand}</span>
                </div>
                <div className="flex justify-between">
                  <span>Today's Trips:</span>
                  <span className="font-medium">{bus.currentTrips}/{bus.maxTripsPerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Hours:</span>
                  <span className="font-medium">{bus.activeHours.toFixed(1)}h/{bus.maxActiveHours}h</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Trip Progress</span>
                    <span>{Math.round((bus.currentTrips / bus.maxTripsPerDay) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((bus.currentTrips / bus.maxTripsPerDay) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Hours Used</span>
                    <span>{Math.round((bus.activeHours / bus.maxActiveHours) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((bus.activeHours / bus.maxActiveHours) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {buses.length === 0 && (
          <div className="text-center py-8">
            <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No buses found</p>
            <p className="text-sm text-gray-400">Add buses to see their status here</p>
          </div>
        )}
      </div>
    </div>
  );
}