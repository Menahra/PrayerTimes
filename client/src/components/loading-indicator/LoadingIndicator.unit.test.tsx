import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingIndicator } from "./LoadingIndicator";
import { axe } from "jest-axe";

describe("LoadingIndicator", () => {
	it("renders without accessibility violations", async () => {
		const { container } = render(<LoadingIndicator />);

		expect(await axe(container)).toHaveNoViolations();
	});
});
