import React from "react";
import {
  DESPARRAMO_BANDCAMP_TRACK_IDS,
  desparramoTrackEmbedSrc,
} from "../lib/desparramoBandcamp";

type Props = {
  className?: string;
};

/** Un iframe de Bandcamp por tema: el player de álbum no puede mostrar la lista sin scroll interno. */
export default function DesparramoBandcampEmbeds({ className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-2 w-full max-w-[700px] ${className}`}>
      {DESPARRAMO_BANDCAMP_TRACK_IDS.map((trackId, i) => (
        <iframe
          key={trackId}
          style={{ border: 0, width: "100%", height: 120 }}
          src={desparramoTrackEmbedSrc(trackId)}
          seamless
          title={`Tema ${i + 1} — Desparramo V/A (Bandcamp)`}
          loading={i > 2 ? "lazy" : undefined}
        />
      ))}
    </div>
  );
}
