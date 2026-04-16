const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const calculateOverallScore = (feedback: Feedback) => {
    const weightedScore =
        feedback.ATS.score * 0.28 +
        feedback.content.score * 0.24 +
        feedback.structure.score * 0.18 +
        feedback.skills.score * 0.18 +
        feedback.toneAndStyle.score * 0.12;

    return clampScore(weightedScore);
};

export const normalizeFeedbackScores = (feedback: Feedback): Feedback => {
    const normalized: Feedback = {
        ...feedback,
        overallScore: 0,
        ATS: { ...feedback.ATS, score: clampScore(feedback.ATS.score) },
        toneAndStyle: { ...feedback.toneAndStyle, score: clampScore(feedback.toneAndStyle.score) },
        content: { ...feedback.content, score: clampScore(feedback.content.score) },
        structure: { ...feedback.structure, score: clampScore(feedback.structure.score) },
        skills: { ...feedback.skills, score: clampScore(feedback.skills.score) },
    };

    normalized.overallScore = calculateOverallScore(normalized);
    return normalized;
};

export const getScoreTone = (score: number) => {
    if (score >= 85) {
        return {
            label: "High-performing",
            colorClass: "text-green-600",
            surfaceClass: "bg-green-50 border-green-200 text-green-700",
        };
    }

    if (score >= 70) {
        return {
            label: "Strong base",
            colorClass: "text-[#606beb]",
            surfaceClass: "bg-indigo-50 border-indigo-200 text-indigo-700",
        };
    }

    if (score >= 50) {
        return {
            label: "Needs refinement",
            colorClass: "text-yellow-600",
            surfaceClass: "bg-yellow-50 border-yellow-200 text-yellow-700",
        };
    }

    return {
        label: "Needs major work",
        colorClass: "text-red-600",
        surfaceClass: "bg-red-50 border-red-200 text-red-700",
    };
};

