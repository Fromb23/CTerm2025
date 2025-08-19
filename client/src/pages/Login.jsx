import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../contexts/themeContext.jsx';
import Button from '../components/ui/Button';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { loginUser } from '../redux/actions/loginActions.js';
import { loginState } from '../redux/slices/loginSlice.js';
import { useToast } from "../contexts/toastContext";

import {
	FiArrowLeft,
	FiMail,
	FiLock,
	FiEye,
	FiEyeOff,
	FiGithub,
	FiSun,
	FiMoon,
	FiAlertCircle,
	FiLoader
} from 'react-icons/fi';
import Loading from '../components/ui/Loading.jsx';

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { addToast } = useToast();
	const { isDark, setIsDark } = useTheme();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const { user, loading, error, isAuthenticated } = useSelector((state) => state.login);

	const fields = [
		{
			name: "email",
			type: "email",
			label: "Email Address",
			placeholder: "Enter your email",
			icon: <FiMail className="w-5 h-5 text-secondary" />,
		},
		{
			name: "password",
			type: showPassword ? "text" : "password",
			label: "Password",
			placeholder: "Enter your password",
			icon: <FiLock className="w-5 h-5 text-secondary" />,
			rightIcon: (
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="text-secondary hover:text-primary transition-colors duration-200"
				>
					{showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
				</button>
			),
		},
	];

	const toggleDarkMode = () => {
		setIsDark(prev => !prev);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = (data) => {
		const newErrors = {};

		if (!data.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(data.email)) {
			newErrors.email = 'Please enter a valid email';
		}

		if (!data.password) {
			newErrors.password = 'Password is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	useEffect(() => {
		if (user && isAuthenticated) {
			addToast("Login successful!", "success");
			navigate("/dashboard");
		}
		if (error) {
			const message = typeof error === "string"
				? error
				: error?.detail || "Login failed. Please try again.";
			addToast(message, "error");
			dispatch(loginState());
		}

	}, [user, isAuthenticated, error, dispatch, addToast]);

	const handleSubmit = (formData) => {
		if (!validateForm(formData)) return;
		dispatch(loginUser(formData));
	}

	const handleGitHubAuth = () => {
		console.log('GitHub authentication triggered');
		// GitHub OAuth integration would go here
	};

	if (loading) return <Loading message="Signing in..." />;

	return (
		<div className={`${isDark ? 'dark' : ''}`}>
			<div className="bg-primary text-primary min-h-screen transition-colors duration-300">

				<header className="bg-accent text-on-accent py-4 shadow-theme-lg">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<div className="flex items-center space-x-4">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => navigate(-1)}
								className="border-on-accent text-on-accent"
							>
								<FiArrowLeft className="w-4 h-4" />
							</Button>
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold text-sm">cT</span>
								</div>
								<h1 className="text-xl font-bold">cTerm2025</h1>
							</div>
						</div>
						<Button
							variant="secondary"
							size="sm"
							onClick={toggleDarkMode}
							className="border-on-accent text-on-accent"
						>
							{isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
						</Button>
					</div>
				</header>

				{/* Main Content */}
				<div className="container mx-auto px-4 py-12">
					<div className="max-w-md mx-auto">
						<Card className="p-8">
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
								<p className="text-secondary">Sign in to continue your learning journey</p>
							</div>

							<div className="space-y-4">
								<Button
									variant="secondary"
									onClick={handleGitHubAuth}
									className="w-full border-primary"
								>
									<FiGithub className="w-5 h-5 mr-3" />
									Continue with GitHub
								</Button>

								<div className="flex items-center space-x-4">
									<div className="flex-1 h-px bg-primary"></div>
									<span className="text-secondary text-sm">or</span>
									<div className="flex-1 h-px bg-primary"></div>
								</div>
							</div>

							<Form onSubmit={handleSubmit} fields={fields} formData={formData} onChange={handleInputChange} errors={errors}>
								<div className="flex justify-end">
									<Link
										to="/forgot-password"
										className="text-sm text-accent font-semibold hover:underline transition-all duration-200"
									>
										Forgot password?
									</Link>
								</div>

								<Button
									type="submit"
									variant="primary"
									disabled={isLoading}
									className={`w-full ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-105 transform"
										} transition-all duration-200`}
								>
									{isLoading ? (
										<>
											<FiLoader className="w-5 h-5 animate-spin mr-2" />
											Signing in...
										</>
									) : (
										"Sign In"
									)}
								</Button>
							</Form>



							{/* Signup Link */}
							<div className="text-center mt-6">
								<span className="text-secondary">Don't have an account? </span>
								<Link
									to="/register"
									className="text-accent font-semibold hover:underline transition-all duration-200"
								>
									Sign up
								</Link>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;