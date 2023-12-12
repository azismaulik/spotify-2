import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

const Song = ({ order, track }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isHovered, setIsHovered] = useState(false);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
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
      className="grid grid-cols-2 text-neutral-400 py-3 px-5 hover:bg-neutral-900 rounded-lg group">
      <div className="flex items-center space-x-4">
        <div className="w-8">
          {isHovered ? (
            <>
              {currentTrackId === track?.id && isPlaying ? (
                <PauseIcon
                  onClick={pauseSong}
                  className="w-5 h-5 hidden group-hover:inline-flex cursor-pointer text-white"
                />
              ) : (
                <PlayIcon
                  onClick={playSong}
                  className="w-5 h-5 hidden group-hover:inline-flex cursor-pointer text-white"
                />
              )}
            </>
          ) : (
            <>
              {currentTrackId === track?.id && isPlaying ? (
                <Image
                  src="/playing.gif"
                  alt="playing"
                  width={20}
                  height={20}
                  className="w-5 h-5 cursor-pointer text-white"
                />
              ) : (
                <p
                  className={`${
                    currentTrackId === track?.id && !isPlaying
                      ? "text-green-600"
                      : "text-white"
                  }`}>
                  {order + 1}
                </p>
              )}
            </>
          )}
        </div>
        <Image
          src={track?.album.images[0].url}
          alt={track?.name}
          width={100}
          height={100}
          className="h-10 w-10"
        />
        <p
          className={`${
            currentTrackId === track?.id
              ? "text-green-600 font-bold"
              : "text-white"
          } w-36 lg:w-64 truncate`}>
          {track?.name}
        </p>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-44 hidden md:inline text-sm">{track?.album.name}</p>
        <p className="text-sm">
          {millisToMinutesAndSeconds(track?.duration_ms)}
        </p>
      </div>
    </div>
  );
};

export default Song;
