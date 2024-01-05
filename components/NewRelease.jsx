"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Album from "./Album";

const NewRelease = () => {
  const [playlists, setPlaylists] = useState([]);

  const spotifyApi = useSpotify();

  const getNewRelease = async () => {
    if (spotifyApi.getAccessToken()) {
      const res = await fetch(
        "https://api.spotify.com/v1/browse/new-releases?limit=6",
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }
      );
      const data = await res.json();
      setPlaylists(data.albums.items);
    }
  };

  useEffect(() => {
    getNewRelease();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mt-14">New Release</h1>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {playlists?.map((playlist) => (
          <Album
            key={playlist.id}
            image={playlist.images[0].url}
            title={playlist.name}
            owner={playlist.artists[0].name}
            release={playlist.release_date}
            type={playlist.type}
            id={playlist.id}
          />
        ))}
      </div>
    </div>
  );
};

export default NewRelease;
