/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/discover` | `/(tabs)/mytrip` | `/(tabs)/profile` | `/_sitemap` | `/auth/sign-in` | `/auth/sign-up` | `/create-trip/generate-trip` | `/create-trip/review-trip` | `/create-trip/search-place` | `/create-trip/select-budget` | `/create-trip/select-dates` | `/create-trip/select-traveler` | `/discover` | `/mytrip` | `/profile` | `/trip-detail`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
