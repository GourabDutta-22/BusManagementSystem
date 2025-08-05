import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock,
  Route as RouteIcon,
  AlertTriangle
} from 'lucide-react';

export default function RouteManagement() {
  const { routes, addRoute, updateRoute } = useData();
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    baseTravelTime: 30,
    middleStopCount: 10,
    stopDelayPerStop: 1,
    distance: 20
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Time') || name.includes('Count') || name.includes('Delay') || name === 'distance' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoute) {
      updateRoute(editingRoute, formData);
      setEditingRoute(null);
    } else {
      addRoute(formData);
      setIsAddingRoute(false);
    }
    
    setFormData({
      fromLocation: '',
      toLocation: '',
      baseTravelTime: 30,
      middleStopCount: 10,
      stopDelayPerStop: 1,
      distance: 20
    });
  };

  const handleEdit = (route: any) => {
    setFormData({
      fromLocation: route.fromLocation,
      toLocation: route.toLocation,
      baseTravelTime: route.baseTravelTime,
      middleStopCount: route.middleStopCount,
      stopDelayPerStop: route.stopDelayPerStop,
      distance: route.distance
    });
    setEditingRoute(route.id);
    setIsAddingRoute(false);
  };

  const handleCancel = () => {
    setIsAddingRoute(false);
    setEditingRoute(null);
    setFormData({
      fromLocation: '',
      toLocation: '',
      baseTravelTime: 30,
      middleStopCount: 10,
      stopDelayPerStop: 1,
      distance: 20
    });
  };

  const calculateTotalTime = (baseTime: number, stops: number, delay: number) => {
    return baseTime + (stops * delay);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Management</h1>
          <p className="text-gray-600">Configure and manage bus routes for your dispatch system</p>
        </div>
        
        {!isAddingRoute && !editingRoute && (
          <button
            onClick={() => setIsAddingRoute(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Route
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingRoute || editingRoute) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  From Location *
                </label>
                <input
                  type="text"
                  id="fromLocation"
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Asansol"
                  required
                />
              </div>

              <div>
                <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  To Location *
                </label>
                <input
                  type="text"
                  id="toLocation"
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Raniganj"
                  required
                />
              </div>

              <div>
                <label htmlFor="baseTravelTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Base Travel Time (minutes) *
                </label>
                <input
                  type="number"
                  id="baseTravelTime"
                  name="baseTravelTime"
                  value={formData.baseTravelTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  max="180"
                  required
                />
              </div>

              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km) *
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="200"
                  required
                />
              </div>

              <div>
                <label htmlFor="middleStopCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Stops Count *
                </label>
                <input
                  type="number"
                  id="middleStopCount"
                  name="middleStopCount"
                  value={formData.middleStopCount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="50"
                  required
                />
              </div>

              <div>
                <label htmlFor="stopDelayPerStop" className="block text-sm font-medium text-gray-700 mb-2">
                  Delay Per Stop (minutes) *
                </label>
                <input
                  type="number"
                  id="stopDelayPerStop"
                  name="stopDelayPerStop"
                  value={formData.stopDelayPerStop}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.5"
                  max="5"
                  step="0.5"
                  required
                />
              </div>
            </div>

            {/* Calculated Values Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Calculated Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Total Travel Time:</span>
                  <span className="ml-2 font-semibold text-blue-900">
                    {calculateTotalTime(formData.baseTravelTime, formData.middleStopCount, formData.stopDelayPerStop)} minutes
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Stop Delay Total:</span>
                  <span className="ml-2 font-semibold text-blue-900">
                    {formData.middleStopCount * formData.stopDelayPerStop} minutes
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Round Trip Time:</span>
                  <span className="ml-2 font-semibold text-blue-900">
                    {calculateTotalTime(formData.baseTravelTime, formData.middleStopCount, formData.stopDelayPerStop) * 2 + 10} minutes
                  </span>
                  <span className="text-xs text-blue-600 block">(includes 5+5 min breaks)</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRoute ? 'Update Route' : 'Save Route'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Configured Routes</h3>
          <p className="text-sm text-gray-600">Manage existing routes and their configurations</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <RouteIcon className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">No routes configured</p>
                        <p className="text-gray-500">Add your first route to get started</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                routes.map((route) => {
                  const totalTime = calculateTotalTime(route.baseTravelTime, route.middleStopCount, route.stopDelayPerStop);
                  const roundTripTime = totalTime * 2 + 10; // Including breaks

                  return (
                    <tr key={route.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {route.fromLocation} ↔ {route.toLocation}
                            </p>
                            <p className="text-xs text-gray-500">Route ID: {route.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{route.distance} km</p>
                          <p className="text-gray-500">{route.baseTravelTime} min base time</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{route.middleStopCount} stops</p>
                          <p className="text-gray-500">{route.stopDelayPerStop} min/stop</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-900">{totalTime} min</span>
                            <span className="text-xs text-gray-500">(one way)</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Round trip: {roundTripTime} min
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(route)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </button>
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

      {/* Route Statistics */}
      {routes.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{routes.length}</p>
              </div>
              <RouteIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Distance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(routes.reduce((sum, route) => sum + route.distance, 0) / routes.length)} km
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Travel Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(routes.reduce((sum, route) => 
                    sum + calculateTotalTime(route.baseTravelTime, route.middleStopCount, route.stopDelayPerStop), 0
                  ) / routes.length)} min
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}