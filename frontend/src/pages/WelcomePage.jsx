import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B14] p-4 font-sans">
      <div className="w-full max-w-[480px] rounded-2xl border border-slate-800/50 bg-[#0A111E] p-10 shadow-2xl text-center">
        
        {/*Header */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#00CF85]">
            Welcome to Idiom
          </h1>
          <p className="mt-3 text-base text-slate-400">
            Connect, converse, and collaborate in real-time.
          </p>
        </div>

       
        <div className="mt-10 grid grid-cols-2 gap-4">
          
          {/* Login */}
          <button
            onClick={() => navigate('/login')}
            className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#050B14] p-6 hover:border-[#00CF85]/50 hover:bg-[#050B14]/80 transition-all group"
          >
            <div className="text-sm font-semibold text-slate-200 group-hover:text-[#00CF85]">
              Sign In
            </div>
            <span className="text-xs text-slate-500 mt-1">Already a member</span>
          </button>

          {/* Register */}
          <button
            onClick={() => navigate('/register')}
            className="flex flex-col items-center justify-center rounded-xl bg-[#00CF85] p-6 hover:bg-[#00b574] active:scale-[0.99] transition-all shadow-lg shadow-[#00CF85]/5"
          >
            <div className="text-sm font-semibold text-[#050B14]">
              Create Account
            </div>
            <span className="text-xs text-[#050B14]/70 mt-1">Join us today</span>
          </button>

        </div>

        <div className="mt-8 text-xs text-slate-600">
          Secure, encrypted, and fast messaging.
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;