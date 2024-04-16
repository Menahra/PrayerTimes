# PrayerTimes

This project provides a web app which displays islamic prayer times for different locations.

## Upcoming planned features

The following list contains features which should be included (but not necessarily in this order) in upcoming months

- replace [AutoComplete](https://ant.design/components/auto-complete) by [Select](https://ant.design/components/select) as it fits better to the use case
- add an express backend which nightly fetches data for countries, cities to reduce loading times while using the app
- instead of showing loading indicators show skeletons to improve perceived performance
- add a select for the different prayer times methods
- add a calendar datepicker
- add possibility to export prayertimes for current location for this day/ current month/ year
- add mobile support
- instead of directly trying to locate the user, show initially the comboboxes for city and country and add a locate me button next to them
- instead of relying on [aladhan prayer times](https://aladhan.com/prayer-times-api) define the calculations ourselves
