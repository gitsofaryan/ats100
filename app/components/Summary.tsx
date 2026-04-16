import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { getScoreTone } from "~/lib/scoring";
import { cn } from "~/lib/utils";

const Category = ({ title, score }: { title: string, score: number }) => {
    const tone = getScoreTone(score);

    return (
        <div className="rounded-2xl bg-white/60 border border-white/80 p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={cn("absolute top-0 right-0 w-1.5 h-full opacity-60", tone.colorClass.replace('text-', 'bg-'))} />
            <div className="flex flex-row justify-between items-center relative z-10">
                <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
                    <div className="flex flex-row gap-2 items-center">
                        <span className="text-2xl font-black text-gray-900">{score}</span>
                        <span className="text-gray-400 font-semibold">/100</span>
                    </div>
                </div>
                <div className={cn("p-2 rounded-xl bg-gray-50 group-hover:bg-white transition-colors shadow-inner", tone.colorClass)}>
                    <ScoreBadge score={score} />
                </div>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const tone = getScoreTone(feedback.overallScore);

    return (
        <div className="report-shell">
            <div className="summary-hero !p-8 !rounded-[36px] !bg-white/40 !backdrop-blur-2xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center w-full">
                    <div className="rounded-[40px] bg-white p-6 shadow-2xl shrink-0">
                        <ScoreGauge score={feedback.overallScore} />
                    </div>

                    <div className="flex flex-col gap-6 flex-grow">
                        <div className={cn("score-pill w-fit !px-6 !py-2 !text-base", tone.surfaceClass)}>
                            <div className={cn("size-2 rounded-full", tone.colorClass.replace('text-', 'bg-'))} />
                            {tone.label} Awareness
                        </div>
                        <div>
                            <h2 className="text-4xl font-black !text-black leading-tight">Composite Resume Intelligence</h2>
                            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                                Your overall score is a weighted aggregation of semantic role-fit, syntactic structure, and automated readability metrics.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="rounded-full bg-white/80 border border-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
                                <span className="text-gray-400 mr-2">Benchmarked:</span> Top 15%
                            </div>
                            <div className="rounded-full bg-white/80 border border-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
                                <span className="text-gray-400 mr-2">Sentiment:</span> Professional
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Category title="ATS Readiness" score={feedback.ATS.score} />
                <Category title="Content Depth" score={feedback.content.score} />
                <Category title="Visual Structure" score={feedback.structure.score} />
                <Category title="Role Alignment" score={feedback.skills.score} />
            </div>
        </div>
    );
};

export default Summary;
