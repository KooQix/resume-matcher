"use client";

import { APIMethods } from "@/enum";
import { useAPI } from "@/hooks/useAPI";
import React, { useEffect } from "react";
import Button, { CancelButton } from "../../components/Button";
import Input from "../../components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Resume = () => {
	const [resumeUploaded, setResumeUploaded] = React.useState(false);

	const [uploadResumeState, setUploadResumeState] = React.useState(false);

	const { apiCall, uploadResume } = useAPI();

	const { handleSubmit, register, reset } = useForm();

	useEffect(() => {
		apiCall<{ message: boolean }>("/resume/", APIMethods.GET).then(
			(res) => {
				if (res) {
					setResumeUploaded(res.message);
				}
			},
		);
	}, []);

	const onSubmit: SubmitHandler<FieldValues> = (values) => {
		if (values.file.length !== 1) {
			toast.error("Please upload a single file");
			return;
		}
		const { file } = values;

		const _file: File = file[0];

		uploadResume(_file).then(() => {
			setResumeUploaded(true);
			setUploadResumeState(false);
		});

		// Reset the form
		reset();
	};

	return (
		<div className="p-6 flex flex-col items-center justify-center">
			<div className="flex w-full p-6 justify-end items-center">
				<Button
					onClick={() => setUploadResumeState(!uploadResumeState)}
					disabled={uploadResumeState}
				>
					{resumeUploaded
						? "Upload another resume"
						: "Upload a resume"}
				</Button>
			</div>
			{uploadResumeState && (
				<form onSubmit={handleSubmit(onSubmit)} className="w-[50%]">
					<Input
						className="cursor-pointer w-full"
						type="file"
						multiple={false}
						accept={".pdf"}
						{...register("file")}
					/>
					<div className="flex justify-between items-center w-full p-6">
						<CancelButton
							onClick={() => setUploadResumeState(false)}
						/>
						<Button type="submit">Upload</Button>
					</div>
				</form>
			)}
		</div>
	);
};

export default Resume;
