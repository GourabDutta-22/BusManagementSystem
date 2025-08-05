import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Calendar, 
  Bus, 
  Clock, 
  TrendingUp,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Reports() {
  const { buses, routes, trips } = useData();
  const { formatTime } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  // Filter trips based on date range and route
  const filteredTrips = trips.filter(trip => {
    const tripDate = trip.departureTime.toISOString().split('T')[0];
    const dateMatch = tripDate >= dateRange.start && tripDate <= dateRange.end;
    const routeMatch = selectedRoute === 'all' || trip.routeId === selectedRoute;
    return dateMatch && routeMatch;
  });

  // Calculate statistics
  const totalTrips = filteredTrips.length;
  const completedTrips = filteredTrips.filter(trip => trip.status === 'completed').length;
  const cancelledTrips = filteredTrips.filter(trip => trip.status === 'cancelled').length;
  const runningTrips = filteredTrips.filter(trip => trip.status === 'running').length;
  const scheduledTrips = filteredTrips.filter(trip => trip.status === 'scheduled').length;

  const completionRate = totalTrips > 0 ? (completedTrips / totalTrips) * 100 : 0;
  const cancellationRate = totalTrips > 0 ? (cancelledTrips / totalTrips) * 100 : 0;

  // Bus performance metrics
  const busPerformance = buses.map(bus => {
    const busTrips = filteredTrips.filter(trip => trip.busId === bus.id);
    const busCompleted = busTrips.filter(trip => trip.status === 'completed').length;
    const busCancelled = busTrips.filter(trip => trip.status === 'cancelled').length;
    
    return {
      ...bus,
      totalTrips: busTrips.length,
      completedTrips: busCompleted,
      cancelledTrips: busCancelled,
      completionRate: busTrips.length > 0 ? (busCompleted / busTrips.length) * 100 : 0
    };
  }).sort((a, b) => b.totalTrips - a.totalTrips);

  // Route performance metrics
  const routePerformance = routes.map(route => {
    const routeTrips = filteredTrips.filter(trip => trip.routeId === route.id);
    const routeCompleted = routeTrips.filter(trip => trip.status === 'completed').length;
    const routeCancelled = routeTrips.filter(trip => trip.status === 'cancelled').length;
    
    return {
      ...route,
      totalTrips: routeTrips.length,
      completedTrips: routeCompleted,
      cancelledTrips: routeCancelled,
      completionRate: routeTrips.length > 0 ? (routeCompleted / routeTrips.length) * 100 : 0
    };
  }).sort((a, b) => b.totalTrips - a.totalTrips);

  // Delay analysis
  const delayedTrips = filteredTrips.filter(trip => trip.delayMinutes && trip.delayMinutes > 0);
  const avgDelay = delayedTrips.length > 0 
    ? delayedTrips.reduce((sum, trip) => sum + (trip.delayMinutes || 0), 0) / delayedTrips.length 
    : 0;

  // const exportData = () => {
  //   const data = {
  //     period: `${dateRange.start} to ${dateRange.end}`,
  //     summary: {
  //       totalTrips,
  //       completedTrips,
  //       cancelledTrips,
  //       completionRate: Math.round(completionRate),
  //       cancellationRate: Math.round(cancellationRate),
  //       avgDelay: Math.round(avgDelay)
  //     },
  //     busPerformance,
  //     routePerformance,
  //     generatedAt: new Date().toISOString()
  //   };
    
  //   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `bus-dispatch-report-${dateRange.start}-${dateRange.end}.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  const exportData = () => {
  const data = {
    period: `${dateRange.start} to ${dateRange.end}`,
    summary: {
      totalTrips,
      completedTrips,
      cancelledTrips,
      completionRate: Math.round(completionRate),
      cancellationRate: Math.round(cancellationRate),
      avgDelay: Math.round(avgDelay)
    },
    busPerformance,
    routePerformance,
    generatedAt: new Date().toISOString()
  };

  // Flatten data for Excel (each sheet must be tabular)
  const summarySheet = [
    { Key: "Period", Value: data.period },
    ...Object.entries(data.summary).map(([key, value]) => ({
      Key: key,
      Value: value
    })),
    { Key: "Generated At", Value: data.generatedAt }
  ];

  const busSheet = data.busPerformance || [];
  const routeSheet = data.routePerformance || [];

  const wb = XLSX.utils.book_new();

  // Add sheets to workbook
  const summaryWS = XLSX.utils.json_to_sheet(summarySheet);
  const busWS = XLSX.utils.json_to_sheet(busSheet);
  const routeWS = XLSX.utils.json_to_sheet(routeSheet);

  XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");
  XLSX.utils.book_append_sheet(wb, busWS, "Bus Performance");
  XLSX.utils.book_append_sheet(wb, routeWS, "Route Performance");

  // Write the workbook and trigger download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, 'Performance_Report.xlsx');
};



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <label htmlFor="start-date" className="text-sm font-medium text-gray-700">
                From:
              </label>
              <input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                To:
              </label>
              <input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <label htmlFor="route-filter" className="text-sm font-medium text-gray-700">
                Route:
              </label>
              <select
                id="route-filter"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Routes</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.fromLocation} ↔ {route.toLocation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-3xl font-bold text-blue-600">{totalTrips}</p>
              <p className="text-sm text-gray-500">in selected period</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">{Math.round(completionRate)}%</p>
              <p className="text-sm text-green-600">{completedTrips} completed</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancellation Rate</p>
              <p className="text-3xl font-bold text-red-600">{Math.round(cancellationRate)}%</p>
              <p className="text-sm text-red-600">{cancelledTrips} cancelled</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Delay</p>
              <p className="text-3xl font-bold text-amber-600">{Math.round(avgDelay)} min</p>
              <p className="text-sm text-amber-600">{delayedTrips.length} delayed trips</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bus Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Bus Performance</h3>
            <p className="text-sm text-gray-600">Individual bus statistics</p>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {busPerformance.slice(0, 10).map((bus) => (
                  <tr key={bus.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bus.numberPlate}</p>
                        <p className="text-xs text-gray-500">{bus.homeStand}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="font-medium">{bus.totalTrips}</p>
                        <p className="text-xs text-gray-500">
                          {bus.completedTrips}C / {bus.cancelledTrips}X
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${
                          bus.completionRate >= 90 ? 'text-green-600' :
                          bus.completionRate >= 70 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {Math.round(bus.completionRate)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Route Performance</h3>
            <p className="text-sm text-gray-600">Route-wise statistics</p>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {routePerformance.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {route.fromLocation} ↔ {route.toLocation}
                          </p>
                          <p className="text-xs text-gray-500">{route.distance} km</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="font-medium">{route.totalTrips}</p>
                        <p className="text-xs text-gray-500">
                          {route.completedTrips}C / {route.cancelledTrips}X
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${
                        route.completionRate >= 90 ? 'text-green-600' :
                        route.completionRate >= 70 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(route.completionRate)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Current Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Active Operations</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Running Trips:</span>
                <span className="text-sm font-medium text-blue-600">{runningTrips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Scheduled Trips:</span>
                <span className="text-sm font-medium text-amber-600">{scheduledTrips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Buses:</span>
                <span className="text-sm font-medium text-green-600">
                  {buses.filter(bus => bus.status === 'active' || bus.status === 'in-trip').length}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Fleet Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">In Maintenance:</span>
                <span className="text-sm font-medium text-red-600">
                  {buses.filter(bus => bus.status === 'maintenance').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Inactive:</span>
                <span className="text-sm font-medium text-gray-600">
                  {buses.filter(bus => bus.status === 'inactive').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Fleet:</span>
                <span className="text-sm font-medium text-gray-900">{buses.length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Routes</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Routes:</span>
                <span className="text-sm font-medium text-gray-900">{routes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Distance:</span>
                <span className="text-sm font-medium text-gray-900">
                  {routes.length > 0 ? Math.round(routes.reduce((sum, route) => sum + route.distance, 0) / routes.length) : 0} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Travel Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {routes.length > 0 ? Math.round(routes.reduce((sum, route) => 
                    sum + route.baseTravelTime + (route.middleStopCount * route.stopDelayPerStop), 0
                  ) / routes.length) : 0} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}