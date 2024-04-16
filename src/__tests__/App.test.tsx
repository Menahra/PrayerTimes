import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { TestQueryWrapper } from "../../tests/TestQueryWrapper";
import { App } from "../App";

describe("App", () => {
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
