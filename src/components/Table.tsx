import React, { useState } from 'react';

interface TableProps {
    data: Array<{ [key: string]: string | number | boolean }>;
    columns: Array<{ key: string; label: string; icon?: React.ReactNode }>;
}

const Table: React.FC<TableProps> = ({ data, columns }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});

    const sortedData = React.useMemo(() => {
        const sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const filteredData = React.useMemo(() => {
        return sortedData.filter(item =>
            columns.every(column =>
                item[column.key] != null && item[column.key].toString().toLowerCase().includes(filters[column.key]?.toLowerCase() || '')
            )
        );
    }, [sortedData, filters, columns]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig) return null;
        if (sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') {
            return '▲'; // Up arrow
        } else {
            return '▼'; // Down arrow
        }
    };

    return (
        <div className="p-4 h-full overflow-auto">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-900">
                            <th className="p-2 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">#</th>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => requestSort(column.key)}
                                    className="p-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer text-black dark:text-white"
                                >
                                    {column.icon && <span className="mr-2">{column.icon}</span>}
                                    {column.label} {getSortIcon(column.key)}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                            <th className="p-2 border-b border-gray-200 dark:border-gray-700"></th>
                            {columns.map((column) => (
                                <th key={column.key} className="p-2 border-b border-gray-200 dark:border-gray-700">
                                    <input
                                        type="text"
                                        value={filters[column.key] || ''}
                                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                                        placeholder={`Filter ${column.label}`}
                                        className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-2 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">{index + 1}</td>
                                {columns.map((column) => (
                                    <td key={column.key} className="p-2 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">
                                        {item[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;