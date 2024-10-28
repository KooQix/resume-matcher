import React from "react";
import Button from "../components/Button";
import {
	FieldValues,
	SubmitHandler,
	useForm,
	UseFormRegister,
} from "react-hook-form";
import Input from "../components/Input";
import { useAPI } from "@/hooks/useAPI";
import { APIMethods } from "@/enum";
import { Listing } from "@/types";

interface InlineElementProps {
	label: string;
	register: UseFormRegister<FieldValues>;
	registerName: string;
	registerOptions: any;
}
const InlineElement: React.FC<InlineElementProps> = ({
	label,
	register,
	registerName,
	registerOptions,
}) => {
	return (
		<div className="flex justify-center items-center w-[30%] py-4">
			<p className="mr-8 w-[25%]">{label}</p>
			<Input
				className="truncate"
				{...register(registerName, registerOptions)}
			/>
		</div>
	);
};

interface NewListingProps {
	goBack: () => void;
	validate: () => void;
}

const NewListing: React.FC<NewListingProps> = ({ goBack, validate }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { apiCall } = useAPI();

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		try {
			const { url, title, company, description } = data;

			// Send data to the backend
			apiCall<Listing>("/listings/", APIMethods.POST, {
				url: url,
				title: title,
				company: company,
				description: description,
			})
				.then((response) => {
					if (response) {
						validate();
					}
				})
				.catch((error) => {
					alert(error.message);
				});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<h1 className="text-slate-500 font-semibold text-2xl">
				New Listing
			</h1>

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="w-full flex items-center justify-center flex-col"
			>
				<InlineElement
					label="Link to offer"
					register={register}
					registerName="url"
					registerOptions={{
						required: {
							value: true,
							message: "Email is required",
						},
						pattern: {
							value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?(#.*)?$/,
							message: "Invalid URL",
						},
					}}
				/>

				<InlineElement
					label="Title"
					register={register}
					registerName="title"
					registerOptions={{
						required: { value: true, message: "Title is required" },
					}}
				/>

				<InlineElement
					label="Company"
					register={register}
					registerName="company"
					registerOptions={{
						required: {
							value: true,
							message: "Company is required",
						},
					}}
				/>

				<textarea
					className="m-6 w-[30%] h-44 rounded-md bg-slate-200/90 border border-transparent px-2 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none text-slate-800"
					placeholder="Description of the job"
					{...register("description", {
						required: {
							value: true,
							message: "Description is required",
						},
					})}
				/>
				{/* Display errors if any */}
				{errors && (
					<div className="w-[30%] flex justify-center items-center flex-col">
						{Object.keys(errors).map((key) => (
							<p key={key} className="text-red-500">
								{errors[key]?.message as string}
							</p>
						))}
					</div>
				)}
				<footer className="py-10 w-[30%] flex justify-between items-center">
					<Button
						className="bg-transparent text-blue-500"
						onClick={goBack}
					>
						Go back
					</Button>

					<Button type="submit">Validate</Button>
				</footer>
			</form>
		</div>
	);
};

export default NewListing;
