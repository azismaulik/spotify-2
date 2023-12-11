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
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(40);

  const songInfo = useSongInfo();

  const [repeat, setRepeat] = useState(false);

  const [shuffle, setShuffle] = useState(false);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

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
    spotifyApi.skipToPrevious();
    fetchCurrentSong();
  };

  const skipNext = () => {
    spotifyApi.skipToNext();
    fetchCurrentSong();
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(40);
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
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 100),
    []
  );

  const handleRepeat = () => {
    spotifyApi.setRepeat(repeat ? "off" : "context").catch((err) => {});
    setRepeat(!repeat);
  };

  const handleShuffle = () => {
    spotifyApi.setShuffle(!shuffle).catch((err) => {});
    setShuffle(!shuffle);
  };

  return (
    <div className="sticky bottom-0">
      {songInfo && (
        <div className="bg-gradient-to-b from-black to-neutral-900 border-t border-neutral-800 text-white grid grid-cols-3 text-xs md:text-base">
          <div className="flex items-center space-x-4 px-8 py-3">
            <Image
              src={songInfo?.album.images?.[0]?.url}
              alt=""
              width={80}
              height={80}
              className="hidden md:inline w-20 h-20 rounded"
              priority
            />
            <div>
              <h3 className="font-semibold">{songInfo?.name}</h3>
              <p className="text-neutral-400 font-semibold text-xs sm:text-sm">
                {songInfo?.artists?.[0]?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-evenly">
            <ArrowsRightLeftIcon
              onClick={handleShuffle}
              className={`${shuffle ? "text-green-500" : ""} button`}
            />
            <BackwardIcon onClick={skipPrevious} className="button" />
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
            <ForwardIcon onClick={skipNext} className="button" />
            <ArrowPathRoundedSquareIcon
              onClick={handleRepeat}
              className={`${repeat ? "text-green-500" : ""} button`}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pr-5">
            {volume > 0 ? (
              <SpeakerWaveIcon
                onClick={() => setVolume(0)}
                className="button"
              />
            ) : (
              <SpeakerXMarkIcon
                onClick={() => setVolume(40)}
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
