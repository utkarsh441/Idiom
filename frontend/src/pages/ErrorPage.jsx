import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  
  const errorMessage = location.state?.message || "An unexpected error occurred.";
  const errorStatus = location.state?.status || "Error";

  console.error("Caught Application Error:", { status: errorStatus, message: errorMessage });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050B14] p-6 text-center text-slate-200 font-sans">
      <div className="max-w-md w-full p-8 bg-[#0A111E] border border-slate-800 rounded-2xl shadow-2xl space-y-5">
        <div className="text-5xl text-red-500">
          Alert
        </div>
        
        <h1 className="text-2xl font-bold text-slate-100">Application Error</h1>
        
        
        <p className="text-sm text-slate-400 bg-[#050B14] p-4 rounded-xl border border-slate-900 font-mono text-left break-words">
          {errorMessage}
        </p>

        <div className="text-xs font-mono px-3 py-1 bg-red-950/20 text-red-400 border border-red-900/30 rounded-lg inline-block">
          Status Code: {errorStatus}
        </div>

        <div className="pt-2">

          <button
            onClick={() => navigate(-1)} 
            className="w-full py-2.5 bg-[#00CF85] text-[#050B14] font-bold rounded-xl shadow-md hover:bg-[#00b574] transition-all text-sm"
          >
            Go Back to Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;