import { create } from 'zustand';
import { 
  mockVehicles, 
  mockTrips, 
  mockMaintenance, 
  mockExpenses, 
  mockDrivers 
} from '../mock/seedData';

const useFleetStore = create((set) => ({
  vehicles: mockVehicles,
  trips: mockTrips,
  maintenance: mockMaintenance,
  expenses: mockExpenses,
  drivers: mockDrivers,
  
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
    const totalCost = Number(expense.fuelCost || 0) + Number(expense.maintenanceCost || 0);
    const newExpense = {
      id: `e${state.expenses.length + 1}`,
      ...expense,
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

  // API Sync Placeholders
  syncData: async () => {
    // This will be implemented with axios/fetch in the next phase
    console.log("Syncing with backend...");
  },
}));

export default useFleetStore;
