import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react";

export default function TitleForm({ title}) {
    const navigate = useNavigate();

  return (    
    <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#0F2942] hover:text-[#E53E3E] hover:bg-[#F7FAFC] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <h1 className="font-serif text-2xl font-semibold text-[#0F2942] tracking-tight">{title}</h1>
      </div>
  )
}