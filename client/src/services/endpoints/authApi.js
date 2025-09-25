import { enhancedBaseApi } from "../enhancedBaseApi";

export const authApi = enhancedBaseApi.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => {
				return {
					url: "/auth/login/",
					method: "POST",
					body: credentials,
				};
			},
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "/auth/register",
				method: "POST",
				body: data,
			}),
		}),
		me: builder.query({
			query: () => "/auth/me",
		}),
	}),
	overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;
