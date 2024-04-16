import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TestQueryWrapper } from "../../tests/TestQueryWrapper";
import { App } from "../App";

describe("App", () => {
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

	it("renders a locator which initially shows a loading indicator", async () => {
		const { getByRole } = render(
			<TestQueryWrapper>
				<App />
			</TestQueryWrapper>,
		);

		const loadingIndicator = getByRole("img");
		expect(loadingIndicator).toBeVisible();
		expect(loadingIndicator).toHaveAccessibleName("loading");
	});
});
