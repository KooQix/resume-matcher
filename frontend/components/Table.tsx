import React, { useState } from "react";
import Button from "./Button";
import { twMerge } from "tailwind-merge";
import { MdCancel, MdCheck } from "react-icons/md";

export interface TableRow {
	[key: string]: string | number | boolean; // Adjust based on the types of your data
}

interface TableProps {
	data: TableRow[];
	itemsPerPage: number;
	ignore?: string[];
	onSelect: (rowIndex: number) => void;
}

const Table: React.FC<TableProps> = ({
	data,
	itemsPerPage,
	ignore,
	onSelect,
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState<{
		key: string | null;
		direction: "ascending" | "descending";
	}>({
		key: null,
		direction: "ascending",
	});

	const [withoutIgnored, setWithoutIgnored] = useState<TableRow[]>([]);

	// Function to remove ignored keys
	React.useEffect(() => {
		// When data changes, reset current page
		setCurrentPage(1);

		const newData = structuredClone(data);
		ignore?.forEach((key) => {
			newData.forEach((row) => {
				delete row[key];
			});
		});
		setWithoutIgnored(newData);
	}, [data]);

	// Function to handle sorting
	const handleSort = (key: string) => {
		let direction: "ascending" | "descending" = "ascending";
		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	// Function to sort data
	const sortedData = (): TableRow[] => {
		if (!sortConfig.key) return withoutIgnored;
		const sortableData = [...withoutIgnored];
		sortableData.sort((a, b) => {
			if (sortConfig.key) {
				const valueA = a[sortConfig.key];
				const valueB = b[sortConfig.key];
				if (valueA < valueB)
					return sortConfig.direction === "ascending" ? -1 : 1;
				if (valueA > valueB)
					return sortConfig.direction === "ascending" ? 1 : -1;
				return sortConfig.direction === "ascending" ? -1 : 1;
			}
			if (sortConfig.key && a[sortConfig.key] > b[sortConfig.key]) {
				return sortConfig.direction === "ascending" ? 1 : -1;
			}
			return 0;
		});
		return sortableData;
	};

	// Function to get current page data
	const getCurrentPageData = (): TableRow[] => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return sortedData().slice(startIndex, endIndex);
	};

	// Function to handle page change
	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	// Render table header
	const renderTableHeader = (): JSX.Element => {
		return (
			<thead className="text-slate-600 text-md" title="Click to sort">
				<tr>
					{withoutIgnored.length > 0 &&
						Object.keys(withoutIgnored[0]).map((key) => (
							<th
								key={key}
								onClick={() => handleSort(key)}
								className="p-1 cursor-default px-4"
							>
								{key.charAt(0).toUpperCase() +
									key.slice(1).replaceAll("_", " ")}
							</th>
						))}
				</tr>
			</thead>
		);
	};

	// Render table rows
	const renderTableRows = (): JSX.Element[] => {
		return getCurrentPageData().map((row, index) => (
			<tr
				key={index}
				onClick={() => onSelect?.(index)}
				className={twMerge("cursor-pointer hover:bg-slate-100/40")}
			>
				{/* Foreach value, display an icon if it's a boolean, else the value */}
				{Object.values(row).map((value, index) => (
					<td
						key={index}
						className={twMerge(
							"px-4 py-2 rounded-md truncate max-w-5",
							index < 2 && "w-[30%]",
						)}
					>
						{value === false ? (
							<div className="flex items-center justify-center text-red-500">
								<MdCancel size={20} />
							</div>
						) : value === true ? (
							<div className="flex items-center justify-center text-green-500">
								<MdCheck size={20} />
							</div>
						) : (
							value
						)}
					</td>
				))}
			</tr>
		));
	};

	// Render pagination
	const renderPagination = (): JSX.Element => {
		const totalPages = Math.ceil(sortedData().length / itemsPerPage);

		return (
			<div className="w-full flex justify-between items-center mt-6 pl-4 pr-4">
				<span className="text-slate-500">
					Page {currentPage} of {totalPages}
				</span>
				<div className="flex gap-x-2">
					<Button
						className="p-1 pr-2 pl-2 bg-transparent hover:bg-slate-100/70 text-blue-500"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<Button
						className="p-1 pr-2 pl-2 bg-transparent hover:bg-slate-100/70 text-blue-500"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="w-full overflow-x-scroll md:overflow-visible">
			<table className="w-full">
				{renderTableHeader()}
				<tbody className="text-center">{renderTableRows()}</tbody>
			</table>
			{renderPagination()}
		</div>
	);
};

export default Table;
