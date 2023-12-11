import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { formatDateToMonthDateYear } from "@/lib/date";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Song = ({ order, track }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [deviceId, setDeviceId] = useState("");

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      onClick={playSong}
      className="grid grid-cols-2 text-neutral-400 py-3 px-5 hover:bg-neutral-900 rounded-lg cursor-pointer group"
    >
      <div className="flex items-center space-x-4">
        <p className="group-hover:hidden">{order + 1}</p>
        <PlayIcon className="h-5 w-5 hidden group-hover:inline-flex" />
        <Image
          src={track?.track.album.images[0].url}
          alt={track?.track.name}
          width={100}
          height={100}
          className="h-10 w-10"
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">
            {track?.track.name}
          </p>
          <p className="w-40 text-sm">{track?.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-44 hidden md:inline text-sm">
          {track?.track.album.name}
        </p>
        <p className="hidden xl:inline text-sm">
          {formatDateToMonthDateYear(track?.added_at)}
        </p>
        <p className="text-sm">
          {millisToMinutesAndSeconds(track?.track.duration_ms)}
        </p>
      </div>
    </div>
  );
};

export default Song;
