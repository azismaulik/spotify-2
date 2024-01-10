"use client";

import useSpotify from "@/hooks/useSpotify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const RelatedArtist = () => {
  const spotifyApi = useSpotify();
  const [relatedArtists, setRelatedArtists] = useState([]);

  const [artistId, setArtistId] = useState(null);
  const [artistName, setArtistName] = useState(null);

  const getTopArtists = () => {
    spotifyApi
      .getMyTopArtists()
      .then((data) => {
        setArtistId(data.body?.items[0].id);
        setArtistName(data.body?.items[0].name);
      })
      .catch((err) => console.log("Something went wrong!", err));
  };

  const getRelatedArtists = async () => {
    const accessToken = spotifyApi.getAccessToken();
    if (accessToken) {
      const url = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await fetch(url, { headers });
      const data = await response.json();
      setRelatedArtists(data.artists);
    }
  };

  useEffect(() => {
    getTopArtists();
  }, []);

  useEffect(() => {
    if (artistId) {
      getRelatedArtists();
    }
  }, [artistId]);

  return (
    <div>
      <h1 className="text-3xl font-bold mt-14">Artist Like {artistName}</h1>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {relatedArtists.slice(0, 7)?.map((artist, i) => (
          <Link
            href={`/artist/${artist?.id}`}
            key={i}
            className="flex-1 rounded-md p-3 bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
          >
            <Image
              className="rounded-full shadow-2xl shadow-black aspect-square"
              src={artist?.images[0]?.url}
              width={200}
              height={200}
              alt="Artist"
              priority
            />
            <h1 className="text-white font-bold mt-3 truncate">
              {artist?.name}
            </h1>
            <p className="text-neutral-400 text-xs mt-1">Artist</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArtist;
