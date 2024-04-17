import type { PropsWithChildren } from "react";
import { Talkr } from "talkr";
import de from "./de.json";
import en from "./en.json";
import fr from "./fr.json";

export const LocalizationProvider = ({ children }: PropsWithChildren) => {
	return (
		<Talkr
			languages={{ de, en, fr }}
			detectBrowserLanguage
			defaultLanguage="en"
		>
			{children}
		</Talkr>
	);
};
