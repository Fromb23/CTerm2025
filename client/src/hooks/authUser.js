import { useLoginMutation, useRegisterMutation, useMeQuery } from "../services/authApi";

export const useUserAuth = () => {
	const [login, loginResult] = useLoginMutation();
	const [register, registerResult] = useRegisterMutation();
	const meQuery = useMeQuery();

	return {
		login,
		loginResult,
		register,
		registerResult,
		meQuery,
	};
};
