import React, { useState } from 'react';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OAuthButtons from '../components/OAuthButtons';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const loadingToast = toast.loading('Creating account...');

    try {
      
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success('Account created successfully!');
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/');
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.message || 'Signup failed');
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred while signing up.');
      setError('An error occurred while signing up.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-white shadow-xl rounded-2xl px-10 py-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Join <span className="text-[#ff385c]">NestHub</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent transition"
                placeholder="Choose a username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent transition"
                placeholder="Create a password"
              />
              <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long</p>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#ff385c] hover:bg-[#e63650] text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
            >
              Create Account
            </button>

            <OAuthButtons />

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#ff385c] hover:text-[#e63650] font-medium"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Signup;
