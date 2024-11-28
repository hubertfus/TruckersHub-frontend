import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";
import { useUser } from "../../ctx/UserContext";
import TextInput from "../../components/textInput/TextInput";

function LandingPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser, user } = useUser();

    useEffect(() => {
        console.log(user);
        if (user?.role) navigate(`/${user.role}`);
    }, [user]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            const response = await axios.post(`http://${import.meta.env.VITE_API_ADDRESS}/users/login`, { email, password });
            console.log("Login successful:", response.data);
            setUser(response.data.user);
            navigate(`/${response.data.user.role}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Login failed:", err.response?.data?.message || err.message);
                setError(err.response?.data?.message || "Something went wrong. Please try again.");
            } else {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <>
            <div
                id="test"
                className="hero bg-base-200"
                style={{
                    backgroundImage: "url(/bghub.jpg)",
                }}
            >
                <div className="hero-overlay bg-opacity-90"></div>
                <div className="hero-content pt-0 pb-4 flex-col lg:flex-row-reverse max-w-screen-lg">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold hero-text">Login now!</h1>
                        <p className="py-2 hero-text">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form className="card-body" onSubmit={handleLogin}>
                            <TextInput
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={error && !password ? "Invalid email or password" : ""}
                                required
                            />

                            <TextInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={error && password ? "Invalid email or password" : ""}
                                required
                            />

                            <div className="flex flex-row justify-between items-end">
                                <label className="label flex flex-col items-start">
                                    Don’t have an account?
                                    <Link to="/register" className="label-text-alt link link-hover text-blue-700">
                                        Sign Up
                                    </Link>
                                </label>
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover text-blue-700">
                                        Forgot password?
                                    </a>
                                </label>
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm py-2">
                                    {error}
                                </div>
                            )}

                            <div className="form-control mt-6">
                                <button className="btn btn-primary" type="submit">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <footer className="footer bg-neutral text-neutral-content p-10">
                <aside>
                    <h1>TruckersHub</h1>
                    <p>
                        TH Industries Ltd.
                        <br />
                        Providing reliable tech since 1992
                    </p>
                </aside>
                <nav>
                    <h6 className="footer-title">Social</h6>
                    <div className="grid grid-flow-col gap-4">
                        <a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current hover:fill-blue-400 cursor-pointer"
                            >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current hover:fill-red-600 cursor-pointer"
                            >
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current hover:fill-blue-600 cursor-pointer"
                            >
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </a>
                    </div>
                </nav>
            </footer>
        </>
    );
}

export default LandingPage;
