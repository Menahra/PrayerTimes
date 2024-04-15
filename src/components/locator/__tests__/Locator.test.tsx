import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../tests/server";
import { http } from "msw";
import {
	getCountriesResponseMock,
	getReverseGeocodingResponseMock,
} from "../../../api/mocks";
import userEvent from "@testing-library/user-event";
import { render, waitFor } from "@testing-library/react";
import { TestQueryWrapper } from "../../../../tests/TestQueryWrapper";
import { Locator } from "../Locator";

describe("Locator", () => {
	const user = userEvent.setup();
	const reversedGeocodingResponseMockFn = vi.fn();
	const countryResponseMockFn = vi.fn();

	afterEach(() => {
		reversedGeocodingResponseMockFn.mockClear();
		countryResponseMockFn.mockClear();
	});

	beforeEach(() => {
		server.use(
			...[
				http.get("*api.geoapify.com/v1/geocode/reverse*", () => {
					reversedGeocodingResponseMockFn();
					return new Response(JSON.stringify(getReverseGeocodingResponseMock));
				}),
				http.get("*/restcountries.com/v3.1/all*", () => {
					countryResponseMockFn();
					return new Response(JSON.stringify(getCountriesResponseMock));
				}),
			],
		);
	});

	global.navigator = {
		...global.navigator,
		geolocation: {
			getCurrentPosition: vi.fn().mockImplementation((success) =>
				Promise.resolve(
					success({
						coords: {
							latitude: 51.1,
							longitude: 45.3,
						},
					}),
				),
			),
			clearWatch: vi.fn(),
			watchPosition: vi.fn(),
		},
	};

	it("shows reverse geo located text if geolocation api works", async () => {
		const { getByText } = render(
			<TestQueryWrapper>
				<Locator />
			</TestQueryWrapper>,
		);

		await waitFor(() =>
			expect(reversedGeocodingResponseMockFn).toHaveBeenCalledTimes(1),
		);

		expect(
			getByText(getReverseGeocodingResponseMock.results[0].city),
		).toBeVisible();
	});

	it("if user clicks away geo located text the selects for country and city are displayed", async () => {
		const { getAllByRole, getByRole } = render(
			<TestQueryWrapper>
				<Locator />
			</TestQueryWrapper>,
		);

		await waitFor(() =>
			expect(reversedGeocodingResponseMockFn).toHaveBeenCalledTimes(1),
		);

		await user.click(getByRole("button"));
		await waitFor(() => expect(countryResponseMockFn).toHaveBeenCalledTimes(1));
		expect(getAllByRole("combobox")).toHaveLength(2);
	});

	it("if geo location api is not available the two selects are directly rendered", async () => {
		global.navigator = {
			...global.navigator,
			geolocation: {
				getCurrentPosition: vi.fn().mockImplementationOnce((_success, error) =>
					Promise.resolve(
						error({
							code: 1,
							message: "GeoLocation Error",
						}),
					),
				),
				clearWatch: vi.fn(),
				watchPosition: vi.fn(),
			},
		};

		const { getAllByRole } = render(
			<TestQueryWrapper>
				<Locator />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(countryResponseMockFn).toHaveBeenCalledTimes(1));
		expect(getAllByRole("combobox")).toHaveLength(2);
	});
});
