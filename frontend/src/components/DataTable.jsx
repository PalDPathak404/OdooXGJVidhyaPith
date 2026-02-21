import React from 'react';
import { Package } from 'lucide-react';

const DataTable = ({ columns, data, renderRow, emptyMessage = "No data available" }) => {
    if (!data || data.length === 0) {
        return (
            <div className="card-elevated p-12 text-center">
                <div className="w-16 h-16 bg-surface-elevated rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-text-muted" />
                </div>
                <p className="text-text-secondary font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="card-elevated overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="data-table w-full">
                    <thead className="bg-surface-elevated border-b border-border">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {data.map((item, index) => (
                            <tr key={index} className="group hover:bg-surface-elevated/50 transition-colors">
                                {renderRow(item)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
