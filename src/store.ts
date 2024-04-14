import { create } from "zustand";

type Store = {
	/** 
	 * the coordinates of the location for which the times should be loaded 
	 * 
	 * the first value represents the latitude
	 * the second the longitude
	 */
	coordinates: [number, number] | null;
	/** a function which must be used to update the coordinates */
	setCoordinates: (newCoordinates: [number, number] | null) => void;
};

export const useStore = create<Store>((setStore) => ({
	coordinates: null,
	setCoordinates: (newCoordinates) =>
		setStore(() => ({ coordinates: newCoordinates })),
}));
