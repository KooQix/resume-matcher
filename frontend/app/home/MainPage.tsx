import React, { useEffect } from "react";
import Resume from "./Resume";
import Listings from "./Listings";
import Loader from "@/components/Loader";
import { Listing } from "@/types";
import { useAPI } from "@/hooks/useAPI";
import { APIMethods } from "@/enum";
import Button from "@/components/Button";

interface MainPageProps {
	listings: Listing[];
	fetchListings: () => void;
	setListing(listing: Listing): void;
	goToNewListingPage: () => void;
}

const MainPage: React.FC<MainPageProps> = ({
	listings,
	fetchListings,
	setListing,
	goToNewListingPage,
}) => {
	const [runEnabled, setRunEnabled] = React.useState<boolean>(false);
	const [isProcessing, setIsProcessing] = React.useState<boolean>(false);

	const processingInterval = React.useRef<NodeJS.Timeout | null>(null);

	const { apiCall } = useAPI();

	useEffect(() => {
		// Enable the run button if there are listings that need processing
		setRunEnabled(listings.find((l) => l.response === null) !== undefined);
	}, [listings]);

	/**
	 * Run the listings comparison
	 */
	const runListingsComparison = () => {
		apiCall<{ message: string }>("/listings/process", APIMethods.GET)
			.then((data) => {
				if (data) {
					if (data.message === "Processing job listings...") {
						// Start processing interval and display loader
						setIsProcessing(true);

						processingInterval.current = setInterval(() => {
							checkProcessing();
						}, 5000);

						// Update the listings
						fetchListings();
					}
				}
			})
			.catch((err) => {
				alert(`Failed to process listings: ${err.message}`);
			});
	};

	/**
	 * Check if the listings are still processing
	 */
	const checkProcessing = () => {
		apiCall<{ processing: boolean }>("/listings/processing", APIMethods.GET)
			.then((data) => {
				if (data) {
					setIsProcessing(data.processing);

					// If processing is done, clear the interval and refresh the listings
					if (!data.processing) {
						clearInterval(processingInterval.current!);

						// Refresh the listings
						fetchListings();
					}
				}
			})
			.catch(() => {
				alert("Failed to check processing status");
			});
	};

	return (
		<div>
			<Resume></Resume>
			<Listings
				listings={listings}
				setSelectedListing={setListing}
			></Listings>

			{isProcessing && (
				<Loader title="Processing job listings, please wait..." />
			)}

			{/* Create new listing */}
			<footer className="py-12 w-full flex items-center justify-between px-12">
				<Button disabled={!runEnabled} onClick={runListingsComparison}>
					Process listings
				</Button>
				<Button onClick={goToNewListingPage}>New listing</Button>
			</footer>
		</div>
	);
};

export default MainPage;
