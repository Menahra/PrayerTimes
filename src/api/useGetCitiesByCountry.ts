import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type CityByCountryObject = {
	geo_id: number;
	latitude: number;
	longitude: number;
	name: string;
	state_or_region: string;
	country: {
		code: string;
		name: string;
	};
};

export const useGetCitiesByCountry = (countryCode: string) =>
	useQuery<Array<CityByCountryObject>>({
		queryKey: ["citiesByCountry"],
		queryFn: async () => {
			const { data } = await axios.get(
				`https://api.apilayer.com/geo/country/cities/${countryCode}`,
				{
					headers: {
						apiKey: import.meta.env.VITE_APILAYER_API_KEY,
					},
				},
			);

			return data;
		},
	});
