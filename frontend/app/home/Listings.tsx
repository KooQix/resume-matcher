"use client";

import React from "react";

import Table, { TableRow } from "@/components/Table";
import { Listing } from "@/types";

interface ListingsProps {
	listings: Listing[];
	setSelectedListing(listing: Listing): void;
}

const Listings: React.FC<ListingsProps> = ({
	listings,
	setSelectedListing,
}) => {
	const handleSelect = (rowIndex: number) => {
		if (rowIndex < 0 || rowIndex >= listings.length) return;

		// Get corresponding listing by index
		const listing = listings[rowIndex];

		// Open modal to display the listing
		if (!listing) return;

		setSelectedListing(listing);
	};
	return (
		<div>
			<h1 className="text-center text-2xl text-blue-500 py-8">
				My Listings
			</h1>
			{listings.length > 0 ? (
				<Table
					// Don't display type if not training (because all available instances are all "INFERENCE" type)
					data={listings as unknown as TableRow[]}
					itemsPerPage={10}
					ignore={[
						"id",
						"description",
						"response",
						"created_at",
						"url",
					]}
					onSelect={handleSelect}
				/>
			) : (
				<p>No listing found</p>
			)}
		</div>
	);
};

export default Listings;
