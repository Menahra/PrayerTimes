import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../../tests/server";
import { http } from "msw";
import {
	getCitiesByCountryResponseMock,
	getCountriesResponseMock,
} from "../../../../api/mocks";
import { render, renderHook, waitFor } from "@testing-library/react";
import { TestQueryWrapper } from "../../../../../tests/TestQueryWrapper";
import { ManualLocationSelect } from "../ManualLocationSelect";
import userEvent from "@testing-library/user-event";
import { useStore } from "../../../../store";

describe("ManualLocationSelect", () => {
	const user = userEvent.setup();
	const countryRequestMockFn = vi.fn();
	const cityByCountryRequestMockFn = vi.fn();
	const countryCode = "EN";
	beforeEach(() => {
		server.use(
			...[
				http.get("*/restcountries.com/v3.1/all?fields=name,cca2", () => {
					countryRequestMockFn();
					return new Response(JSON.stringify(getCountriesResponseMock));
				}),
				http.get(`*/api.apilayer.com/geo/country/cities/${countryCode}`, () => {
					cityByCountryRequestMockFn();
					return new Response(JSON.stringify(getCitiesByCountryResponseMock));
				}),
			],
		);
	});

	afterEach(() => {
		countryRequestMockFn.mockClear();
		cityByCountryRequestMockFn.mockClear();
	});

	it("initially shows a loading indicator and a disabled select", () => {
		const { getByRole } = render(
			<TestQueryWrapper>
				<ManualLocationSelect />
			</TestQueryWrapper>,
		);

		const loadingElement = getByRole("img");
		expect(loadingElement).toBeInTheDocument();
		expect(loadingElement).toHaveAccessibleName("loading");

		const comboBox = getByRole("combobox");
		expect(comboBox).toBeInTheDocument();
		expect(comboBox).toBeDisabled();
	});

	it("after request for countries is done shows an enabled and disabled select", async () => {
		const { getAllByRole, queryByRole } = render(
			<TestQueryWrapper>
				<ManualLocationSelect />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(countryRequestMockFn).toHaveBeenCalledTimes(1));
		expect(queryByRole("img")).toBeNull();

		const comboBoxes = getAllByRole("combobox");
		expect(comboBoxes).toHaveLength(2);
		expect(comboBoxes[0]).not.toBeDisabled();
		expect(comboBoxes[1]).toBeDisabled();
	});

	it("when selecting a country the city select is loading cities for that country", async () => {
		const { getAllByRole, getByText } = render(
			<TestQueryWrapper>
				<ManualLocationSelect />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(countryRequestMockFn).toHaveBeenCalledTimes(1));

		const comboBoxes = getAllByRole("combobox");
		const countryComboBox = comboBoxes[0];
		await user.click(countryComboBox);
		await user.click(getByText("England"));
		expect(getAllByRole("combobox")[1]).not.toBeDisabled();
	});

	it("when selecting a city the state is updated with its coordinates", async () => {
		const { result } = renderHook(() => useStore());
		const { getAllByRole, getByText } = render(
			<TestQueryWrapper>
				<ManualLocationSelect />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(countryRequestMockFn).toHaveBeenCalledTimes(1));

		const comboBoxes = getAllByRole("combobox");
		const countryComboBox = comboBoxes[0];
		await user.click(countryComboBox);
		await user.click(getByText("England"));

		await waitFor(() =>
			expect(cityByCountryRequestMockFn).toHaveBeenCalledTimes(1),
		);

		const cityComboBox = getAllByRole("combobox")[1];
		await user.click(cityComboBox);
		await user.click(getByText("second city"));

		expect(result.current.coordinates).toEqual([2, 2]);
	});
});
