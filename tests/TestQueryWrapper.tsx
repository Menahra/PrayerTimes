import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0, // to be able to test error cases
			retryDelay: 1,
		},
	},
});
export const TestQueryWrapper = ({ children }: PropsWithChildren) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
