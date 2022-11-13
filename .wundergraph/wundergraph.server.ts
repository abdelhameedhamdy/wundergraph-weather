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
          return {
            ...hook.response,
            data: {
              weather_getCityByName: {
                ...hook.response.data?.weather_getCityByName,
                country: "test",
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
