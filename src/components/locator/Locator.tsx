import { useState } from "react";
import { useGeoLocation } from "./useGeoLocation";
import { useStore } from "../../store";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ReversedGeoLocatedText } from "./ReversedGeoLocatedText";
import { ManualLocationSelect } from "./manual-location-select/ManualLocationSelect";
import { LoadingIndicator } from "../loading-indicator/LoadingIndicator";

export const Locator = () => {
	const [showCountryAndCitySelection, setShowCountryAndCitySelection] =
		useState(false);

	const { userLocationIsLoading } = useGeoLocation();
	const { coordinates } = useStore();

	if (userLocationIsLoading) {
		return <LoadingIndicator />;
	}

	if (coordinates !== null && !showCountryAndCitySelection) {
		return (
			<ReversedGeoLocatedText
				latitude={coordinates[0]}
				longitude={coordinates[1]}
				onUndoLocationClick={() => setShowCountryAndCitySelection(true)}
			/>
		);
	}

	return <ManualLocationSelect />;
};
