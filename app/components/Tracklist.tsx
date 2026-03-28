import React from "react";

export type TracklistEntry = {
  number: number;
  artist: string;
  title: string;
  duration: string;
};

type Props = {
  tracks: TracklistEntry[];
  className?: string;
};

export default function Tracklist({ tracks, className = "" }: Props) {
  return (
    <div className={`bg-[#0B0B0B] rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Tracklist</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 list-none p-0 m-0">
        {tracks.map((track) => (
          <li key={track.number} className="flex items-start gap-3 text-sm text-gray-300">
            <span className="text-gray-500 font-mono text-xs w-6 flex-shrink-0 tabular-nums">
              {track.number}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium">
                <span className="text-gray-200">{track.artist}</span>
                <span className="text-gray-500 mx-1.5">—</span>
                <span>{track.title}</span>
              </div>
            </div>
            <span className="text-gray-500 text-xs font-mono flex-shrink-0 tabular-nums">
              {track.duration}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
