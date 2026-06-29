import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const RegisterCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',       
    password: '',
    confirmpassword: '' 
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

    if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`, 
        {
          username: formData.username,
          fullname: formData.fullname,       
          password: formData.password,
          confirmpassword: formData.confirmpassword 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        }
      );

      //  Modified the login part for safe login after edit 
      if (response.status === 201 || response.status === 200) {
        console.log('User registered successfully!');
        toast.success('Account created successfully! Please log in.');
        navigate('/login'); 
      }
    } catch (err) {
      console.log("--- FULL BACKEND ERROR OBJECT ---", err);
      console.log("--- EXACT SERVER RESPONSE MESSAGE ---", err.response?.data);

      const backendErrorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || 'Registration failed. Please verify your details and try again.';

      const backendStatus = err.response?.status || 400;

      navigate('/error', { 
        state: { 
          message: backendErrorMessage, 
          status: backendStatus 
        } 
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B14] p-4 font-sans">
      <div className="w-full max-w-[440px] rounded-2xl border border-slate-800/50 bg-[#0A111E] p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#00CF85]">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">Join and start chatting in real-time</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="text-center text-sm text-red-400 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
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
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullname" 
              value={formData.fullname}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-[#00CF85] focus:outline-none focus:ring-1 focus:ring-[#00CF85] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword" 
              value={formData.confirmpassword}
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
            Sign Up & Launch Chat
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-medium text-[#00CF85] hover:underline bg-transparent border-none cursor-pointer">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;