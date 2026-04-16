import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'
import { usePuterStore } from '../lib/puter'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const { ui, fs } = usePuterStore();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;

    const handlePuterPicker = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const puterFile = await ui.showOpenFilePicker();
            if (puterFile) {
                const blob = await fs.read(puterFile.path);
                if (blob) {
                    const file = new File([blob], puterFile.name, { type: blob.type });
                    onFileSelect?.(file);
                    ui.notify({
                        title: "File Loaded",
                        text: `Selected ${puterFile.name} from Puter Drive.`,
                        icon: "success"
                    });
                }
            }
        } catch (err) {
            console.error("Picker error:", err);
        }
    }

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img 
                                src={file.name.endsWith('.pdf') ? '/images/pdf.png' : '/icons/info.svg'} 
                                alt="file" 
                                className="size-10 object-contain" 
                            />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer transition-transform hover:scale-110" onClick={(e) => {
                                onFileSelect?.(null)
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ): (
                        <div className="flex flex-col items-center">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-400 mt-1 mb-4">PDF, DOCX, or TXT (max {formatSize(maxFileSize)})</p>
                            
                            <button 
                                onClick={handlePuterPicker}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-[#8e98ff]/20 rounded-full hover:bg-[#8e98ff]/10 transition-all text-[#606beb] font-semibold text-sm"
                            >
                                <img src="/icons/info.svg" className="size-4" alt="puter" />
                                Select from Puter Drive
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
