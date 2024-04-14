import { useMemo, useState } from "react";
import { useGetCitiesByCountry } from "../../../api";
import { AutoComplete, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { CityByCountryObject } from "../../../api/useGetCitiesByCountry";

export type CityByCountrySelectOption = {
	value: string;
	label: string;
} & Pick<CityByCountryObject, "latitude" | "longitude">;

export type CityByCountrySelectProps = {
	/** the country code for which we want to select a city */
	countryCode: string;
	/** the current value of the city select */
	value?: CityByCountrySelectOption;
	/** callback executed when the user selects another value */
	onCityByCountrySelect: (newSelectedCity?: CityByCountrySelectOption) => void;
};

export const CityByCountrySelect = ({
	countryCode,
	value,
	onCityByCountrySelect,
}: CityByCountrySelectProps) => {
	const {
		data: availableCitiesByCountry = [],
		isFetching: isLoadingCountries,
	} = useGetCitiesByCountry(countryCode);
	const [cityByCountrySearchValue, setCityByCountrySearchValue] = useState("");

	const availableCitiesByCountryOptions = useMemo(
		() =>
			availableCitiesByCountry
				.filter((availableCityByCountry) =>
					availableCityByCountry.name
						.toLowerCase()
						.includes(cityByCountrySearchValue.toLowerCase()),
				)
				.map((availableCityByCountry) => ({
					value: availableCityByCountry.geo_id.toString(),
					label: availableCityByCountry.name,
					longitude: availableCityByCountry.longitude,
					latitude: availableCityByCountry.latitude,
				}))
				.sort((firstOption, secondOption) =>
					firstOption.label.localeCompare(secondOption.label),
				),
		[availableCitiesByCountry, cityByCountrySearchValue],
	);

	if (isLoadingCountries) {
		return <Spin indicator={<LoadingOutlined spin />} />;
	}

	return (
		<AutoComplete
			value={value?.label}
			notFoundContent="No matches found"
			options={availableCitiesByCountryOptions}
			placeholder="Select city"
			onSearch={setCityByCountrySearchValue}
			onChange={(newValue) => {
				onCityByCountrySelect(
					availableCitiesByCountryOptions.find(
						(availableCitiesByCountryOption) =>
							availableCitiesByCountryOption.value === newValue,
					),
				);
			}}
			onClear={() => onCityByCountrySelect(undefined)}
			allowClear
		/>
	);
};
