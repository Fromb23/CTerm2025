// Table.jsx
import React from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";

const Table = ({ columns, data }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-x-auto w-full bg-card p-4 rounded-lg shadow-theme-lg">
			<table className="min-w-full divide-y divide-secondary">
				<thead className="bg-secondary text-primary">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-4 py-2 text-left font-semibold text-primary"
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="bg-card text-primary divide-y divide-secondary">
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="hover:bg-secondary transition-colors">
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-4 py-2">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;