// src/components/YouTubeEmbed.tsx

import React from 'react';

interface YouTubeEmbedProps {
  videoUrl: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl }) => {
  return (
    <div className="relative overflow-hidden pb-[56.25%] h-0">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoUrl}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
