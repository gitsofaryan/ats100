import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { formatDate } from "~/lib/utils";
import { getScoreTone } from "~/lib/scoring";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath, createdAt } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState("");
    const tone = getScoreTone(feedback.overallScore);

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            setResumeUrl(url);
        };

        loadResume();
    }, [imagePath, fs]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-3">
                    <div className={`score-pill ${tone.surfaceClass} w-fit`}>
                        {tone.label}
                    </div>
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                    <p className="text-sm text-gray-500">Saved {formatDate(createdAt)}</p>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </Link>
    );
};

export default ResumeCard;
