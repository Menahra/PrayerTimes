import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/** @see https://gitlab.com/restcountries/restcountries/-/blob/master/FIELDS.md */
export type RestCountryWithNameAndCCA2 = {
	/** two letter code representing the country */
	cca2: string;
	/** some information about the name of the country */
	name: {
		common: string;
		official: string;
		nativeName: Record<
			string,
			{
				common: string;
				official: string;
			}
		>;
	};
};

export const useGetCountries = () => {
	return useQuery<RestCountryWithNameAndCCA2[]>({
		queryKey: ["countries"],
		queryFn: async () => {
			const { data } = await axios.get(
				"https://restcountries.com/v3.1/all?fields=name,cca2",
			);

			return data;
		},
	});
};
