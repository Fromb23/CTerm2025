import { baseApi } from "./baseApi";

// Enhance baseApi with auth headers and common behaviors
export const enhancedBaseApi = baseApi.injectEndpoints({
	endpoints: () => ({}),
	overrideExisting: false,
	baseQuery: async (args, api, extraOptions) => {
		const token = api.getState().auth?.token; // access auth slice
		if (token && args.headers) {
			args.headers["Authorization"] = `Bearer ${token}`;
		}
		return baseApi.baseQuery(args, api, extraOptions);
	},
});
