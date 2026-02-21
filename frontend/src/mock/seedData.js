export const mockVehicles = [
  { id: 'v1', name: 'Toyota Hilux', plate: 'KAA 123A', type: 'Pickup', status: 'On Trip', driver: 'Alice Johnson', fuelLevel: '75%', lastService: '2024-01-15' },
  { id: 'v2', name: 'Mercedes Actros', plate: 'KBB 456B', type: 'Truck', status: 'In Shop', driver: 'Bob Smith', fuelLevel: '40%', lastService: '2024-02-10' },
  { id: 'v3', name: 'Ford Transit', plate: 'KCC 789C', type: 'Van', status: 'On Trip', driver: 'Charlie Brown', fuelLevel: '90%', lastService: '2024-01-20' },
  { id: 'v4', name: 'Volvo FH16', plate: 'KDD 012D', type: 'Truck', status: 'On Trip', driver: 'David Wilson', fuelLevel: '65%', lastService: '2024-02-05' },
];

export const mockTrips = [
  { id: 't1', vehicle: 'Toyota Hilux', driver: 'Alice Johnson', origin: 'Nairobi', destination: 'Mombasa', status: 'On Trip', distance: '480 km', startTime: '2024-02-21 08:00' },
  { id: 't2', vehicle: 'Ford Transit', driver: 'Charlie Brown', origin: 'Kisumu', destination: 'Nakuru', status: 'Completed', distance: '180 km', startTime: '2024-02-20 10:00' },
  { id: 't3', vehicle: 'Mercedes Actros', driver: 'Pending', origin: 'Eldoret', destination: 'Nairobi', status: 'Draft', distance: '310 km', startTime: '2024-02-22 09:00' },
];

export const mockMaintenance = [
  { id: 'm1', vehicle: 'Mercedes Actros', service: 'Engine Oil Change', date: '2024-02-25', priority: 'High', status: 'Pending' },
  { id: 'm2', vehicle: 'Volvo FH16', service: 'Tire Rotation', date: '2024-03-01', priority: 'Medium', status: 'Scheduled' },
];

export const mockExpenses = [
  { id: 'e1', category: 'Fuel', amount: '$450', date: '2024-02-19', vehicle: 'Toyota Hilux', description: 'Petrol station X' },
  { id: 'e2', category: 'Repair', amount: '$1200', date: '2024-02-15', vehicle: 'Mercedes Actros', description: 'Gearbox fix' },
];

export const mockDrivers = [
  { id: 'd1', name: 'Alice Johnson', license: 'ABC-123', phone: '0711222333', rating: 4.8, status: 'On Trip' },
  { id: 'd2', name: 'Bob Smith', license: 'XYZ-456', phone: '0722333444', rating: 4.5, status: 'Break' },
  { id: 'd3', name: 'Charlie Brown', license: 'DEF-789', phone: '0733444555', rating: 4.9, status: 'Available' },
];
