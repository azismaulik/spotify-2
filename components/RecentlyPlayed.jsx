"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import RecentlyCard from "./RecentlyCard";

const RecentlyPlayed = () => {
  const spotifyApi = useSpotify();
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* {recentlyPlayed?.map((track, i) => (
        <RecentlyCard
          key={i}
          image={track.track.album.images[0].url}
          title={track.track.name}
          playing={true}
        />
      ))} */}
    </div>
  );
};

export default RecentlyPlayed;
