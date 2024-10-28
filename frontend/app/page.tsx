"use client";

import ListingElement from "@/app/ListingElement";
import NewListing from "@/app/NewListing";
import { APIMethods } from "@/enum";
import { useAPI } from "@/hooks/useAPI";
import { Listing } from "@/types";
import React, { useEffect } from "react";
import MainPage from "./home/MainPage";

export default function Home() {
	// All listings
	const [listings, setListings] = React.useState<Listing[]>([]);

	// Selected listing
	const [listing, setListing] = React.useState<Listing | null>(null);

	const [createNewListing, setCreateNewListing] =
		React.useState<boolean>(false);

	const { apiCall } = useAPI();

	/**
	 * Fetch all listings
	 */
	const fetchListings = () => {
		apiCall<Listing[]>("/listings/", APIMethods.GET).then((data) => {
			if (data) {
				setListings(data);
			}
		});
	};

	useEffect(() => {
		fetchListings();
	}, []);

	return (
		<div>
			<div className="text-center p-20">
				<h1 className="text-4xl italic bg-gradient-to-r from-blue-600 via-blue-400 to-blue-100 bg-clip-text text-transparent font-semibold cursor-default">
					Find Me A Job
				</h1>
			</div>

			{/* Display the list of listings. If one is selected, display its information */}
			{!listing ? (
				<div>
					{/* Display new listing page */}
					{createNewListing ? (
						<NewListing
							goBack={() => setCreateNewListing(false)}
							validate={() => {
								setCreateNewListing(false);
								fetchListings();
							}}
						/>
					) : (
						// Display main page
						<MainPage
							listings={listings}
							fetchListings={fetchListings}
							setListing={setListing}
							goToNewListingPage={() => setCreateNewListing(true)}
						/>
					)}
				</div>
			) : (
				// Display the selected listing
				<ListingElement
					listing={listing}
					goBack={() => setListing(null)}
				/>
			)}
		</div>
	);
}
