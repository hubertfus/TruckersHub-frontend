import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, Users } from "lucide-react";
import axios from "axios";
import TextInput from "../../components/textInput/TextInput";

function RegisterPage() {
  const [role, setRole] = useState<"driver" | "dispatcher">("driver");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    license_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (role === "driver" && !formData.license_number.trim()) {
      newErrors.license_number = "License number is required for drivers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError(null);
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true);
        await axios.post(
          `http://${import.meta.env.VITE_API_ADDRESS}/users/register`,
          { ...formData, role }
        );
        navigate("/");
      } catch (error) {
        console.error("Registration failed:", error);
        setRegistrationError("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className="hero min-h-screen bg-base-200"
        style={{
          backgroundImage: "url(/bgtruck.jpg)",
          backgroundSize: "cover",
        }}
      >
        <div className="hero-overlay bg-opacity-90"></div>
        <div className="hero-content w-full max-w-4xl flex-col gap-8 py-12">
          <div className="text-center lg:text-left text-white lg:w-1/2">
            <h1 className="text-5xl font-bold">Join TruckersHub!</h1>
            <p className="py-6">
              Start your journey with us today. Whether you're a driver or
              dispatcher, we provide the tools you need to succeed in the
              logistics industry.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className={`btn btn-outline ${
                  role === "driver" ? "btn-primary" : "btn-ghost text-white"
                }`}
                onClick={() => setRole("driver")}
              >
                <Truck className="w-5 h-5" />
                Driver
              </button>
              <button
                className={`btn btn-outline ${
                  role === "dispatcher" ? "btn-primary" : "btn-ghost text-white"
                }`}
                onClick={() => setRole("dispatcher")}
              >
                <Users className="w-5 h-5" />
                Dispatcher
              </button>
            </div>
          </div>

          <div className="card flex-shrink-0 w-full lg:w-1/2 shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <TextInput
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              <TextInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
              {role === "driver" && (
                <TextInput
                  label="Driver's License Number"
                  name="license_number"
                  placeholder="DL12345678"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  error={errors.license_number}
                />
              )}
              <TextInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <TextInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>

              {registrationError && (
                <div className="text-error mt-4">{registrationError}</div>
              )}

              <div className="text-center mt-2">
                Already have an account?{" "}
                <Link to="/" className="link link-primary">
                  Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
