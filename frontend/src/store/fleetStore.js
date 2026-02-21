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
    localStorage.setItem('fleet_user', JSON.stringify(user));
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
  
  // Generic filters can be added here
  activePage: 'Dashboard',
  setActivePage: (page) => set({ activePage: page }),
}));

export default useFleetStore;
