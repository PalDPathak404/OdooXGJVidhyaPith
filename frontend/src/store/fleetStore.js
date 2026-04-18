import { create } from 'zustand';
import {
  mockVehicles,
  mockTrips,
  mockMaintenance,
  mockExpenses,
  mockDrivers
} from '../mock/seedData';
import apiRequest from '../utils/api';

const useFleetStore = create((set) => ({
  vehicles: mockVehicles,
  trips: mockTrips,
  maintenance: mockMaintenance,
  expenses: mockExpenses,
  drivers: mockDrivers,

  // Analytics Data (Mocked for trends)
  monthlyData: [
    { month: 'Oct', revenue: 1200000, fuel: 450000, maintenance: 150000, efficiency: 12.4 },
    { month: 'Nov', revenue: 1400000, fuel: 520000, maintenance: 180000, efficiency: 11.8 },
    { month: 'Dec', revenue: 1100000, fuel: 420000, maintenance: 220000, efficiency: 13.2 },
    { month: 'Jan', revenue: 1600000, fuel: 580000, maintenance: 140000, efficiency: 12.9 },
    { month: 'Feb', revenue: 1750000, fuel: 610000, maintenance: 190000, efficiency: 14.1 },
  ],

  // Auth
  currentUser: (() => {
    try {
      const saved = localStorage.getItem('fleet_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse fleet_user from localStorage", e);
      return null;
    }
  })(),
  setAuth: (user) => {
    if (user) {
      localStorage.setItem('fleet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fleet_user');
    }
    set({ currentUser: user });
  },
  logout: () => {
    localStorage.removeItem('fleet_user');
    set({ currentUser: null });
  },

  // Actions
  addVehicle: (vehicle) => set((state) => ({
    vehicles: [
      {
        id: `v${state.vehicles.length + 1}`,
        ...vehicle,
        lastService: new Date().toISOString().split('T')[0]
      },
      ...state.vehicles
    ]
  })),
  updateVehicle: (id, updatedVehicle) => set((state) => ({
    vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updatedVehicle } : v))
  })),
  removeVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter((v) => v.id !== id)
  })),

  addTrip: (trip) => set((state) => {
    // Determine vehicle and driver IDs from the trip object
    // Assuming trip has vehiclePlate or vehicleId and driverName or driverId
    const updatedVehicles = state.vehicles.map(v =>
      v.plate === trip.vehiclePlate ? { ...v, status: 'On Trip' } : v
    );
    const updatedDrivers = state.drivers.map(d =>
      d.name === trip.driverName ? { ...d, status: 'On Trip' } : d
    );

    return {
      trips: [
        {
          id: `t${state.trips.length + 1}`,
          ...trip,
          status: 'On Trip',
          startTime: new Date().toLocaleString()
        },
        ...state.trips
      ],
      vehicles: updatedVehicles,
      drivers: updatedDrivers
    };
  }),

  addMaintenance: (log) => set((state) => {
    const updatedVehicles = state.vehicles.map(v =>
      v.id === log.vehicleId ? { ...v, status: 'In Shop' } : v
    );

    return {
      maintenance: [
        {
          id: `m${state.maintenance.length + 1}`,
          ...log,
          status: 'Open',
        },
        ...state.maintenance
      ],
      vehicles: updatedVehicles
    };
  }),

  addExpense: (expense) => set((state) => {
    const fuelCost = Number(expense.fuelLiters || 0) * Number(expense.fuelPricePerLiter || 0);
    const totalCost = fuelCost + Number(expense.maintenanceCost || 0);

    const newExpense = {
      id: `e${state.expenses.length + 1}`,
      ...expense,
      fuelCost,
      totalCost,
      date: new Date().toISOString().split('T')[0]
    };

    return {
      expenses: [newExpense, ...state.expenses]
    };
  }),

  updateDriverStatus: (id, status) => set((state) => ({
    drivers: state.drivers.map((d) => (d.id === id ? { ...d, status } : d))
  })),

  // Generic filters can be added here
  activePage: 'Dashboard',
  setActivePage: (page) => set({ activePage: page }),

  settings: {
    notifications: true,
    theme: 'dark',
    unitSystem: 'metric'
  },
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // Analytics Selectors
  getAnalytics: () => {
    const state = useFleetStore.getState();

    const totalFuel = state.expenses.reduce((sum, e) => sum + Number(e.fuelCost || 0), 0);
    const totalMaintenance = state.expenses.reduce((sum, e) => sum + Number(e.maintenanceCost || 0), 0);
    const totalExpenses = totalFuel + totalMaintenance;

    // Mock revenue calculation based on trips
    const totalRevenue = state.trips.length * 50000; // Average 50k per trip
    const roi = totalExpenses > 0 ? ((totalRevenue - totalExpenses) / totalExpenses * 100).toFixed(1) : 0;

    const activeCount = state.vehicles.filter(v => v.status !== 'In Shop').length;
    const utilization = ((activeCount / state.vehicles.length) * 100).toFixed(1);

    const vehicleCosts = state.vehicles.map(v => {
      const vExpenses = state.expenses.filter(e => {
        const trip = state.trips.find(t => t.id === e.tripId);
        return trip?.vehicle === v.name;
      });
      return {
        name: v.name,
        cost: vExpenses.reduce((sum, e) => sum + e.totalCost, 0)
      };
    }).sort((a, b) => b.cost - a.cost).slice(0, 5);

    return {
      totalFuel,
      roi,
      utilization,
      vehicleCosts
    };
  },

  // API Sync
  syncData: async () => {
    try {
      const vehicles = await apiRequest('/vehicles');
      const trips = await apiRequest('/trips');
      const drivers = await apiRequest('/drivers');
      const maintenance = await apiRequest('/maintenance');
      const expenses = await apiRequest('/expenses');

      set({ 
        vehicles: vehicles.length > 0 ? vehicles : mockVehicles,
        trips: trips.length > 0 ? trips : mockTrips,
        drivers: drivers.length > 0 ? drivers : mockDrivers,
        maintenance: maintenance.length > 0 ? maintenance : mockMaintenance,
        expenses: expenses.length > 0 ? expenses : mockExpenses
      });
      console.log("Synced with backend successfully");
    } catch (err) {
      console.error("Sync failed, using mock data", err);
    }
  },
}));

export default useFleetStore;
