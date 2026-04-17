export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Tech Solutions Inc.",
        jobTitle: "Senior Frontend Engineer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Global Cloud Systems",
        jobTitle: "DevOps Architect",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Innovative Apps Ltd.",
        jobTitle: "Mobile Product Lead",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({jobTitle, jobDescription}: { jobTitle: string; jobDescription: string; }) =>
    `You are an elite Senior Hiring Manager and ATS expert. 
      Analyze the provided resume against the target role: "${jobTitle}"
      
      Job Context:
      ${jobDescription || "Standard industry competency requirements apply."}

      Perform a multi-layered analysis based on these core prompts:
      
      1. THE BRUTAL HONEST REVIEW:
      Pretend you are a senior hiring manager in this industry. Tell the user honestly what's weak, what's missing, and what would make you reject this resume immediately.
      
      2. THE ATS OPTIMIZER:
      Compare the job requirements with the resume and specify exactly which keywords are missing, which skills to highlight, and how to restructure bullet points to pass screening.
      
      3. THE BULLET POINT TRANSFORMER:
      Evaluate bullet points using the formula: Action Verb + Task + Measurable Result. Suggest improvements where data/numbers are missing.
      
      4. THE INDUSTRY TONE MATCH:
      Analyze if the resume summary and skills sound like an industry insider or a generic applicant. Suggest rewrites to sound authentic to the field.
      
      5. THE FINAL POLISH:
      Check for consistency in tense, overused cliches (like 'team player'), and generic phrasing. Recommend specific, powerful language.

      Rating System:
      Be honest and rigorous. Give low scores for generic or weak content. 
      The goal is to provide high-signal, specific feedback that drives immediate results.

      Format the entire analysis as a single JSON object matching this structure:
      ${AIResponseFormat}
      
      Return ONLY the JSON object. No markdown backticks, no preamble.`;
