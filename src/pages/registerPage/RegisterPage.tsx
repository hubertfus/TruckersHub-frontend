import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users } from 'lucide-react';

function RegisterPage() {
    const [role, setRole] = useState<'driver' | 'dispatcher'>('driver');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        license_number: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (role === 'driver' && !formData.license_number.trim()) {
            newErrors.license_number = 'License number is required for drivers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const a = validateForm();
        if (a) {
            console.log({ ...formData, role });
        }
        console.log(a)
    };

    return (
        <>
            <div className="hero min-h-screen bg-base-200" style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2575&q=80)",
                backgroundSize: 'cover',
            }}>
                <div className="hero-overlay bg-opacity-90"></div>
                <div className="hero-content w-full max-w-4xl flex-col gap-8 py-12">
                    <div className="text-center lg:text-left text-white lg:w-1/2">
                        <h1 className="text-5xl font-bold">Join TruckersHub!</h1>
                        <p className="py-6">
                            Start your journey with us today. Whether you're a driver or dispatcher,
                            we provide the tools you need to succeed in the logistics industry.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                className={`btn btn-outline ${role === 'driver' ? 'btn-primary' : 'btn-ghost text-white'}`}
                                onClick={() => setRole('driver')}
                            >
                                <Truck className="w-5 h-5" />
                                Driver
                            </button>
                            <button
                                className={`btn btn-outline ${role === 'dispatcher' ? 'btn-primary' : 'btn-ghost text-white'}`}
                                onClick={() => setRole('dispatcher')}
                            >
                                <Users className="w-5 h-5" />
                                Dispatcher
                            </button>
                        </div>
                    </div>

                    <div className="card flex-shrink-0 w-full lg:w-1/2 shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <span className="text-error text-sm mt-1">{errors.name}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+1 234 567 890"
                                    className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && <span className="text-error text-sm mt-1">{errors.phone}</span>}
                            </div>

                            {role === 'driver' && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Driver's License Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="license_number"
                                        placeholder="DL12345678"
                                        className={`input input-bordered ${errors.license_number ? 'input-error' : ''}`}
                                        value={formData.license_number}
                                        onChange={handleInputChange}
                                    />
                                    {errors.license_number && <span className="text-error text-sm mt-1">{errors.license_number}</span>}
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                {errors.password && <span className="text-error text-sm mt-1">{errors.password}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                />
                                {errors.confirmPassword && <span className="text-error text-sm mt-1">{errors.confirmPassword}</span>}
                            </div>

                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>

                            <div className="text-center mt-2">
                                Already have an account?{' '}
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