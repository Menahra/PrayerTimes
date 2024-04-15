import { useEffect, useState } from "react";
import { useStore } from "../../store";

type UseGeoLocationReturnType = {
	userLocationIsLoading: boolean;
};

export const useGeoLocation = (): UseGeoLocationReturnType => {
	const [userLocationIsLoading, setUserLocationIsLoading] = useState(true);
	const { setCoordinates } = useStore();

	useEffect(() => {
		let canceled = false;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				if (!canceled) {
					setUserLocationIsLoading(false);
					setCoordinates([position.coords.latitude, position.coords.longitude]);
				}
			},
			(/* error */) => {
				if (!canceled) {
					setUserLocationIsLoading(false);
				}
			},
		);

		return () => {
			canceled = true;
		};
	}, [setCoordinates]);

	return {
		userLocationIsLoading,
	};
};
