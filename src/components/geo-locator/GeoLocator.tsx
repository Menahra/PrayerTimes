import { Spin } from "antd";
import { useGeoLocation } from "./useGeoLocation";
import { LoadingOutlined } from "@ant-design/icons";
import { useStore } from "../../store";

export const GeoLocator = () => {
	const { userLocation, userLocationIsLoading } = useGeoLocation();
	const { setCoordinates } = useStore();

	if (userLocationIsLoading) {
		return <Spin indicator={<LoadingOutlined spin />} />;
	}

	if (userLocation !== null) {
		setCoordinates([
			userLocation.coords.latitude,
			userLocation.coords.longitude,
		]);
	}

	return (
		<span>Hey there your longitute is: {userLocation?.coords.longitude}</span>
	);
};
