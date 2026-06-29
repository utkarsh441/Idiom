import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const SettingsPage = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    gender: 'Male',
    profilePicture: '',
    preferredLanguage: 'English',
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        username: user.username || '',
        gender: user.gender || 'Male',
        profilePicture: user.profilePicture || '',
        preferredLanguage: user.preferredLanguage || 'English', 
        oldPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      
      const updatePayload = {
        fullname: formData.fullname,
        username: formData.username,
        gender: formData.gender,
        profilePicture: formData.profilePicture,
        preferredLanguage: formData.preferredLanguage,
      };

      if (formData.newPassword && formData.newPassword.trim() !== "") {
        updatePayload.oldPassword = formData.oldPassword;
        updatePayload.newPassword = formData.newPassword;
      }

      const res = await axios.put(
        `${API_URL}/api/v1/user/profile/update`, 
        updatePayload, 
        { withCredentials: true }
      );
      
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
        
        // NO API call direct updation
        if (res.data.user && setUser) {
          setUser(res.data.user); 
        }
      } else {
        toast.error(res.data?.message || "Failed to update settings.");
      }
    } catch (err) {
      console.error("Frontend Submit Error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile settings.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B14] p-4 text-slate-200">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800/50 bg-[#0A111E] p-8 shadow-2xl flex flex-col space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800/60 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Account & Identity Settings</h1>
            <p className="text-xs text-slate-500">Tune your personal configurations and language pipelines.</p>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/chats')}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold hover:bg-slate-700 transition-all"
          >
            Back to Workspace
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Username String</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Gender Vector</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Translation Engine Language</label>
              <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none">
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option> 
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Swahili">Swahili</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Profile Image URL Handle</label>
            <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="https://example.com/avatar.jpg" className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none" />
          </div>

          <hr className="border-slate-800/60 my-6" />
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wide">Security Gate: Rotate Credentials</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Current Password</label>
              <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">New Security Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-sm text-slate-200 focus:border-[#00CF85] focus:outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full mt-6 py-3 bg-[#00CF85] text-[#050B14] font-bold rounded-xl shadow-lg hover:bg-[#00b574] transition-all text-sm uppercase tracking-wide">
            💾 Save Profile Configurations
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;