import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Locator } from "./components/locator";

export const App = () => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Locator />
		</QueryClientProvider>
	);
};
