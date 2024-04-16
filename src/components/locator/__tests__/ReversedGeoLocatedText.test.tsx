import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../tests/server";
import { http } from "msw";
import { getReverseGeocodingResponseMock } from "../../../api/mocks";
import { render, waitFor } from "@testing-library/react";
import { TestQueryWrapper } from "../../../../tests/TestQueryWrapper";
import { ReversedGeoLocatedText } from "../ReversedGeoLocatedText";

describe("ReversedGeoLocatedText", () => {
	const user = userEvent.setup();
	const reversedGeocodingResponseMockFn = vi.fn();

	afterEach(() => {
		reversedGeocodingResponseMockFn.mockClear();
	});

	it("initially renders a loading indicator while the request is still pending", async () => {
		server.use(
			http.get("*api.geoapify.com/v1/geocode/reverse*", () => {
				reversedGeocodingResponseMockFn();
				return new Response(JSON.stringify(getReverseGeocodingResponseMock));
			}),
		);

		const { getByRole } = render(
			<TestQueryWrapper>
				<ReversedGeoLocatedText
					latitude={getReverseGeocodingResponseMock.query.lat}
					longitude={getReverseGeocodingResponseMock.query.lon}
					onUndoLocationClick={vi.fn()}
				/>
			</TestQueryWrapper>,
		);

		const loadingIndicator = getByRole("img");
		expect(loadingIndicator).toBeVisible();
		expect(loadingIndicator).toHaveAccessibleName("loading");

		await waitFor(() =>
			expect(reversedGeocodingResponseMockFn).toHaveBeenCalledTimes(1),
		);

		const otherImgElement = getByRole("img");
		expect(otherImgElement).not.toHaveAccessibleName("loading");
	});

	it("shows the current city and a button to undo if the reverse geo coding was successful", async () => {
		const undoFn = vi.fn();
		server.use(
			http.get("*api.geoapify.com/v1/geocode/reverse*", () => {
				reversedGeocodingResponseMockFn();
				return new Response(JSON.stringify(getReverseGeocodingResponseMock));
			}),
		);

		const { getByRole, getByText } = render(
			<TestQueryWrapper>
				<ReversedGeoLocatedText
					latitude={getReverseGeocodingResponseMock.query.lat}
					longitude={getReverseGeocodingResponseMock.query.lon}
					onUndoLocationClick={undoFn}
				/>
			</TestQueryWrapper>,
		);

		await waitFor(() =>
			expect(reversedGeocodingResponseMockFn).toHaveBeenCalledTimes(1),
		);

		expect(
			getByText(getReverseGeocodingResponseMock.results[0].city),
		).toBeVisible();

		const undoButton = getByRole("button");
		expect(undoButton).toBeVisible();
		await user.click(undoButton);
		expect(undoFn).toHaveBeenCalledTimes(1);
	});

	it("shows failure text if the request did not return successfully", async () => {
		const failFn = vi.fn();
		server.use(
			http.get("*api.geoapify.com/v1/geocode/reverse*", () => {
				failFn();
				return new Response(undefined, { status: 500 });
			}),
		);

		const undoFn = vi.fn();
		const { getByRole } = render(
			<TestQueryWrapper>
				<ReversedGeoLocatedText
					latitude={getReverseGeocodingResponseMock.query.lat}
					longitude={getReverseGeocodingResponseMock.query.lon}
					onUndoLocationClick={undoFn}
				/>
			</TestQueryWrapper>,
		);

		await waitFor(() => expect(failFn).toHaveBeenCalledTimes(1));

		const undoButton = getByRole("button");
		expect(undoButton).toBeVisible();
		expect(undoButton).toHaveTextContent(
			"Failed to locate you. Click here to choose your location manually.",
		);
		await user.click(undoButton);
		expect(undoFn).toHaveBeenCalledTimes(1);
	});
});
