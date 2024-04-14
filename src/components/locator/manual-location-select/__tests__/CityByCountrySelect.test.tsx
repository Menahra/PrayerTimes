import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CityByCountrySelect } from "../CityByCountrySelect";
import { TestQueryWrapper } from "../../../../../tests/TestQueryWrapper";

describe("CityByCountrySelect", () => {
	const countryCode = "EN";
	it("renders a loading bar while loading the request", () => {
		const { getByRole } = render(
			<TestQueryWrapper>
				<CityByCountrySelect
					countryCode={countryCode}
					onCityByCountrySelect={vi.fn()}
				/>
			</TestQueryWrapper>,
		);

		expect(getByRole("img")).toBeInTheDocument();
	});
});
