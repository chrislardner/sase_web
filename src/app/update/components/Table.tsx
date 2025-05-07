import React, {useState} from 'react';

interface TableProps {
    data: Array<{ [key: string]: string | number | boolean }>;
    columns: Array<{ key: string; label: string; icon?: React.ReactNode }>;
}

const Table: React.FC<TableProps> = ({data, columns}) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
    const [filters, setFilters] = useState<{ [key: string]: { condition: string; value: string } }>({});

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
            columns.every(column => {
                const filter = filters[column.key];
                if (!filter || !filter.value) return true;
                const itemValue = item[column.key];
                const filterValue = filter.value;
                switch (filter.condition) {
                    case '>':
                        return typeof itemValue === 'number' && itemValue > parseFloat(filterValue);
                    case '<':
                        return typeof itemValue === 'number' && itemValue < parseFloat(filterValue);
                    case '>=':
                        return typeof itemValue === 'number' && itemValue >= parseFloat(filterValue);
                    case '<=':
                        return typeof itemValue === 'number' && itemValue <= parseFloat(filterValue);
                    case '=':
                        return itemValue == filterValue;
                    default:
                        return itemValue != null && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
                }
            })
        );
    }, [sortedData, filters, columns]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const handleFilterChange = (key: string, condition: string, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: {condition, value}
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

    const exportToCSV = () => {
        const csvRows = [];
        const headers = columns.map(column => column.label).join(',');
        csvRows.push(headers);

        filteredData.forEach(item => {
            const values = columns.map(column => item[column.key]);
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'filtered_data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="p-4 h-full overflow-auto">
            <div className="overflow-x-auto">
                <button onClick={exportToCSV} className="mb-4 p-2 bg-blue-500 text-white rounded">Export to CSV</button>
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
                                <select
                                    onChange={(e) => handleFilterChange(column.key, e.target.value, filters[column.key]?.value || '')}
                                    value={filters[column.key]?.condition || ''}
                                    className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                >
                                    <option value="">Condition</option>
                                    <option value=">">{'>'}</option>
                                    <option value="<">{'<'}</option>
                                    <option value=">=">{'>='}</option>
                                    <option value="<=">{'<='}</option>
                                    <option value="=">=</option>
                                </select>
                                <input
                                    type="text"
                                    value={filters[column.key]?.value || ''}
                                    onChange={(e) => handleFilterChange(column.key, filters[column.key]?.condition || '', e.target.value)}
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
                                <td key={column.key}
                                    className="p-2 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">
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