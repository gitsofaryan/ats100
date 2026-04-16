import React from "react";
import { cn } from "~/lib/utils";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const tone = score > 69 ? "good" : score > 49 ? "average" : "poor";
  
  const accentColor = tone === "good" 
    ? "text-green-600" 
    : tone === "average" 
      ? "text-amber-600" 
      : "text-red-600";

  const statusLabel = tone === "good" 
    ? "ATS Compatible" 
    : tone === "average" 
      ? "Partial Match" 
      : "High Filter Risk";

  return (
    <div className="report-shell">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <span className={cn("eyebrow w-fit capitalize", accentColor)}>
            {statusLabel}
          </span>
          <h2 className="text-4xl font-bold !text-black">ATS Readiness Analysis</h2>
          <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
            Applicant Tracking Systems use specific parsing algorithms to rank your relevance. This score measures how effectively your structure and keywords align with these automated screeners.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-8 rounded-[40px] bg-gradient-to-br from-white to-[#f7f8ff] border border-white/80 shadow-inner min-w-[180px]">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Score</span>
          <span className={cn("text-6xl font-black", accentColor)}>{score}</span>
          <span className="text-sm font-semibold text-gray-500 mt-1">out of 100</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className={cn(
              suggestion.type === "good" ? "tip-card-good" : "tip-card-improve"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "size-8 rounded-full flex items-center justify-center shadow-sm",
                suggestion.type === "good" ? "bg-white" : "bg-white"
              )}>
                <img
                  src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt={suggestion.type === "good" ? "Success" : "Warning"}
                  className="size-4"
                />
              </div>
              <p className="font-semibold text-lg">{suggestion.type === "good" ? "Strength" : "Improvement"}</p>
            </div>
            <p className="text-base leading-relaxed mt-1 opacity-90">
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-3xl bg-[#f7f8ff]/50 border border-dashed border-gray-200">
        <p className="text-gray-600 italic text-center">
            "Keep refining your resume until both ATS compatibility and role alignment improve. Modern hiring systems prioritize context and impact over simple keyword stuffing."
        </p>
      </div>
    </div>
  );
};

export default ATS;
