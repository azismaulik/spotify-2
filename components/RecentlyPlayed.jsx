"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import RecentlyCard from "./RecentlyCard";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { useRecoilState } from "recoil";

const RecentlyPlayed = () => {
  const spotifyApi = useSpotify();
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyRecentlyPlayedTracks({
          limit: 6,
        })
        .then((data) => {
          setRecentlyPlayed(data.body.items);
        });
    }
  }, [currentTrackId, spotifyApi]);

  const playSong = (id) => {
    setCurrentTrackId(id);
    setIsPlaying(true);
    if (currentTrackId === id) {
      spotifyApi
        .play()
        .catch((err) => console.log("Something went wrong!", err));
    } else {
      spotifyApi
        .play({
          uris: [`spotify:track:${id}`],
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
    spotifyApi
      .pause()
      .catch((err) => console.log("Something went wrong!", err));
  };

  useEffect(() => {});
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
      {recentlyPlayed?.map((track, i) => (
        <RecentlyCard
          key={i}
          image={track.track.album.images[0].url}
          title={track.track.name}
          playing={
            currentTrackId === track.track.id && isPlaying ? true : false
          }
          id={track.track.id}
          handlePauseSong={() => pauseSong(track.track.id)}
          handlePlaySong={() => playSong(track.track.id)}
        />
      ))}
    </div>
  );
};

export default RecentlyPlayed;
