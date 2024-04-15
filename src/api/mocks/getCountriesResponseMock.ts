import type { RestCountryWithNameAndCCA2 } from "../useGetCountries";

export const getCountriesResponseMock: RestCountryWithNameAndCCA2[] = [
  {
    cca2: "DZ",
    name: {
      common: "Algeria",
      official: "Algeria",
      nativeName: {
        ar: {
          common: "Algeria",
          official: "Algeria",
        },
      },
    },
  },
  {
    cca2: "EN",
    name: {
      common: "England",
      official: "England",
      nativeName: {
        en: {
          common: "England",
          official: "England",
        },
      },
    },
  },
  {
    cca2: "SK",
    name: {
      common: "Slovakia",
      official: "Slovakia",
      nativeName: {
        en: {
          common: "Slovakia",
          official: "Slovakia",
        },
      },
    },
  },
];