"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect } from "react";

const RecentlyPlayed = () => {
  const spotifyApi = useSpotify();

  useEffect(() => {
    if (!spotifyApi.getAccessToken()) return;
    spotifyApi.getMyRecentlyPlayedTracks().then((data) => {
      console.log(data);
    });
  });
  return <div></div>;
};

export default RecentlyPlayed;
