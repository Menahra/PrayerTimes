import type { UseGetReverseGeocodingReturnType } from "../useGetReverseGeocoding";

export const getReverseGeocodingResponseMock: UseGetReverseGeocodingReturnType = {
	query: {
		lat: 12,
		lon: 17,
	},
	results: [{
    name: 'some name',
    country: 'Algeria',
    country_code: 'DZ',
    city: 'Ain Taya',
  }],
};