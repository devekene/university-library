'use client'

import Image from "next/image";
import { useRef, useState } from "react";

import config from "@/lib/config";
import { Image as IKImage, Video as IKVideo, ImageKitProvider, upload } from "@imagekit/next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


const {
    env: {
        imageKit: { publicKey, urlEndpoint },
        apiEndpoint,
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${apiEndpoint}/api/auth/imageKit`)

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        const { signature, expire, token } = data

        return { signature, expire, token }
    } catch (error) {
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`)
    }
}

interface Props {
    type: 'image' | 'video';
    accept: string;
    placeholder: string;
    folder: string;
    variant: 'dark' | 'light'
    onFileChange: (filePath: string) => void
    value?: string;
}

const FileUpload = ({ onFileChange, type, accept, placeholder, folder, variant, value }: Props) => {
    const ikUploadRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<{ filePath: string | null }>({ filePath: value ?? null })
    const [progress, setProgress] = useState(0)

    const styles = {
        button: variant === 'dark' ? 'bg-dark-300' : 'bg-light-600 border border-gray-100',
        placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
        text: variant === 'dark' ? 'text-light-100' : 'text-dark-400'
    }

    const onError = (error: unknown) => {
        console.log(error)

        toast.error(`${type} upload failed`, {
            description: `Your ${type} could not be uploaded. Please try again`
        })
    }

    const onSuccess = (res: { filePath: string }) => {
        setFile(res)
        onFileChange(res.filePath)

        toast.message(`${type} uploaded successfully`, {
            description: `${res.filePath} has been uploaded!!`
        })
    }

    const onValidate = (file: File) => {
        if (type === 'image') {
            if (file.size > 20 * 1024 * 1024) {
                toast.warning('File size is too large', {
                    description: "Please upload a file that is less than 20MB in size",
                })

                return false;
            }
        } else if (type === 'video') {
            if (file.size > 50 * 1024 * 1024) {
                toast.warning('File size is too large', {
                    description: "Please upload a file that is less than 50MB in size",
                })

                return false;
            }
        }

        return true
    }

    return (
        <ImageKitProvider
            urlEndpoint={urlEndpoint}
        >
            <input
                type="file"
                ref={ikUploadRef}
                accept={accept}
                className="hidden"
                onChange={async (event) => {
                    const input = event.currentTarget;
                    const selectedFile = input.files?.[0];
                    if (!selectedFile || !onValidate(selectedFile)) return;
                    setProgress(0);
                    try {
                        const auth = await authenticator();
                        const result = await upload({
                            ...auth,
                            publicKey,
                            file: selectedFile,
                            fileName: selectedFile.name,
                            folder,
                            useUniqueFileName: true,
                            onProgress: ({ loaded, total }) => {
                                if (total > 0) setProgress(Math.round((loaded / total) * 100));
                            },
                        });
                        if (!result.filePath) throw new Error("Upload response is missing filePath");
                        onSuccess({ filePath: result.filePath });
                    } catch (error) {
                        setProgress(0);
                        onError(error);
                    } finally {
                        input.value = "";
                    }
                }}
            />

            <button
                className={cn("upload-btn", styles.button)}
                onClick={(e) => {
                    e.preventDefault()

                    if (ikUploadRef.current) {
                        ikUploadRef.current?.click()
                    }
                }}
            >
                <Image
                    src="/icons/upload.svg"
                    alt="upload-icon"
                    width={20}
                    height={20}
                    className="object-contain"
                />
                <p className={cn("text-base", styles.placeholder)}>
                    {placeholder}
                </p>

                {file && <p className={cn("upload-filename", styles.text)}>
                    {file.filePath}
                </p>}
            </button>

            {progress > 0 && progress !== 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}

            {(file && file.filePath !== null) &&
                (type === 'image' ? (<IKImage
                    src={file.filePath}
                    alt={file.filePath}
                    width={500}
                    height={300}
                />
                ) : type === 'video' ? (
                    <IKVideo
                        src={file.filePath}
                        controls={true}
                        className="h-96 w-full rounded-xl"
                    />
                ) : null)
            }
        </ImageKitProvider>
    )
}

export default FileUpload