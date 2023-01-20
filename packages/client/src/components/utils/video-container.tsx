import { Fragment, useState } from "react";
import { v4 as uuid } from "uuid";

import { getIconSVG } from "../../utils/icons";

export const VideoContainer = () => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const videos = [
        {
            text: "explain code line by line",
            videoLink:
                "https://www.loom.com/embed/8a372db1e4bb4e0781e25bae396d6e8f?hideEmbedTopBar=true",
        },
        {
            text: "help fix code",
            videoLink:
                "https://www.loom.com/embed/0e8eacf7224747318f9307ca1f2e4a49?hideEmbedTopBar=true",
        },
        {
            text: "ask C programming question",
            videoLink:
                "https://www.loom.com/embed/b3bbf6bc7d7a4adf8f284a1dd209976f?hideEmbedTopBar=true",
        },
        {
            text: "ask question from given code",
            videoLink:
                "https://www.loom.com/embed/ec5ed0b3680846479bdf109d4e9aa8a0?hideEmbedTopBar=true",
        },
        {
            text: "break down task into steps",
            videoLink:
                "https://www.loom.com/embed/4b0dd526a5ab4308a27930af157a5197?hideEmbedTopBar=true",
        },
    ];

    return (
        <div className="help-videos-main-container">
            <div className="help-videos-inline-header">Video Tutorials:</div>

            <div className="inline-video-buttons-container">
                {videos.map((video, index) => {
                    return (
                        <div
                            key={"video-button-" + index + "-" + uuid()}
                            className={"video-button-inline"}
                            onClick={() => {
                                setSelectedVideo(video.videoLink);
                            }}
                        >
                            {getIconSVG("play", "video-button-icon-inline")}
                            <span>{video.text}</span>
                        </div>
                    );
                })}
            </div>
            {selectedVideo && (
                <Fragment>
                    <div
                        className="video-overlay-background"
                        onClick={() => {
                            setSelectedVideo(null);
                        }}
                    ></div>
                    <div className="video-player-open-container">
                        <iframe
                            className="video-player-iframe"
                            src={selectedVideo}
                        ></iframe>

                        <div className="video-buttons-container">
                            <h2>Discover and Learn More Use Cases:</h2>
                            {videos.map((video, index) => {
                                return (
                                    <div
                                        key={
                                            "video-button-" +
                                            index +
                                            "-" +
                                            uuid()
                                        }
                                        className={
                                            "video-button " +
                                            (selectedVideo === video.videoLink
                                                ? "selected-video-button"
                                                : "")
                                        }
                                        onClick={() => {
                                            setSelectedVideo(video.videoLink);
                                        }}
                                    >
                                        {getIconSVG(
                                            "play",
                                            "video-button-icon"
                                        )}
                                        <div className="tooltip">
                                            {video.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};
