/** Desparramo V/A — IDs de Bandcamp (álbum y temas en orden). */

export const DESPARRAMO_BANDCAMP_ALBUM_ID = 2883471037;

/** IDs de tema en orden (coinciden con `tracklist` en editions). */
export const DESPARRAMO_BANDCAMP_TRACK_IDS: readonly number[] = [
  2448731708, 2413284168, 3065875762, 2812433413, 2870905065, 1238448392,
  1843860031, 3507259977, 3782331159, 4207641524,
];

export function desparramoTrackEmbedSrc(trackId: number): string {
  return `https://bandcamp.com/EmbeddedPlayer/album=${DESPARRAMO_BANDCAMP_ALBUM_ID}/track=${trackId}/size=small/bgcol=333333/linkcol=ffffff/transparent=true/`;
}
