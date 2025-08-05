import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Bus {
  id: string;
  numberPlate: string;
  homeStand: string;
  maxTripsPerDay: number;
  maxActiveHours: number;
  status: 'active' | 'inactive' | 'maintenance' | 'in-trip';
  assignedRoute?: string;
  currentTrips: number;
  activeHours: number;
  lastUpdated: Date;
}

export interface Route {
  id: string;
  fromLocation: string;
  toLocation: string;
  baseTravelTime: number; // in minutes
  middleStopCount: number;
  stopDelayPerStop: number; // in minutes
  distance: number; // in km
}

export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  departureTime: Date;
  estimatedArrivalTime: Date;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  isReturnTrip: boolean;
  includesLunchBreak: boolean;
  status: 'scheduled' | 'running' | 'completed' | 'cancelled' | 'delayed';
  tripNumber: number;
  delayMinutes?: number;
}

interface DataContextType {
  buses: Bus[];
  routes: Route[];
  trips: Trip[];
  addBus: (bus: Omit<Bus, 'id' | 'currentTrips' | 'activeHours' | 'lastUpdated'>) => void;
  updateBus: (id: string, updates: Partial<Bus>) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  markDeparture: (tripId: string) => void;
  markArrival: (tripId: string) => void;
  cancelTrip: (tripId: string) => void;
  generateDailySchedule: () => void;
  getBusCurrentTrip: (busId: string) => Trip | undefined;
  getRouteById: (id: string) => Route | undefined;
  getBusById: (id: string) => Bus | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Enhanced mock data for comprehensive testing
const initialBuses: Bus[] = [
  {
    id: '1',
    numberPlate: 'WB 02 AB 1234',
    homeStand: 'Asansol',
    maxTripsPerDay: 14,
    maxActiveHours: 12,
    status: 'active',
    assignedRoute: '1',
    currentTrips: 3,
    activeHours: 4.5,
    lastUpdated: new Date()
  },
  {
    id: '2',
    numberPlate: 'WB 02 CD 5678',
    homeStand: 'Raniganj',
    maxTripsPerDay: 12,
    maxActiveHours: 11,
    status: 'active',
    assignedRoute: '1',
    currentTrips: 2,
    activeHours: 3.2,
    lastUpdated: new Date()
  },
  {
    id: '3',
    numberPlate: 'WB 02 EF 9012',
    homeStand: 'Durgapur',
    maxTripsPerDay: 14,
    maxActiveHours: 12,
    status: 'maintenance',
    assignedRoute: '2',
    currentTrips: 0,
    activeHours: 0,
    lastUpdated: new Date()
  },
  {
    id: '4',
    numberPlate: 'WB 02 GH 3456',
    homeStand: 'Asansol',
    maxTripsPerDay: 13,
    maxActiveHours: 11,
    status: 'active',
    assignedRoute: '3',
    currentTrips: 4,
    activeHours: 5.1,
    lastUpdated: new Date()
  },
  {
    id: '5',
    numberPlate: 'WB 02 IJ 7890',
    homeStand: 'Burnpur',
    maxTripsPerDay: 12,
    maxActiveHours: 10,
    status: 'inactive',
    assignedRoute: '3',
    currentTrips: 0,
    activeHours: 0,
    lastUpdated: new Date()
  }
];

const initialRoutes: Route[] = [
  {
    id: '1',
    fromLocation: 'Asansol',
    toLocation: 'Raniganj',
    baseTravelTime: 45,
    middleStopCount: 12,
    stopDelayPerStop: 1,
    distance: 25
  },
  {
    id: '2',
    fromLocation: 'Durgapur',
    toLocation: 'Andal',
    baseTravelTime: 35,
    middleStopCount: 8,
    stopDelayPerStop: 1,
    distance: 18
  },
  {
    id: '3',
    fromLocation: 'Burnpur',
    toLocation: 'Kulti',
    baseTravelTime: 25,
    middleStopCount: 6,
    stopDelayPerStop: 1,
    distance: 12
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>(() => {
    const saved = localStorage.getItem('busDispatchBuses');
    return saved ? JSON.parse(saved) : initialBuses;
  });
  
  const [routes, setRoutes] = useState<Route[]>(() => {
    const saved = localStorage.getItem('busDispatchRoutes');
    return saved ? JSON.parse(saved) : initialRoutes;
  });
  
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('busDispatchTrips');
    if (saved) {
      const parsedTrips = JSON.parse(saved);
      // Convert date strings back to Date objects
      return parsedTrips.map((trip: any) => ({
        ...trip,
        departureTime: new Date(trip.departureTime),
        estimatedArrivalTime: new Date(trip.estimatedArrivalTime),
        actualDepartureTime: trip.actualDepartureTime ? new Date(trip.actualDepartureTime) : undefined,
        actualArrivalTime: trip.actualArrivalTime ? new Date(trip.actualArrivalTime) : undefined
      }));
    }
    return [];
  });

