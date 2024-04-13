import { useEffect, useState } from "react";

type UseGeoLocationReturnType = {
	userLocationIsLoading: boolean;
	userLocation: GeolocationPosition | null;
};

export const useGeoLocation = (): UseGeoLocationReturnType => {
	const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
		null,
	);
	const [userLocationIsLoading, setUserLocationIsLoading] = useState(false);

	useEffect(() => {
		if (navigator.geolocation) {
			setUserLocationIsLoading(true);
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserLocationIsLoading(false);
					setUserLocation(position);
				},
				(error) => {
					setUserLocationIsLoading(false);
				},
			);
		}
	}, []);

	return {
		userLocationIsLoading,
		userLocation,
	};
};
