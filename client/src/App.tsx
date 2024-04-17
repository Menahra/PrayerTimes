import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Locator } from "./components/locator";
import { LocalizationProvider } from "./i18n";

export const App = () => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<LocalizationProvider>
				<Locator />
			</LocalizationProvider>
		</QueryClientProvider>
	);
};
