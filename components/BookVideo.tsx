'use client'

import config from "@/lib/config";
import { Video as IKVideo, ImageKitProvider } from "@imagekit/next";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <ImageKitProvider
            urlEndpoint={config.env.imageKit.urlEndpoint}>
            <IKVideo
                src={videoUrl}
                controls={true}
                className="w-full rounded-xl"
            />
        </ImageKitProvider>
    )
}

export default BookVideo;