  // Generate initial trips on component mount if none exist
  useEffect(() => {
    if (trips.length === 0) {
      generateDailySchedule();
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('busDispatchBuses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('busDispatchRoutes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('busDispatchTrips', JSON.stringify(trips));
  }, [trips]);

  const addBus = (busData: Omit<Bus, 'id' | 'currentTrips' | 'activeHours' | 'lastUpdated'>) => {
    const newBus: Bus = {
      ...busData,
      id: Date.now().toString(),
      currentTrips: 0,
      activeHours: 0,
      lastUpdated: new Date()
    };
    setBuses(prev => [...prev, newBus]);
  };

  const updateBus = (id: string, updates: Partial<Bus>) => {
    setBuses(prev => prev.map(bus => 
      bus.id === id ? { ...bus, ...updates, lastUpdated: new Date() } : bus
    ));
  };

  const addRoute = (routeData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...routeData,
      id: Date.now().toString()
    };
    setRoutes(prev => [...prev, newRoute]);
  };

  const updateRoute = (id: string, updates: Partial<Route>) => {
    setRoutes(prev => prev.map(route => 
      route.id === id ? { ...route, ...updates } : route
    ));
  };

  const addTrip = (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString()
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...updates } : trip
    ));
  };

  const markDeparture = (tripId: string) => {
    const now = new Date();
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) return;

    const scheduledTime = trip.departureTime;
    const delayMinutes = Math.max(0, Math.floor((now.getTime() - scheduledTime.getTime()) / (1000 * 60)));
    
    // Check delay limits based on business rules
    const maxDelay = trip.tripNumber === 1 ? 8 : 5; // First trip allows 8 min, others 5 min
    
    if (delayMinutes > maxDelay) {
      // Cancel trip if too delayed
      setTrips(prev => prev.map(t => 
        t.id === tripId 
          ? { ...t, status: 'cancelled' as const, delayMinutes }
          : t
      ));
      
      // Update bus status
      updateBus(trip.busId, { status: 'active' });
      return;
    }
    
    // Mark as departed with delay info
    setTrips(prev => prev.map(t => 
      t.id === tripId 
        ? { 
            ...t, 
            status: 'running' as const, 
            actualDepartureTime: now,
            delayMinutes: delayMinutes > 0 ? delayMinutes : undefined
          }
        : t
    ));

    // Update bus status to in-trip
    updateBus(trip.busId, { status: 'in-trip' });
  };

  const markArrival = (tripId: string) => {
    const now = new Date();
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) return;

    // Mark trip as completed
    setTrips(prev => prev.map(t => 
      t.id === tripId 
        ? { 
            ...t, 
            status: 'completed' as const, 
            actualArrivalTime: now 
          }
        : t
    ));

    const bus = buses.find(b => b.id === trip.busId);
    const route = routes.find(r => r.id === trip.routeId);
    
    if (bus && route) {
      // Calculate actual travel time
      const actualTravelTime = trip.actualDepartureTime 
        ? Math.floor((now.getTime() - trip.actualDepartureTime.getTime()) / (1000 * 60))
        : route.baseTravelTime + (route.middleStopCount * route.stopDelayPerStop);

      // Update bus stats
      const newActiveHours = bus.activeHours + (actualTravelTime / 60);
      const newCurrentTrips = bus.currentTrips + 1;

      updateBus(trip.busId, { 
        status: 'active',
        currentTrips: newCurrentTrips,
        activeHours: newActiveHours
      });

      // Auto-generate next trip if within limits and hours
      if (newCurrentTrips < bus.maxTripsPerDay && newActiveHours < bus.maxActiveHours) {
        const currentHour = now.getHours();
        
        // Don't schedule new trips after 9 PM
        if (currentHour < 21) {
          // Determine break time based on special rules
          let breakTime = 5; // Default 5-minute break
          
          // Check if it's lunch time (around 6-8 trips in)
          if (newCurrentTrips >= Math.floor(bus.maxTripsPerDay / 2) && 
              newCurrentTrips <= Math.floor(bus.maxTripsPerDay / 2) + 1) {
            breakTime = 30; // 30-minute lunch break
          }
          
          // Special rule for Raniganj buses at Asansol stand
          if (bus.homeStand === 'Raniganj' && 
              ((trip.isReturnTrip && route.fromLocation === 'Raniganj') || 
               (!trip.isReturnTrip && route.toLocation === 'Asansol'))) {
            breakTime = Math.min(breakTime, 5); // Maximum 5 minutes at foreign stand
          }

          const nextDepartureTime = new Date(now.getTime() + breakTime * 60 * 1000);
          const totalTravelTime = route.baseTravelTime + (route.middleStopCount * route.stopDelayPerStop);
          const estimatedArrival = new Date(nextDepartureTime.getTime() + totalTravelTime * 60 * 1000);
          
          const returnTrip: Trip = {
            id: (Date.now() + Math.random()).toString(),
            busId: trip.busId,
            routeId: trip.routeId,
            departureTime: nextDepartureTime,
            estimatedArrivalTime: estimatedArrival,
            isReturnTrip: !trip.isReturnTrip,
            includesLunchBreak: breakTime === 30,
            status: 'scheduled',
            tripNumber: newCurrentTrips + 1
          };
          
          addTrip(returnTrip);
        }
      }
    }
  };

  const cancelTrip = (tripId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, status: 'cancelled' as const } : trip
    ));
    
    // Update bus status back to active if it was scheduled to depart
    const trip = trips.find(t => t.id === tripId);
    if (trip && trip.status === 'scheduled') {
      updateBus(trip.busId, { status: 'active' });
    }
  };

  const generateDailySchedule = () => {
    const today = new Date();
    const startTime = new Date(today.setHours(6, 0, 0, 0)); // Start at 6 AM
    
    // Clear existing trips for today
    const todayString = startTime.toDateString();
    setTrips(prev => prev.filter(trip => 
      trip.departureTime.toDateString() !== todayString
    ));
    
    const newTrips: Trip[] = [];
    
    // Reset bus stats for the day
    setBuses(prev => prev.map(bus => ({
      ...bus,
      currentTrips: 0,
      activeHours: 0,
      status: bus.status === 'in-trip' ? 'active' : bus.status,
      lastUpdated: new Date()
    })));
    
    buses.forEach(bus => {
      if (bus.status === 'active' && bus.assignedRoute) {
        const route = routes.find(r => r.id === bus.assignedRoute);
        if (!route) return;
        
        let currentTime = new Date(startTime);
        let tripCount = 0;
        let isReturnTrip = false;
        let totalActiveHours = 0;
        
        // Stagger start times to avoid conflicts
        const busIndex = buses.findIndex(b => b.id === bus.id);
        currentTime = new Date(currentTime.getTime() + (busIndex * 10 * 60 * 1000)); // 10 min stagger
        
        while (tripCount < bus.maxTripsPerDay && 
               currentTime.getHours() < 22 && 
               totalActiveHours < bus.maxActiveHours) {
          
          const totalTravelTime = route.baseTravelTime + (route.middleStopCount * route.stopDelayPerStop);
          const estimatedArrival = new Date(currentTime.getTime() + totalTravelTime * 60 * 1000);
          
          // Check if lunch break is needed (middle of the day)
          const isLunchBreakTrip = tripCount === Math.floor(bus.maxTripsPerDay / 2);
          
          const trip: Trip = {
            id: `${bus.id}-${tripCount}-${Date.now()}-${Math.random()}`,
            busId: bus.id,
            routeId: route.id,
            departureTime: new Date(currentTime),
            estimatedArrivalTime: estimatedArrival,
            isReturnTrip,
            includesLunchBreak: isLunchBreakTrip,
            status: 'scheduled',
            tripNumber: tripCount + 1
          };
          
          newTrips.push(trip);
          
          // Calculate next departure time
          let breakTime = 5; // Default 5-minute break
          
          if (isLunchBreakTrip) {
            breakTime = 30; // 30-minute lunch break
          }
          
          // Special rule for Raniganj buses at foreign stands
          if (bus.homeStand === 'Raniganj' && 
              ((isReturnTrip && route.fromLocation === 'Raniganj') || 
               (!isReturnTrip && route.toLocation === 'Asansol'))) {
            breakTime = Math.min(breakTime, 5);
          }
          
          currentTime = new Date(estimatedArrival.getTime() + breakTime * 60 * 1000);
          totalActiveHours += (totalTravelTime + breakTime) / 60;
          
          tripCount++;
          isReturnTrip = !isReturnTrip;
        }
      }
    });
    
    setTrips(prev => [...prev, ...newTrips]);
  };

  const getBusCurrentTrip = (busId: string): Trip | undefined => {
    return trips.find(trip => 
      trip.busId === busId && 
      (trip.status === 'running' || trip.status === 'scheduled')
    );
  };

  const getRouteById = (id: string): Route | undefined => {
    return routes.find(route => route.id === id);
  };

  const getBusById = (id: string): Bus | undefined => {
    return buses.find(bus => bus.id === id);
  };

  return (
    <DataContext.Provider value={{
      buses,
      routes,
      trips,
      addBus,
      updateBus,
      addRoute,
      updateRoute,
      addTrip,
      updateTrip,
      markDeparture,
      markArrival,
      cancelTrip,
      generateDailySchedule,
      getBusCurrentTrip,
      getRouteById,
      getBusById
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}