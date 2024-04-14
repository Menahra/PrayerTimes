import { AutoComplete, Spin } from "antd";
import { useGetCountries } from "../../../api";
import { useMemo, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export type Option = {
	value: string;
	label: string;
};

type CountrySelectProps = {
	/** the current selected option */
	value?: Option;
	/** this callback is executed whenever another option is chosen */
	onSelectCountry: (newCountry?: Option) => void;
};

export const CountrySelect = ({
	onSelectCountry,
	value,
}: CountrySelectProps) => {
	const { data: availableCountries = [], isFetching: isLoadingCountries } =
		useGetCountries();
	const [countrySearchValue, setCountrySearchValue] = useState("");

	const availableCountryOptions = useMemo(
		() =>
			availableCountries
				.filter((availableCountry) =>
					availableCountry.name.common
						.toLowerCase()
						.includes(countrySearchValue.toLowerCase()),
				)
				.map((availableCountry) => ({
					value: availableCountry.cca2,
					label: availableCountry.name.common,
				}))
				.sort((firstOption, secondOption) =>
					firstOption.label.localeCompare(secondOption.label),
				),
		[availableCountries, countrySearchValue],
	);

	if (isLoadingCountries) {
		return <Spin indicator={<LoadingOutlined spin />} />;
	}

	return (
		<AutoComplete
			value={value?.label}
			notFoundContent="No matches found"
			options={availableCountryOptions}
			placeholder="Select country"
			onSearch={setCountrySearchValue}
			onChange={(newValue) => {
				onSelectCountry(
					availableCountryOptions.find(
						(availableCountryOption) =>
							availableCountryOption.value === newValue,
					),
				);
			}}
			onClear={() => onSelectCountry(undefined)}
			allowClear
		/>
	);
};
