import React from 'react';

const DataTable = ({ columns, data, renderRow }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-background border-b border-border/20">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index} className="border-b border-border/10 hover:bg-background/50 transition-colors">
                                {renderRow(item)}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-8 py-20 text-center text-gray-400 font-medium">
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
