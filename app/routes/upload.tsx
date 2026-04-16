import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv, puterReady } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        try {
            const ext = file.name.split('.').pop()?.toLowerCase();
            let feedbackResponse;
            let resumePath = '';
            let imagePath = '';

            // Handle based on file type
            if (ext === 'pdf') {
                setStatusText('Uploading PDF...');
                const uploadedFile = await fs.upload([file]);
                const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
                if (!fileItem || !fileItem.path) throw new Error('Failed to upload file');
                resumePath = fileItem.path;

                setStatusText('Converting to image (Faster AI processing)...');
                const imageResult = await convertPdfToImage(file);
                if (imageResult.file) {
                    const uploadedImage = await fs.upload([imageResult.file]);
                    const imageItem = Array.isArray(uploadedImage) ? uploadedImage[0] : uploadedImage;
                    if(imageItem?.path) imagePath = imageItem.path;
                }

                setStatusText('Analyzing PDF (Claude Haiku)...');
                feedbackResponse = await ai.feedback(resumePath, prepareInstructions({ jobTitle, jobDescription }), "file");
            } 
            else if (ext === 'docx' || ext === 'txt') {
                let text = '';
                if (ext === 'docx') {
                    setStatusText('Extracting text from DOCX...');
                    text = await ai.extractTextFromDocx(file);
                } else {
                    setStatusText('Reading text file...');
                    text = await file.text();
                }

                // Still upload the original file for the user profile view
                setStatusText('Uploading original document...');
                const uploadedFile = await fs.upload([file]);
                const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
                if (fileItem?.path) resumePath = fileItem.path;

                setStatusText('Analyzing text (Claude Haiku)...');
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

            setStatusText('Saving results...');
            await kv.set(`resume:${data.id}`, JSON.stringify(data));
            
            setStatusText('Complete! Redirecting...');
            navigate(`/resume/${data.id}`);

        } catch (err: any) {
            console.error(err);
            setStatusText(`Error: ${err.message || 'Processing failed'}`);
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
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2 className="animate-pulse">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume (PDF, DOCX, TXT) for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
