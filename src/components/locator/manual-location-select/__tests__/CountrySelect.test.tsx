import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../../tests/server";
import { http } from "msw";
import { render, waitFor } from "@testing-library/react";
import { TestQueryWrapper } from "../../../../../tests/TestQueryWrapper";
import { CountrySelect } from "../CountrySelect";
import { getCountriesResponseMock } from "../../../../api/mocks";

describe("CountrySelect", () => {
	const user = userEvent.setup();
	const requestMockFn = vi.fn();
	const onSelectMock = vi.fn();

	beforeEach(() => {
		server.use(
			http.get("*/restcountries.com/v3.1/all*", () => {
				requestMockFn();
				return new Response(JSON.stringify(getCountriesResponseMock));
			}),
		);
	});

	afterEach(() => {
		requestMockFn.mockClear();
	});

	it("renders a loading bar while waiting for the request", async () => {
		const { getByRole, queryByRole } = render(
			<TestQueryWrapper>
				<CountrySelect onSelectCountry={onSelectMock} />
			</TestQueryWrapper>,
		);

		const loadingElement = getByRole("img");
		expect(loadingElement).toBeInTheDocument();
		expect(loadingElement).toHaveAccessibleName("loading");

		await waitFor(() => expect(requestMockFn).toHaveBeenCalledTimes(1));

		expect(queryByRole("img")).toBeNull();
	});

	it("renders a combobox after the request is finished", async () => {
		const { getByRole } = render(
			<TestQueryWrapper>
				<CountrySelect onSelectCountry={onSelectMock} />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMockFn).toHaveBeenCalledTimes(1));

		expect(getByRole("combobox")).toBeInTheDocument();
	});

	it("shows options according to the request result", async () => {
		const { getByRole, getByText } = render(
			<TestQueryWrapper>
				<CountrySelect onSelectCountry={onSelectMock} />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMockFn).toHaveBeenCalledTimes(1));

		const comboBox = getByRole("combobox");
		await user.click(comboBox);

		// NOTE: unfortunately antd does not apply the 'option' role to the individual options but rather to an element
		// which wraps the options
		// also getByLabelText does not work properly (only on first option) --> this leads to poor testing
		expect(getByText("Algeria")).toBeInTheDocument();
		expect(getByText("England")).toBeInTheDocument();
		expect(getByText("Slovakia")).toBeInTheDocument();
	});

	it("can properly search options and upper case and lower case is ignored", async () => {
		const { getByRole, getByText, queryByText } = render(
			<TestQueryWrapper>
				<CountrySelect onSelectCountry={onSelectMock} />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMockFn).toHaveBeenCalledTimes(1));

		const comboBox = getByRole("combobox");

		await user.click(comboBox);
		await user.type(comboBox, "ia");
		expect(getByText("Algeria")).toBeInTheDocument();
		expect(queryByText("England")).toBeNull();
		expect(getByText("Slovakia")).toBeInTheDocument();

		await user.clear(comboBox);
		expect(getByText("Algeria")).toBeInTheDocument();
		expect(getByText("England")).toBeInTheDocument();
		expect(getByText("Slovakia")).toBeInTheDocument();

		await user.type(comboBox, "IA");
		expect(getByText("Algeria")).toBeInTheDocument();
		expect(queryByText("England")).toBeNull();
		expect(getByText("Slovakia")).toBeInTheDocument();
	});

	it("can select a value and the value gets passed to the select", async () => {
		const onCountrySelectMock = vi.fn();
		const { getByRole, getByText } = render(
			<TestQueryWrapper>
				<CountrySelect onSelectCountry={onCountrySelectMock} />
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(requestMockFn).toHaveBeenCalledTimes(1));

		const comboBox = getByRole("combobox");

		await user.click(comboBox);
		await user.click(getByText("Algeria"));
		expect(comboBox).toHaveValue("DZ");

		expect(onCountrySelectMock).toHaveBeenCalledWith({
			value: "DZ",
			label: "Algeria",
		});
	});
});
