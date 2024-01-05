"use client";

import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
import useSpotify from "@/hooks/useSpotify";
import {
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { debounce, shuffle } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const colors = [
  "from-zinc-700",
  "from-neutral-700",
  "from-stone-700",
  "from-black",
];

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const [repeat, setRepeat] = useState(false);
  const [shuffleSong, setShuffleSong] = useState(false);

  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        setRepeat(data.body?.item?.is_repeat);
        setShuffleSong(data.body?.item?.shuffle);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const skipPrevious = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setCurrentTrackId(data.body?.item?.id);
      spotifyApi.skipToPrevious();
    });
  };

  const skipNext = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setCurrentTrackId(data.body?.item?.id);
      spotifyApi.skipToNext();
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session, currentTrackId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      if (volume > 0 && volume < 100) {
        debouncedAdjustVolume(volume);
      }
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      if (isPlaying) {
        spotifyApi.setVolume(volume)?.catch((err) => {
          console.log(err);
        });
      }
    }, 100),
    []
  );

  const handleRepeat = () => {
    spotifyApi.setRepeat(repeat ? "off" : "context").catch((err) => {});
    setRepeat(!repeat);
  };

  const handleShuffle = () => {
    spotifyApi.setShuffle(!shuffleSong).catch((err) => {});
    setShuffleSong(!shuffleSong);
  };

  return (
    <div>
      {songInfo && (
        <div
          className={`bg-gradient-to-b rounded sm:rounded-none shadow-xl shadow-neutral-800 mx-4 sm:mx-0 ${color} to-neutral-900 text-white flex justify-between text-xs md:text-base px-4 md:px-8 py-3`}>
          <div className="flex items-center space-x-4">
            <Image
              src={songInfo?.album.images?.[0]?.url}
              alt=""
              width={80}
              height={80}
              className="w-14 h-14 rounded"
              priority
            />
            <div>
              <h3 className="font-semibold truncate">{songInfo?.name}</h3>
              <Link
                href={`/artist/${songInfo?.artists?.[0]?.id}`}
                className="text-neutral-400 hover:underline font-semibold text-xs sm:text-sm truncate">
                {songInfo?.artists?.[0]?.name}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <ArrowsRightLeftIcon
              onClick={handleShuffle}
              className={`${
                shuffleSong ? "text-green-500" : ""
              } button hidden sm:inline-flex`}
            />
            <BackwardIcon
              onClick={skipPrevious}
              className="button hidden sm:inline-flex"
            />
            {isPlaying ? (
              <PauseCircleIcon
                onClick={handlePlayPause}
                className="button w-10 h-10"
              />
            ) : (
              <PlayCircleIcon
                onClick={handlePlayPause}
                className="button w-10 h-10"
              />
            )}
            <ForwardIcon
              onClick={skipNext}
              className="button hidden sm:inline-flex"
            />
            <ArrowPathRoundedSquareIcon
              onClick={handleRepeat}
              className={`${
                repeat ? "text-green-500" : ""
              } button hidden sm:inline-flex`}
            />
          </div>

          <div className="hidden sm:flex items-center justify-end space-x-3 pr-5">
            {volume > 0 ? (
              <SpeakerWaveIcon
                onClick={() => setVolume(0)}
                className="button"
              />
            ) : (
              <SpeakerXMarkIcon
                onClick={() => setVolume(50)}
                className="button"
              />
            )}
            <input
              className="w-14 md:w-28"
              type="range"
              value={volume}
              min={0}
              max={100}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
