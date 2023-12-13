import { playlistIdState } from "@/atoms/playlistAtom";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { formatDateToMonthDateYear } from "@/lib/date";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Song = ({ order, track, idPlaylist, savedTracks }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isHovered, setIsHovered] = useState(false);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  const pauseSong = () => {
    setIsPlaying(false);
    spotifyApi.pause();
  };

  const playSongByPlaylist = () => {
    if (currentTrackId === track.track.id) {
      spotifyApi.play(); // If the current track is the same as the one being played, just resume play.
      setIsPlaying(true);
    } else if (savedTracks) {
      setCurrentTrackId(track.track.id);
      setIsPlaying(true);
      spotifyApi.play({
        uris: [track.track.uri],
      });
    } else {
      setCurrentTrackId(track.track.id);
      setIsPlaying(true);
      setPlaylistId(idPlaylist);
      spotifyApi.play({
        context_uri: `spotify:playlist:${idPlaylist}`,
        offset: {
          uri: track.track.uri,
        },
        position_ms: 0,
      });
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="grid grid-cols-2 text-neutral-400 py-3 px-5 hover:bg-neutral-900 rounded-lg group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-8">
          {isHovered ? (
            <>
              {currentTrackId === track.track.id && isPlaying ? (
                <PauseIcon
                  onClick={pauseSong}
                  className="w-5 h-5 hidden group-hover:inline-flex cursor-pointer text-white"
                />
              ) : (
                <PlayIcon
                  onClick={playSongByPlaylist}
                  className="w-5 h-5 hidden group-hover:inline-flex cursor-pointer text-white"
                />
              )}
            </>
          ) : (
            <>
              {currentTrackId === track?.track.id && isPlaying ? (
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
                    currentTrackId === track?.track.id && !isPlaying
                      ? "text-green-600"
                      : "text-white"
                  }`}
                >
                  {order + 1}
                </p>
              )}
            </>
          )}
        </div>
        <Image
          src={track?.track.album.images[0].url}
          alt={track?.track.name}
          width={100}
          height={100}
          className="h-10 w-10"
        />
        <div>
          <p
            className={`${
              currentTrackId === track?.track.id
                ? "text-green-600 font-bold"
                : "text-white"
            } w-36 lg:w-64 truncate`}
          >
            {track?.track.name}
          </p>
          <Link
            href={`/artist/${track?.track.artists[0].id}`}
            className="w-40 text-sm hover:underline"
          >
            {track?.track.artists[0].name}
          </Link>
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
