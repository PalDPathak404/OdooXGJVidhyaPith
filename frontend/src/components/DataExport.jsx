import React, { useState } from 'react';
import { Download, FileText, Database, Calendar, Filter } from 'lucide-react';

const DataExport = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedData, setSelectedData] = useState({
    vehicles: true,
    trips: true,
    maintenance: false,
    expenses: false,
    drivers: true
  });

  const exportOptions = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', icon: Database, description: 'Microsoft Excel format' },
    { value: 'json', label: 'JSON', icon: FileText, description: 'JavaScript Object Notation' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable Document Format' }
  ];

  const dateRanges = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const dataTypes = [
    { key: 'vehicles', label: 'Vehicle Fleet', count: 45 },
    { key: 'trips', label: 'Trip Records', count: 128 },
    { key: 'maintenance', label: 'Maintenance Logs', count: 23 },
    { key: 'expenses', label: 'Expense Reports', count: 89 },
    { key: 'drivers', label: 'Driver Information', count: 12 }
  ];

  const handleExport = () => {
    // Simulate export process
    const selectedTypes = Object.keys(selectedData).filter(key => selectedData[key]);
    const exportData = {
      format: exportFormat,
      dateRange: dateRange,
      dataTypes: selectedTypes,
      timestamp: new Date().toISOString(),
      // Add sample data based on selected types
      vehicles: selectedData.vehicles ? [
        { id: 'VH-001', name: 'Alpha Transport', status: 'Active', mileage: 45000 },
        { id: 'VH-002', name: 'Beta Hauler', status: 'On Trip', mileage: 32000 }
      ] : [],
      trips: selectedData.trips ? [
        { id: 'TR-001', vehicle: 'Alpha Transport', origin: 'Warehouse A', destination: 'Port Terminal', status: 'In Progress' },
        { id: 'TR-002', vehicle: 'Beta Hauler', origin: 'Distribution Center B', destination: 'Airport', status: 'Completed' }
      ] : [],
      maintenance: selectedData.maintenance ? [
        { id: 'MT-001', vehicle: 'VH-003', type: 'Oil Change', date: '2024-01-15', cost: 150 },
        { id: 'MT-002', vehicle: 'VH-001', type: 'Tire Replacement', date: '2024-01-10', cost: 800 }
      ] : [],
      expenses: selectedData.expenses ? [
        { id: 'EX-001', category: 'Fuel', amount: 2500, date: '2024-01-20', vehicle: 'VH-001' },
        { id: 'EX-002', category: 'Maintenance', amount: 950, date: '2024-01-15', vehicle: 'VH-003' }
      ] : [],
      drivers: selectedData.drivers ? [
        { id: 'DR-001', name: 'John Smith', license: 'CDL-A', status: 'On Duty', trips: 45 },
        { id: 'DR-002', name: 'Sarah Johnson', license: 'CDL-B', status: 'Available', trips: 32 }
      ] : []
    };

    console.log('Exporting data:', exportData);

    let dataStr, mimeType, fileName;

    switch (exportFormat) {
      case 'csv':
        // Simple CSV export
        dataStr = 'Type,ID,Name,Status,Date,Amount\n';
        if (selectedData.vehicles) {
          exportData.vehicles.forEach(v => {
            dataStr += `Vehicle,${v.id},${v.name},${v.status},,${v.mileage}\n`;
          });
        }
        if (selectedData.trips) {
          exportData.trips.forEach(t => {
            dataStr += `Trip,${t.id},${t.vehicle},${t.status},,\n`;
          });
        }
        mimeType = 'text/csv';
        fileName = `fleetedge-export-${Date.now()}.csv`;
        break;
      
      case 'excel':
        // For now, export as CSV (would need a library like xlsx for real Excel)
        dataStr = 'Type,ID,Name,Status,Date,Amount\n';
        if (selectedData.vehicles) {
          exportData.vehicles.forEach(v => {
            dataStr += `Vehicle,${v.id},${v.name},${v.status},,${v.mileage}\n`;
          });
        }
        mimeType = 'application/vnd.ms-excel';
        fileName = `fleetedge-export-${Date.now()}.xls`;
        break;
      
      case 'pdf':
        // Simple PDF-like text export (would need a library like jsPDF for real PDF)
        dataStr = `
FLEETEDGE - Fleet Management System Export
Generated: ${new Date().toLocaleString()}
Format: PDF
Date Range: ${dateRange}

${selectedData.vehicles ? `
=== VEHICLE FLEET ===
${exportData.vehicles.map(v => 
  `ID: ${v.id}\nName: ${v.name}\nStatus: ${v.status}\nMileage: ${v.mileage}\n`
).join('\n')}
` : ''}

${selectedData.trips ? `
=== TRIP RECORDS ===
${exportData.trips.map(t => 
  `ID: ${t.id}\nVehicle: ${t.vehicle}\nOrigin: ${t.origin}\nDestination: ${t.destination}\nStatus: ${t.status}\n`
).join('\n')}
` : ''}

${selectedData.maintenance ? `
=== MAINTENANCE LOGS ===
${exportData.maintenance.map(m => 
  `ID: ${m.id}\nVehicle: ${m.vehicle}\nType: ${m.type}\nDate: ${m.date}\nCost: $${m.cost}\n`
).join('\n')}
` : ''}

${selectedData.expenses ? `
=== EXPENSE REPORTS ===
${exportData.expenses.map(e => 
  `ID: ${e.id}\nCategory: ${e.category}\nAmount: $${e.amount}\nDate: ${e.date}\nVehicle: ${e.vehicle}\n`
).join('\n')}
` : ''}

${selectedData.drivers ? `
=== DRIVER INFORMATION ===
${exportData.drivers.map(d => 
  `ID: ${d.id}\nName: ${d.name}\nLicense: ${d.license}\nStatus: ${d.status}\nTrips: ${d.trips}\n`
).join('\n')}
` : ''}

---
End of Report
        `;
        mimeType = 'application/pdf';
        fileName = `fleetedge-export-${Date.now()}.pdf`;
        break;
      
      default:
      case 'json':
        dataStr = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        fileName = `fleetedge-export-${Date.now()}.json`;
        break;
    }

    // Create and download file
    const dataBlob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-elevated p-8 border border-border/30 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/2 rounded-full -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 bg-surface-elevated rounded-xl border border-border shadow-inner text-primary">
          <Download size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-black text-text-primary tracking-tight">Data Export Center</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Operational records extraction protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Format */}
        <div className="space-y-4">
          <h4 className="font-semibold text-text-primary flex items-center gap-2">
            <FileText size={16} />
            Export Format
          </h4>
          <div className="space-y-2">
            {exportOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface-elevated cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={option.value}
                  checked={exportFormat === option.value}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <option.icon size={16} className="text-primary" />
                    <span className="font-medium text-text-primary">{option.label}</span>
                  </div>
                  <p className="text-xs text-text-muted">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-4">
          <h4 className="font-semibold text-text-primary flex items-center gap-2">
            <Calendar size={16} />
            Date Range
          </h4>
          <div className="space-y-2">
            {dateRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-elevated cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="dateRange"
                  value={range.value}
                  checked={dateRange === range.value}
                  onChange={(e) => setDateRange(e.target.value)}
                />
                <span className="text-sm text-text-primary">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Selection */}
        <div className="space-y-4">
          <h4 className="font-semibold text-text-primary flex items-center gap-2">
            <Filter size={16} />
            Select Data
          </h4>
          <div className="space-y-3">
            {dataTypes.map((type) => (
              <label
                key={type.key}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedData[type.key] ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'bg-surface-elevated border-border'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-surface"
                    checked={selectedData[type.key]}
                    onChange={(e) => setSelectedData(prev => ({
                      ...prev,
                      [type.key]: e.target.checked
                    }))}
                  />
                  <span className="text-sm font-bold text-text-primary">{type.label}</span>
                </div>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-surface px-2 py-1 rounded-lg border border-border/50">
                  {type.count} records
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Export Summary */}
      <div className="mt-8 p-6 bg-surface-elevated rounded-2xl border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Database size={64} />
        </div>
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Export Summary Payload</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Format</span>
            <span className="font-black text-text-primary text-lg">{exportFormat.toUpperCase()}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Period</span>
            <span className="font-black text-text-primary text-lg">{dateRange}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Payload Units</span>
            <span className="font-black text-primary text-lg">
              {Object.values(selectedData).filter(Boolean).length}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Est. Density</span>
            <span className="font-black text-text-primary text-lg">2.4MB</span>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2"
          disabled={Object.values(selectedData).every(v => !v)}
        >
          <Download size={18} />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default DataExport;
