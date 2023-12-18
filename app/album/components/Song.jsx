import { AlbumIdState } from "@/atoms/playlistAtom";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

const Song = ({ order, track, albumId }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isHovered, setIsHovered] = useState(false);
  const [albumIdState, setAlbumIdState] = useRecoilState(AlbumIdState);

  const playSong = () => {
    if (spotifyApi.getAccessToken()) {
      if (currentTrackId === track?.id) {
        spotifyApi.play();
        setIsPlaying(true);
        setAlbumIdState(albumId);
      } else {
        setCurrentTrackId(track.id);
        setIsPlaying(true);
        spotifyApi.play({
          context_uri: `spotify:album:${albumId}`,
          offset: {
            uri: track.uri,
          },
        });
        setAlbumIdState(albumId);
      }
    }
  };

  const pauseSong = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        if (data.body?.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        }
      });
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex justify-between items-center text-neutral-400 py-3 px-5 hover:bg-neutral-900 rounded-lg group"
    >
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
                  }`}
                >
                  {order + 1}
                </p>
              )}
            </>
          )}
        </div>

        <div>
          <p
            className={`${
              currentTrackId === track?.id
                ? "text-green-600 font-bold"
                : "text-white"
            } w-36 lg:w-64 truncate`}
          >
            {track?.name}
          </p>
          <p className="text-sm text-neutral-400">{track?.artists[0].name}</p>
        </div>
      </div>

      <p className="text-sm">{millisToMinutesAndSeconds(track?.duration_ms)}</p>
    </div>
  );
};

export default Song;
