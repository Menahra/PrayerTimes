import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
	it("renders App component", () => {
		const { getByText } = render(<App />);

		expect(getByText("Hello World")).toBeInTheDocument();
	});
});
