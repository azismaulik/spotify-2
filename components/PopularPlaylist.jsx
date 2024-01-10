"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Album from "./Album";

const PopularPlaylist = () => {
  const [playlists, setPlaylists] = useState([]);

  const spotifyApi = useSpotify();

  const getPopularPlaylist = async () => {
    if (spotifyApi.getAccessToken()) {
      const res = await fetch(
        "https://api.spotify.com/v1/browse/featured-playlists?limit=7",
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }
      );
      const data = await res.json();
      setPlaylists(data.playlists.items);
    }
  };

  useEffect(() => {
    getPopularPlaylist();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mt-14">Popular Playlist</h1>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {playlists?.map((playlist) => (
          <Album
            key={playlist.id}
            image={playlist.images[0].url}
            title={playlist.name}
            description={playlist.description}
            owner={playlist.owner.display_name}
            release={playlist.release_date}
            type={playlist.type}
            id={playlist.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularPlaylist;
