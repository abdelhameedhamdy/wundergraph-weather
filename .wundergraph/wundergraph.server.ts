import { configureWunderGraphServer } from "@wundergraph/sdk";
import type { HooksConfig } from "./generated/wundergraph.hooks";
import type { InternalClient } from "./generated/wundergraph.internal.client";

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
  hooks: {
    queries: {
      Weather: {
        postResolve: async (hook) => {
          hook.log.info("postResolve hook for Weather");
        },
        mutatingPostResolve: async (hook) => {
          const regionNames = new Intl.DisplayNames(["ar"], { type: "region" });
          return {
            ...hook.response,
            data: {
              weather_getCityByName: {
                ...hook.response.data?.weather_getCityByName,
                country: regionNames.of(
                  hook.response.data?.weather_getCityByName?.country!
                ),
                weather: {
                  ...hook.response.data?.weather_getCityByName?.weather,
                  temperature: {
                    ...hook.response.data?.weather_getCityByName?.weather
                      ?.temperature,
                    actual: Math.round(
                      hook.response.data?.weather_getCityByName?.weather
                        ?.temperature?.actual!
                    ),
                  },
                },
              },
            },
          };
        },
      },
    },
    mutations: {},
  },
  graphqlServers: [],
}));
