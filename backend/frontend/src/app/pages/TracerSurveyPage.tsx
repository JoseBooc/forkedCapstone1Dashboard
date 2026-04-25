import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TracerSurveyPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-4 px-6 py-3 bg-[#003087] shadow-md shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-orange-300 transition-colors font-semibold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <span className="text-white font-bold text-base">Graduate Tracer Survey</span>
      </div>
      <iframe
        src="http://localhost:8002"
        title="Graduate Tracer Survey"
        className="flex-1 w-full border-none"
      />
    </div>
  );
}
