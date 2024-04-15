import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGeoLocation } from "../useGeoLocation";
import { useStore } from "../../../store";

describe('useGeoLocation', () => {
  it('if getCurrentPosition does not return successfully the coords are not set', () => {
    global.navigator = {
      ...global.navigator,
      geolocation: {
        getCurrentPosition: vi.fn()
          .mockImplementationOnce((_success, error) => Promise.resolve(error({
            code: 1,
            message: 'GeoLocation Error',
        }))),
        clearWatch: vi.fn(),
        watchPosition: vi.fn(),
      }
    };
    const { result: storeResult } = renderHook(() => useStore());
    const { result: geoLocationResult } = renderHook(() => useGeoLocation());

    expect(geoLocationResult.current.userLocationIsLoading).toBeFalsy();
    expect(storeResult.current.coordinates).toBeNull();
  });

  it('if getCurrentPosition returns success the coords are set into state', () => {
    global.navigator = {
      ...global.navigator,
      geolocation: {
        getCurrentPosition: vi.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 51.1,
              longitude: 45.3
            }
          }))),
          clearWatch: vi.fn(),
          watchPosition: vi.fn(),
      }
    };
    const { result: storeResult } = renderHook(() => useStore());
    const { result: geoLocationResult } = renderHook(() => useGeoLocation());

    expect(geoLocationResult.current.userLocationIsLoading).toBeFalsy();
    expect(storeResult.current.coordinates).toEqual([51.1, 45.3]);
  });
});