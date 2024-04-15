import { render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CityByCountrySelect } from "../CityByCountrySelect";
import { TestQueryWrapper } from "../../../../../tests/TestQueryWrapper";
import { server } from "../../../../../tests/server";
import { http } from "msw";

describe("CityByCountrySelect", () => {
	const user = userEvent.setup();
	const countryCode = "EN";
	const requestMock = vi.fn();
	beforeEach(() => {
		server.use(
			http.get(`*/api.apilayer.com/geo/country/cities/${countryCode}`, () => {
				requestMock();
				return new Response(
					JSON.stringify([
						{
							geo_id: 1,
							latitude: 1,
							longitude: 1,
							name: "first city",
							state_or_region: "first state",
							country: {
								code: "DZ",
								name: "Algeria",
							},
						},
						{
							geo_id: 2,
							latitude: 2,
							longitude: 2,
							name: "second city",
							state_or_region: "first state",
							country: {
								code: "EN",
								name: "England",
							},
						},
						{
							geo_id: 3,
							latitude: 3,
							longitude: 3,
							name: "third city",
							state_or_region: "first state",
							country: {
								code: "SK",
								name: "Slovakia",
							},
						},
					]),
				);
			}),
		);
	});
	afterEach(() => {
		requestMock.mockClear();
	});

	it("renders a loading bar while loading the request", async () => {
		const { getByRole, queryByRole } = render(
			<TestQueryWrapper>
				<CityByCountrySelect
					countryCode={countryCode}
					onCityByCountrySelect={vi.fn()}
				/>
			</TestQueryWrapper>,
		);

		const loadingElement = getByRole("img");
		expect(loadingElement).toBeInTheDocument();
		expect(loadingElement).toHaveAccessibleName("loading");

		await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));

		expect(queryByRole("img")).toBeNull();
	});

	it("renders a combobox after the request is finished", async () => {
		const { getByRole } = render(
			<TestQueryWrapper>
				<CityByCountrySelect
					countryCode={countryCode}
					onCityByCountrySelect={vi.fn()}
				/>
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));

		expect(getByRole("combobox")).toBeInTheDocument();
	});

	it("shows options according to the request", async () => {
		const { getByRole, getByText } = render(
			<TestQueryWrapper>
				<CityByCountrySelect
					countryCode={countryCode}
					onCityByCountrySelect={vi.fn()}
				/>
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));

		const comboBox = getByRole("combobox");
		await user.click(comboBox);

		// NOTE: unfortunately antd does not apply the 'option' role to the individual options but rather to an element
		// which wraps the options
		// also getByLabelText does not work properly (only on first option) --> this leads to poor testing
		expect(getByText("first city")).toBeInTheDocument();
		expect(getByText("second city")).toBeInTheDocument();
		expect(getByText("third city")).toBeInTheDocument();
	});

	it("can properly search options and upper case and lower case is ignored", async () => {
		const { getByRole, getByText, queryByText } = render(
			<TestQueryWrapper>
				<CityByCountrySelect
					countryCode={countryCode}
					onCityByCountrySelect={vi.fn()}
				/>
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));

		const comboBox = getByRole("combobox");

		await user.click(comboBox);
		await user.type(comboBox, "ir");
		expect(getByText("first city")).toBeInTheDocument();
		expect(queryByText("second city")).toBeNull();
		expect(getByText("third city")).toBeInTheDocument();

		await user.clear(comboBox);
		expect(getByText("first city")).toBeInTheDocument();
		expect(getByText("second city")).toBeInTheDocument();
		expect(getByText("third city")).toBeInTheDocument();

		await user.type(comboBox, "IR");
		expect(getByText("first city")).toBeInTheDocument();
		expect(queryByText("second city")).toBeNull();
		expect(getByText("third city")).toBeInTheDocument();
	});

	it("can select a value and the value gets passed to the select", async () => {
		const onSelectMock = vi.fn();
		const { getByRole, getByText } = render(
			<TestQueryWrapper>
				<CityByCountrySelect
					countryCode={countryCode}
					onCityByCountrySelect={onSelectMock}
				/>
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));

		const comboBox = getByRole("combobox");

		await user.click(comboBox);
		await user.click(getByText("second city"));
		expect(comboBox).toHaveValue("2");

		expect(onSelectMock).toHaveBeenCalledWith({
			value: "2",
			label: "second city",
			latitude: 2,
			longitude: 2,
		});
	});
});
