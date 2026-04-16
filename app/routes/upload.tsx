import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv, ui, puterReady } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        if (!auth.isAuthenticated) {
            await auth.signIn();
            return;
        }

        setIsProcessing(true);

        try {
            const ext = file.name.split('.').pop()?.toLowerCase();
            let feedbackResponse;
            let resumePath = '';
            let imagePath = '';

            // Handle based on file type
            if (ext === 'pdf') {
                setStatusText('Uploading PDF…');
                const uploadedFile = await fs.upload([file]);
                const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
                if (!fileItem || !fileItem.path) throw new Error('Failed to upload file');
                resumePath = fileItem.path;

                setStatusText('Converting to image (Faster AI processing)…');
                const imageResult = await convertPdfToImage(file);
                if (imageResult.file) {
                    setStatusText('Uploading the image…');
                    const uploadedImage = await fs.upload([imageResult.file]);
                    const imageItem = Array.isArray(uploadedImage) ? uploadedImage[0] : uploadedImage;
                    if(imageItem?.path) imagePath = imageItem.path;
                }

                setStatusText('Analyzing PDF (Claude Haiku)…');
                feedbackResponse = await ai.feedback(resumePath, prepareInstructions({ jobTitle, jobDescription }), "file");
            } 
            else if (ext === 'docx' || ext === 'txt') {
                let text = '';
                if (ext === 'docx') {
                    setStatusText('Extracting text from DOCX…');
                    text = await ai.extractTextFromDocx(file);
                } else {
                    setStatusText('Reading text file…');
                    text = await file.text();
                }

                // Still upload the original file for the user profile view
                setStatusText('Uploading original document…');
                const uploadedFile = await fs.upload([file]);
                const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
                if (fileItem?.path) resumePath = fileItem.path;

                setStatusText('Analyzing text (Claude Haiku)…');
                feedbackResponse = await ai.feedback(text, prepareInstructions({ jobTitle, jobDescription }), "text");
            } else {
                throw new Error('Unsupported file format');
            }

            if (!feedbackResponse) throw new Error('Failed to analyze resume');

            const feedbackText = typeof feedbackResponse.message.content === 'string'
                ? feedbackResponse.message.content
                : (feedbackResponse.message.content as any)[0].text;

            // Extract JSON
            let cleanJson = feedbackText;
            if (feedbackText.includes('```json')) {
                cleanJson = feedbackText.split('```json')[1].split('```')[PartOneToIndex(feedbackText, '```json')].trim();
            } else if (feedbackText.includes('```')) {
                cleanJson = feedbackText.split('```')[1].split('```')[0].trim();
            }
            
            // Note: Helper to find end of tag if split fails
            function PartOneToIndex(str: string, tag: string) {
                 return 0; // standard split logic usually works
            }

            const data = {
                id: generateUUID(),
                resumePath,
                imagePath,
                companyName, jobTitle, jobDescription,
                feedback: JSON.parse(cleanJson),
            }

            setStatusText('Saving results…');
            await kv.set(`resume:${data.id}`, JSON.stringify(data));
            
            setStatusText('Complete! Redirecting…');
            
            ui.notify({
                title: "Resume Analyzed!",
                text: `Score: ${data.feedback.overallScore}/100.`,
                icon: "success"
            });

            navigate(`/resume/${data.id}`);

        } catch (err: any) {
            console.error(err);
            const msg = err.message || 'Processing failed';
            setStatusText(`Error: ${msg}`);
            ui.alert("Analysis Error", msg);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1 className="text-pretty">Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2 className="animate-pulse">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" width={400} height={300} />
                        </>
                    ) : (
                        <h2>Drop your resume (PDF, DOCX, TXT) for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <div className="w-full max-w-4xl mt-8">
                            {!auth.isAuthenticated ? (
                                <div className="gradient-border p-12 text-center flex flex-col items-center gap-6">
                                    <h2 className="!text-black">Please sign in to analyze your resume</h2>
                                    <p className="text-gray-500 max-w-md">Your resume and feedback will be securely saved to your personal Puter account.</p>
                                    <button 
                                        onClick={() => auth.signIn()} 
                                        className="primary-button w-fit px-12 text-xl font-semibold"
                                    >
                                        Sign In with Puter
                                    </button>
                                </div>
                            ) : (
                                <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="form-div">
                                        <label htmlFor="company-name">Company Name</label>
                                        <input 
                                            type="text" 
                                            name="company-name" 
                                            placeholder="e.g., Google, Tesla, Stripe…" 
                                            id="company-name" 
                                            autoComplete="organization"
                                        />
                                    </div>
                                    <div className="form-div">
                                        <label htmlFor="job-title">Job Title</label>
                                        <input 
                                            type="text" 
                                            name="job-title" 
                                            placeholder="e.g., Software Engineer, Product Manager…" 
                                            id="job-title" 
                                            autoComplete="organization-title"
                                        />
                                    </div>
                                    <div className="form-div">
                                        <label htmlFor="job-description">Job Description</label>
                                        <textarea 
                                            rows={5} 
                                            name="job-description" 
                                            placeholder="Describe the role and key requirements…" 
                                            id="job-description" 
                                        />
                                    </div>

                                    <div className="form-div">
                                        <label htmlFor="uploader">Upload Resume</label>
                                        <FileUploader onFileSelect={handleFileSelect} />
                                    </div>

                                    <button className="primary-button" type="submit">
                                        Start Analysis Report
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
