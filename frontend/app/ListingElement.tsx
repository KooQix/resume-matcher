import { Listing } from "@/types";
import React from "react";
import { MdCancel, MdCheck } from "react-icons/md";
import Button from "../components/Button";
import { useAPI } from "@/hooks/useAPI";
import { APIMethods } from "@/enum";
import { BsQuestionCircleFill } from "react-icons/bs";

const Element: React.FC<{ title: string; text: string }> = ({
	title,
	text,
}) => {
	return (
		<>
			<h1 className="text-center text-2xl py-8 text-blue-500">{title}</h1>
			<pre className="text-wrap">{text}</pre>
		</>
	);
};

interface ListingElementProps {
	listing: Listing;
	goBack: () => void;
}

const ListingElement: React.FC<ListingElementProps> = ({ listing, goBack }) => {
	const { apiCall } = useAPI();

	const urlPreview = listing.url.split("/")[2];

	const handleApply = () => {
		// Open the listing in a new tab
		window.open(listing.url, "_blank");

		// Set the listing as applied
		apiCall<Listing>(`/listings/${listing.id}/`, APIMethods.PUT, {
			applied: true,
		})
			.then((data) => {
				if (data) {
					goBack();
				}
			})
			.catch(() => {
				alert("Failed to update listing");
			});
	};

	return (
		<div className="flex flex-col w-full items-center justify-center p-6">
			<h1 className="text-center text-2xl text-slate-500 font-semibold pb-16">
				{`${listing.company} - ${listing.title}`}
			</h1>

			<div className="flex justify-between items-center pb-4 w-full">
				<div className="flex">
					<p className="mr-6 text-blue-500">Link: </p>
					<a
						className="italic underline"
						href={listing.url}
						target="_blank"
					>
						{urlPreview}
					</a>
				</div>

				<div className="w-[75%] flex justify-between items-center">
					<div className="w-[50%]"></div>
					<div className="flex flex-col items-center justify-center">
						<p>Should Apply?</p>
						{listing.apply === false ? (
							<MdCancel size={20} className="text-red-500" />
						) : listing.apply === true ? (
							<MdCheck size={20} className="text-green-500" />
						) : (
							<BsQuestionCircleFill
								size={20}
								className="text-slate-500"
							/>
						)}
					</div>

					<Button disabled={listing.applied} onClick={handleApply}>
						{listing.applied ? "Already applied" : "Apply"}
					</Button>
				</div>
			</div>

			<Element title="Job description" text={listing.description} />

			{listing.response && (
				<Element title="Response" text={listing.response} />
			)}

			<footer className="py-10">
				<Button
					className="bg-transparent text-blue-500"
					onClick={goBack}
				>
					Go back
				</Button>
			</footer>
		</div>
	);
};

export default ListingElement;
