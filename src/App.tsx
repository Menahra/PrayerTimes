import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GeoLocator } from "./components/geo-locator";

export const App = () => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<GeoLocator />
		</QueryClientProvider>
	);
};
