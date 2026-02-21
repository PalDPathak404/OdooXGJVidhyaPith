export const mockVehicles = [
  { id: 'v1', name: 'Toyota Hilux', plate: 'MH 01 AB 1234', type: 'Pickup', model: '2023 Edition', capacity: '1.5 Tons', odometer: '12000', status: 'Available', driver: 'Alice Johnson', fuelLevel: '75%', lastService: '2024-01-15' },
  { id: 'v2', name: 'Mercedes Actros', plate: 'MH 12 CD 5678', type: 'Truck', model: 'Heavy Duty 2024', capacity: '25 Tons', odometer: '45000', status: 'Available', driver: 'Bob Smith', fuelLevel: '40%', lastService: '2024-02-10' },
  { id: 'v3', name: 'Ford Transit', plate: 'MH 04 EF 9012', type: 'Van', model: 'V363', capacity: '3.5 Tons', odometer: '28000', status: 'On Trip', driver: 'Charlie Brown', fuelLevel: '90%', lastService: '2024-01-20' },
  { id: 'v4', name: 'Volvo FH16', plate: 'MH 14 GH 3456', type: 'Truck', model: 'Globetrotter', capacity: '30 Tons', odometer: '62000', status: 'In Shop', driver: 'David Wilson', fuelLevel: '65%', lastService: '2024-02-05' },
];

export const mockTrips = [
  { id: 't1', vehicle: 'Toyota Hilux', driver: 'Alice Johnson', origin: 'Nairobi', destination: 'Mombasa', status: 'On Trip', distance: '480 km', startTime: '2024-02-21 08:00' },
  { id: 't2', vehicle: 'Ford Transit', driver: 'Charlie Brown', origin: 'Kisumu', destination: 'Nakuru', status: 'Completed', distance: '180 km', startTime: '2024-02-20 10:00' },
  { id: 't3', vehicle: 'Mercedes Actros', driver: 'Pending', origin: 'Eldoret', destination: 'Nairobi', status: 'Draft', distance: '310 km', startTime: '2024-02-22 09:00' },
];

export const mockMaintenance = [
  { id: '321', vehicle: 'TATA', service: 'Engine Issue', date: '2024-02-20', cost: '10000', status: 'Closed' },
  { id: '322', vehicle: 'Volvo FH16', service: 'Tire Rotation', date: '2024-02-21', cost: '4500', status: 'Open' },
];

export const mockExpenses = [
  { id: 'e1', tripId: 't1', fuelLiters: 45, fuelCost: 5400, maintenanceCost: 0, totalCost: 5400, date: '2024-02-19' },
  { id: 'e2', tripId: 't2', fuelLiters: 20, fuelCost: 2400, maintenanceCost: 1500, totalCost: 3900, date: '2024-02-15' },
];

export const mockDrivers = [
  { id: 'd1', name: 'Alice Johnson', license: 'ABC-123', phone: '0711222333', rating: 4.8, status: 'On Trip' },
  { id: 'd2', name: 'Bob Smith', license: 'XYZ-456', phone: '0722333444', rating: 4.5, status: 'On Duty' },
  { id: 'd3', name: 'Charlie Brown', license: 'DEF-789', phone: '0733444555', rating: 4.9, status: 'On Duty' },
];
