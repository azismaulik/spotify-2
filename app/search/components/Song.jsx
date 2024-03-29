import { playlistIdState } from "@/atoms/playlistAtom";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRecoilState } from "recoil";

const Song = ({ track }) => {
  const spotifyApi = useSpotify();
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [playlisId, setPlaylisId] = useRecoilState(playlistIdState);

  const playSong = () => {
    if (currentTrackId === track.id) {
      spotifyApi.play();
      setIsPlaying(true);
    } else {
      setCurrentTrackId(track.id);
      setIsPlaying(true);
      spotifyApi.play({
        uris: [track.uri],
      });
    }
  };

  const pauseSong = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      }
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-1 flex gap-3 p-2 rounded-md hover:bg-neutral-800 text-white"
    >
      <div className="relative w-12 h-12">
        <Image
          src={track.album.images[0].url}
          width={50}
          height={50}
          alt={track.name}
          priority
          className={`${
            isHovered ? "shadow-2xl shadow-black opacity-70" : ""
          } rounded-md aspect-square`}
        />
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-md">
            {isPlaying && currentTrackId === track.id ? (
              <PauseIcon
                onClick={pauseSong}
                className="w-5 h-5 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              />
            ) : (
              <PlayIcon
                onClick={playSong}
                className="w-5 h-5 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-white font-semibold text-sm sm:text-base line-clamp-1">
            {track.name}
          </h1>
          <Link
            href={`/artist/${track.artists[0].id}`}
            className="text-neutral-500 font-semibold text-xs sm:text-sm hover:underline"
          >
            {track.artists[0].name}
          </Link>
        </div>
        <p className="text-neutral-500 font-semibold text-xs sm:text-sm">
          {millisToMinutesAndSeconds(track.duration_ms)}
        </p>
      </div>
    </div>
  );
};

export default Song;
