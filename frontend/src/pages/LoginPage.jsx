import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Changed from email to username
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in with username:', formData.username);
    try {
      
      await login(formData.username, formData.password);
      navigate('/chats');
    } catch (error) {
      console.error("Login component failed:", error);

      const backendErrorMessage = error.response?.data?.message ||"Something went Wrong"
       // retrieves the message of the backend
      const backendStatus = error.response?.status || 400
      navigate('/error', {
        state: {
          message: backendErrorMessage, 
          status: backendStatus
        }
      })
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B14] p-4 font-sans">
      <div className="w-full max-w-[440px] rounded-2xl border border-slate-800/50 bg-[#0A111E] p-8 shadow-2xl">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#00CF85]">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue chatting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="YourUsername"
              required
              className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-[#00CF85] focus:outline-none focus:ring-1 focus:ring-[#00CF85] transition-all"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-[#00CF85] focus:outline-none focus:ring-1 focus:ring-[#00CF85] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#00CF85] py-3.5 text-sm font-semibold text-[#050B14] hover:bg-[#00b574] active:scale-[0.99] transition-all shadow-lg shadow-[#00CF85]/10 mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="font-medium text-[#00CF85] hover:underline bg-transparent border-none cursor-pointer"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;


