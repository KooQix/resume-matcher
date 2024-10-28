export interface Listing {
	id: number;
	url: string;
	title: string;
	company: string;
	description: string;

	response: string | null;
	apply: boolean | null;
	applied: boolean;
}
