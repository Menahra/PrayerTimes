import { AutoComplete, Flex } from "antd";
import { useState } from "react";
import { CountrySelect, type Option } from "./CountrySelect";
import {
	CityByCountrySelect,
	type CityByCountrySelectOption,
	type CityByCountrySelectProps,
} from "./CityByCountrySelect";
import { useStore } from "../../../store";

export const ManualLocationSelect = () => {
	const { setCoordinates } = useStore();
	const [selectedCountry, setSelectedCountry] = useState<Option | undefined>(
		undefined,
	);
	const [selectedCity, setSelectedCity] = useState<
		CityByCountrySelectOption | undefined
	>(undefined);

	const handleCitySelect: CityByCountrySelectProps["onCityByCountrySelect"] = (
		newSelectedCity,
	) => {
		setSelectedCity(newSelectedCity);

		setCoordinates(
			newSelectedCity === undefined
				? null
				: [newSelectedCity.latitude, newSelectedCity.longitude],
		);
	};

	return (
		<Flex vertical gap="middle">
			<CountrySelect
				value={selectedCountry}
				onSelectCountry={setSelectedCountry}
			/>
			{!selectedCountry ? (
				<AutoComplete disabled placeholder="Select city" />
			) : (
				<CityByCountrySelect
					countryCode={selectedCountry.value}
					value={selectedCity}
					onCityByCountrySelect={handleCitySelect}
				/>
			)}
		</Flex>
	);
};
