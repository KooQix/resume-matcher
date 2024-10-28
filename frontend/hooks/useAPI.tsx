/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIMethods } from "@/enum";
import toast from "react-hot-toast";

const BACK_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BACK_URL) throw new Error("NEXT_PUBLIC_API_URL not set");

interface BaseAPIResponse {
	message: string;
}

interface ErrorAPIResponse {
	error: string;
}

interface APIProps {
	apiCall: <T>(
		url: string,
		method: APIMethods,
		body?: any,
	) => Promise<T | null>;

	uploadResume: (file: File) => Promise<void>;
}

export function useAPI(): APIProps {
	/**
	 * Make an API call to the backend (when authentication is required, e.g. every call except login, manually handled in app/api/auth/[...nextauth]/route.ts] or signup, also manually handled)
	 *
	 * @param session User session
	 * @param url url (- base url)
	 * @param method HTTP Method, as APIMethods enum
	 * @param body body of the request, if post/put
	 *
	 * @returns response | null
	 *
	 * @throws ApiError
	 */
	const apiCall = async <T,>(
		url: string,
		method: APIMethods,
		body: unknown = {},
	): Promise<T | null> => {
		const headers = {
			"Content-Type": "application/json",
			"Access-Control-Request-Methods": "*",
		};

		let res: Response;
		try {
			if (method === APIMethods.GET || method === APIMethods.DELETE) {
				res = await fetch(`${BACK_URL}${url}`, {
					method: method.toString(),
					headers: headers,
				});
			} else if (method === APIMethods.POST || method == APIMethods.PUT) {
				res = await fetch(`${BACK_URL}${url}`, {
					method: method.toString(),
					headers: headers,
					body: JSON.stringify(body),
					// cache: "no-store",
				});
			} else {
				return null;
			}

			const response: T | BaseAPIResponse = await res.json();

			if (res.status !== 200) {
				const error =
					(response as BaseAPIResponse).message ??
					(response as ErrorAPIResponse).error ??
					"An error occurred while fetching data";

				toast.error(error);
				return null;
			}

			return response as T;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	const uploadResume = async (file: File) => {
		const formData = new FormData();

		// Automatically set the Content-Type header to multipart/form-data and the boundary (requested by the backend)
		formData.append("file", file);

		const res = await fetch(`${BACK_URL}/resume/upload`, {
			method: APIMethods.POST.toString(),
			body: formData,
		});

		const response: BaseAPIResponse | ErrorAPIResponse = await res.json();

		if (res.status !== 200) {
			const error =
				(response as BaseAPIResponse).message ??
				(response as ErrorAPIResponse).error ??
				"An error occurred while uploading the file";

			toast.error(error);
			return;
		}

		toast.success((response as BaseAPIResponse).message);
	};

	return { apiCall, uploadResume };
}
