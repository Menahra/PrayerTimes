import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/** @see https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/#api */
export type UseGetReverseGeocodingReturnType = {
	query: {
		lat: number;
		lon: number;
	};
	results: Array<{
		name: string;
		country: string;
		country_code: string;
		city: string;
	}>;
};

export const useGetReverseGeocoding = (longitude: number, latitude: number) => {
	return useQuery<UseGetReverseGeocodingReturnType>({
		queryKey: ["reverseGeoCoding", longitude, latitude],
		queryFn: async () => {
			const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
			url.searchParams.append("lat", latitude.toString());
			url.searchParams.append("lon", longitude.toString());
			url.searchParams.append("format", "json");
			url.searchParams.append("apiKey", import.meta.env.VITE_GEOAPIFY_API_KEY);

			const { data } = await axios.get(url.href);

			return data;
		},
	});
};
