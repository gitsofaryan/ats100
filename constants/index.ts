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

      Perform a multi-layered analysis based on these core prompts, and map them to the corresponding JSON output sections:
      
      1. THE BRUTAL HONEST REVIEW (Output to "content" section):
      Pretend you are a senior hiring manager in this industry. Tell the user honestly what's weak, what's missing, and what would make you reject this resume immediately. Score strictly based on content depth.
      
      2. THE ATS OPTIMIZER (Output to "ATS" section):
      Compare the job requirements with the resume and specify exactly which keywords are missing, which skills to highlight, and how to restructure bullet points to pass screening. Score strictly based on keyword and matching.
      
      3. THE BULLET POINT TRANSFORMER (Output to "structure" section):
      Rewrite each of my bullet points using the formula: Action Verb + Task + Measurable Result. If numbers are missing, ask for them. Score based on visual structure and layout.
      
      4. THE INDUSTRY TONE MATCH (Output to "skills" section):
      Analyze if the resume summary and skills sound like an industry insider or a generic applicant. Suggest rewrites to sound authentic to the field. Score based on role alignment and skills.
      
      5. THE FINAL POLISH (Output to "toneAndStyle" section):
      Do a final review. Check for: consistency in tense, clichés (like 'team player'), anything that sounds generic. Replace all of it with specific, powerful language. Score based on tone and style.

      CRITICAL SCORING INSTRUCTIONS:
      - NEVER just output "82" as the default score! You MUST dynamically calculate the "overallScore" based purely on the actual quality of the provided resume. If the resume is terrible, give it a 35. If it is outstanding, give it a 92. Give highly variable, accurate scores.
      - Each section must also have its own dynamic score (0-100) reflecting that specific category.
      - Keep explanations EXTREMELY CONCISE. Maximum 1-2 short sentences per tip. Do not ramble.
      - Provide 3-4 specific, actionable tips per section.

      Format the entire analysis as a single JSON object matching this structure exactly:
      ${AIResponseFormat}
      
      Return ONLY the valid JSON object. No markdown backticks, no preamble.`;
