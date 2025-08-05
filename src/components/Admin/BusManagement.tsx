import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Bus, 
  Plus, 
  Edit, 
  Save, 
  X, 
  MapPin,
  Clock,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function BusManagement() {
  const { buses, routes, addBus, updateBus } = useData();
  const [isAddingBus, setIsAddingBus] = useState(false);
  const [editingBus, setEditingBus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    numberPlate: '',
    homeStand: '',
    maxTripsPerDay: 14,
    maxActiveHours: 12,
    status: 'inactive' as 'active' | 'inactive' | 'maintenance',
    assignedRoute: ''
  });

  const homeStands = ['Asansol', 'Raniganj', 'Durgapur', 'Andal', 'Burnpur', 'Kulti'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('max') || name.includes('Max') 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBus) {
      updateBus(editingBus, formData);
      setEditingBus(null);
    } else {
      addBus(formData);
      setIsAddingBus(false);
    }
    
    setFormData({
      numberPlate: '',
      homeStand: '',
      maxTripsPerDay: 14,
      maxActiveHours: 12,
      status: 'inactive',
      assignedRoute: ''
    });
  };

  const handleEdit = (bus: any) => {
    setFormData({
      numberPlate: bus.numberPlate,
      homeStand: bus.homeStand,
      maxTripsPerDay: bus.maxTripsPerDay,
      maxActiveHours: bus.maxActiveHours,
      status: bus.status,
      assignedRoute: bus.assignedRoute || ''
    });
    setEditingBus(bus.id);
    setIsAddingBus(false);
  };

  const handleCancel = () => {
    setIsAddingBus(false);
    setEditingBus(null);
    setFormData({
      numberPlate: '',
      homeStand: '',
      maxTripsPerDay: 14,
      maxActiveHours: 12,
      status: 'inactive',
      assignedRoute: ''
    });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bus Fleet Management</h1>
          <p className="text-gray-600">Manage your bus fleet configuration and assignments</p>
        </div>
        
        {!isAddingBus && !editingBus && (
          <button
            onClick={() => setIsAddingBus(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Bus
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingBus || editingBus) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingBus ? 'Edit Bus' : 'Add New Bus'}
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
                <label htmlFor="numberPlate" className="block text-sm font-medium text-gray-700 mb-2">
                  Number Plate *
                </label>
                <input
                  type="text"
                  id="numberPlate"
                  name="numberPlate"
                  value={formData.numberPlate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="e.g., WB 02 AB 1234"
                  required
                />
              </div>

              <div>
                <label htmlFor="homeStand" className="block text-sm font-medium text-gray-700 mb-2">
                  Home Stand *
                </label>
                <select
                  id="homeStand"
                  name="homeStand"
                  value={formData.homeStand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Home Stand</option>
                  {homeStands.map(stand => (
                    <option key={stand} value={stand}>{stand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="maxTripsPerDay" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Trips Per Day *
                </label>
                <input
                  type="number"
                  id="maxTripsPerDay"
                  name="maxTripsPerDay"
                  value={formData.maxTripsPerDay}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="8"
                  max="20"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxActiveHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Active Hours Per Day *
                </label>
                <input
                  type="number"
                  id="maxActiveHours"
                  name="maxActiveHours"
                  value={formData.maxActiveHours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="8"
                  max="16"
                  required
                />
              </div>

              <div>
                <label htmlFor="assignedRoute" className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Route
                </label>
                <select
                  id="assignedRoute"
                  name="assignedRoute"
                  value={formData.assignedRoute}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Route Assigned</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.fromLocation} ↔ {route.toLocation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingBus ? 'Update Bus' : 'Save Bus'}
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

      {/* Bus Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-blue-600">{buses.length}</p>
            </div>
            <Bus className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Buses</p>
              <p className="text-2xl font-bold text-green-600">
                {buses.filter(bus => bus.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Maintenance</p>
              <p className="text-2xl font-bold text-red-600">
                {buses.filter(bus => bus.status === 'maintenance').length}
              </p>
            </div>
            <Settings className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Route Assigned</p>
              <p className="text-2xl font-bold text-purple-600">
                {buses.filter(bus => bus.assignedRoute).length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Bus List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Fleet Details</h3>
          <p className="text-sm text-gray-600">Manage individual bus configurations and status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Home Stand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today's Usage
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
              {buses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Bus className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">No buses in fleet</p>
                        <p className="text-gray-500">Add your first bus to get started</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                buses.map((bus) => {
                  const tripUtilization = (bus.currentTrips / bus.maxTripsPerDay) * 100;
                  const hoursUtilization = (bus.activeHours / bus.maxActiveHours) * 100;
                  const assignedRoute = bus.assignedRoute ? routes.find(r => r.id === bus.assignedRoute) : null;

                  return (
                    <tr key={bus.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {bus.numberPlate.slice(-2)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{bus.numberPlate}</p>
                            <p className="text-xs text-gray-500">ID: {bus.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{bus.homeStand}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <p><span className="text-gray-500">Trips:</span> {bus.maxTripsPerDay}/day</p>
                          <p><span className="text-gray-500">Hours:</span> {bus.maxActiveHours}h/day</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Trips</span>
                              <span className={getUtilizationColor(tripUtilization)}>
                                {bus.currentTrips}/{bus.maxTripsPerDay}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(tripUtilization, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Hours</span>
                              <span className={getUtilizationColor(hoursUtilization)}>
                                {bus.activeHours.toFixed(1)}h/{bus.maxActiveHours}h
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(hoursUtilization, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bus.status)}`}>
                            {bus.status.charAt(0).toUpperCase() + bus.status.slice(1).replace('-', ' ')}
                          </span>
                          {assignedRoute && (
                            <p className="text-xs text-gray-500">
                              Route: {assignedRoute.fromLocation} ↔ {assignedRoute.toLocation}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(bus)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
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