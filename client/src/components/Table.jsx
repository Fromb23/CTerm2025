// Table.jsx
import React, { useState } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	flexRender,
} from "@tanstack/react-table";
import {
	ChevronUp,
	ChevronDown,
	ChevronsUpDown,
	Search,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Filter,
	Download,
	RefreshCw,
	MoreHorizontal
} from "lucide-react";

const Table = ({
	columns,
	data,
	loading = false,
	error = null,
	title = "",
	description = "",
	searchable = true,
	filterable = false,
	exportable = false,
	refreshable = false,
	onRefresh = () => { },
	onExport = () => { },
	className = "",
	emptyMessage = "No data available",
	pageSize = 10,
	showPagination = true
}) => {
	const [sorting, setSorting] = useState([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [columnFilters, setColumnFilters] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: pageSize,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			globalFilter,
			columnFilters,
			pagination,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		globalFilterFn: "includesString",
	});

	const getSortIcon = (column) => {
		const sorted = column.getIsSorted();
		if (sorted === "asc") {
			return <ChevronUp className="w-4 h-4 ml-1" />;
		}
		if (sorted === "desc") {
			return <ChevronDown className="w-4 h-4 ml-1" />;
		}
		return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-50" />;
	};

	const LoadingRow = ({ colSpan }) => (
		<tr>
			<td colSpan={colSpan} className="px-6 py-12 text-center">
				<div className="flex flex-col items-center justify-center">
					<div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
					<p className="text-secondary">Loading data...</p>
				</div>
			</td>
		</tr>
	);

	const ErrorRow = ({ colSpan, error }) => (
		<tr>
			<td colSpan={colSpan} className="px-6 py-12 text-center">
				<div className="flex flex-col items-center justify-center">
					<div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
						<span className="text-error text-xl">⚠</span>
					</div>
					<p className="text-error font-medium mb-1">Error loading data</p>
					<p className="text-secondary text-sm">{error}</p>
					{refreshable && (
						<button
							onClick={onRefresh}
							className="mt-4 px-4 py-2 button-outline rounded-lg text-sm hover:bg-secondary transition-colors"
						>
							Try Again
						</button>
					)}
				</div>
			</td>
		</tr>
	);

	const EmptyRow = ({ colSpan }) => (
		<tr>
			<td colSpan={colSpan} className="px-6 py-12 text-center">
				<div className="flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
						<span className="text-secondary text-2xl">📋</span>
					</div>
					<p className="text-primary font-medium mb-1">No data found</p>
					<p className="text-secondary text-sm">{emptyMessage}</p>
				</div>
			</td>
		</tr>
	);

	return (
		<div className={`bg-card rounded-xl border border-primary shadow-theme-lg ${className}`}>
			{/* Header Section */}
			{(title || description || searchable || filterable || exportable || refreshable) && (
				<div className="p-6 border-b border-primary">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						{/* Title and Description */}
						{(title || description) && (
							<div>
								{title && (
									<h3 className="text-xl font-semibold text-primary mb-1">
										{title}
									</h3>
								)}
								{description && (
									<p className="text-secondary text-sm">{description}</p>
								)}
							</div>
						)}

						{/* Actions */}
						<div className="flex items-center gap-3">
							{/* Search */}
							{searchable && (
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
									<input
										type="text"
										placeholder="Search..."
										value={globalFilter}
										onChange={(e) => setGlobalFilter(e.target.value)}
										className="pl-10 pr-4 py-2 w-64 bg-secondary border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors text-sm"
									/>
								</div>
							)}

							{/* Filter Button */}
							{filterable && (
								<button className="p-2 hover:bg-secondary rounded-lg transition-colors">
									<Filter className="w-4 h-4 text-secondary" />
								</button>
							)}

							{/* Export Button */}
							{exportable && (
								<button
									onClick={onExport}
									className="p-2 hover:bg-secondary rounded-lg transition-colors"
									title="Export data"
								>
									<Download className="w-4 h-4 text-secondary" />
								</button>
							)}

							{/* Refresh Button */}
							{refreshable && (
								<button
									onClick={onRefresh}
									className="p-2 hover:bg-secondary rounded-lg transition-colors"
									title="Refresh data"
									disabled={loading}
								>
									<RefreshCw className={`w-4 h-4 text-secondary ${loading ? 'animate-spin' : ''}`} />
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Table Container */}
			<div className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						{/* Table Header */}
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="border-b border-primary bg-secondary/30">
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-6 py-4 text-left font-semibold text-primary whitespace-nowrap"
											style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
										>
											{header.isPlaceholder ? null : (
												<div className="flex items-center">
													{header.column.getCanSort() ? (
														<button
															onClick={header.column.getToggleSortingHandler()}
															className="flex items-center hover:text-accent transition-colors group"
														>
															<span className="select-none">
																{flexRender(
																	header.column.columnDef.header,
																	header.getContext()
																)}
															</span>
															<span className="opacity-0 group-hover:opacity-100 transition-opacity">
																{getSortIcon(header.column)}
															</span>
														</button>
													) : (
														<span>
															{flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
														</span>
													)}
												</div>
											)}
										</th>
									))}
								</tr>
							))}
						</thead>

						{/* Table Body */}
						<tbody className="divide-y divide-primary">
							{loading ? (
								<LoadingRow colSpan={columns.length} />
							) : error ? (
								<ErrorRow colSpan={columns.length} error={error} />
							) : table.getRowModel().rows.length === 0 ? (
								<EmptyRow colSpan={columns.length} />
							) : (
								table.getRowModel().rows.map((row, index) => (
									<tr
										key={row.id}
										className={`
											hover:bg-secondary/50 transition-colors group
											${index % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}
										`}
									>
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className="px-6 py-4 text-primary whitespace-nowrap"
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			{showPagination && !loading && !error && data.length > 0 && (
				<div className="px-6 py-4 border-t border-primary">
					<div className="flex items-center justify-between">
						{/* Results Info */}
						<div className="flex items-center gap-6">
							<div className="text-sm text-secondary">
								Showing{" "}
								<span className="font-medium text-primary">
									{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
								</span>{" "}
								to{" "}
								<span className="font-medium text-primary">
									{Math.min(
										(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
										table.getFilteredRowModel().rows.length
									)}
								</span>{" "}
								of{" "}
								<span className="font-medium text-primary">
									{table.getFilteredRowModel().rows.length}
								</span>{" "}
								results
							</div>

							{/* Page Size Selector */}
							<div className="flex items-center gap-2">
								<label className="text-sm text-secondary">Show:</label>
								<select
									value={table.getState().pagination.pageSize}
									onChange={(e) => table.setPageSize(Number(e.target.value))}
									className="px-2 py-1 bg-secondary border border-primary rounded text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
								>
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<option key={pageSize} value={pageSize}>
											{pageSize}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Pagination Controls */}
						<div className="flex items-center space-x-2">
							<button
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
								className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronsLeft className="w-4 h-4" />
							</button>
							<button
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft className="w-4 h-4" />
							</button>

							{/* Page Numbers */}
							<div className="flex items-center space-x-1">
								{Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
									const pageIndex = table.getState().pagination.pageIndex;
									const totalPages = table.getPageCount();

									let displayPage;
									if (totalPages <= 5) {
										displayPage = i;
									} else if (pageIndex < 3) {
										displayPage = i;
									} else if (pageIndex >= totalPages - 3) {
										displayPage = totalPages - 5 + i;
									} else {
										displayPage = pageIndex - 2 + i;
									}

									return (
										<button
											key={displayPage}
											onClick={() => table.setPageIndex(displayPage)}
											className={`px-3 py-1 rounded text-sm transition-colors ${displayPage === pageIndex
													? 'bg-accent text-on-accent'
													: 'hover:bg-secondary text-primary'
												}`}
										>
											{displayPage + 1}
										</button>
									);
								})}
							</div>

							<button
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRight className="w-4 h-4" />
							</button>
							<button
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
								className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronsRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Table;