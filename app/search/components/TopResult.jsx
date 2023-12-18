"use state";

import Image from "next/image";
import Link from "next/link";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import useSpotify from "@/hooks/useSpotify";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { playlistIdState } from "@/atoms/playlistAtom";

const TopResult = ({ track }) => {
  const spotifyApi = useSpotify();
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [playlisId, setPlaylisId] = useRecoilState(playlistIdState);

  const handlePlayPause = () => {
    if (isPlaying) {
      spotifyApi.pause();
      setIsPlaying(false);
      setCurrentTrackId(track.id);
    } else {
      if (currentTrackId === track.id) {
        spotifyApi.play();
        setIsPlaying(true);
      } else {
        spotifyApi.play({ uris: [track.uri] });
        setIsPlaying(true);
        setPlaylisId(null);
      }
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-neutral-800/60 hover:bg-neutral-800 transition-all duration-300 p-5 rounded-md relative overflow-hidden"
    >
      {track?.album?.images?.[0]?.url && (
        <Image
          src={track?.album?.images?.[0]?.url}
          alt=""
          width={100}
          height={100}
          priority
          className="aspect-square rounded-lg shadow-2xl shadow-black"
        />
      )}
      <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl capitalize mt-4">
        {track?.name}
      </h1>
      <div className="flex items-center gap-2 mt-4">
        <Link
          href={`/artist/${track?.artists?.[0]?.id}`}
          className="text-white hover:underline font-semibold text-xs sm:text-sm"
        >
          {track?.artists?.[0]?.name}
        </Link>
        <p className="text-neutral-500 font-semibold text-xs sm:text-sm">
          {millisToMinutesAndSeconds(track?.duration_ms)}
        </p>
        <p className="bg-black py-2 px-4 rounded-xl font-bold">Song</p>
      </div>
      <button
        onClick={handlePlayPause}
        className={`p-4 bg-green-500 text-black rounded-full shadow-2xl shadow-black absolute right-6 bottom-6`}
      >
        {isPlaying && currentTrackId === track.id ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default TopResult;
