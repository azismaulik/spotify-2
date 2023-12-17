"use client";

import Album from "@/components/Album";
import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const colors = [
  "red-600",
  "blue-600",
  "green-600",
  "yellow-600",
  "pink-600",
  "purple-600",
  "violet-600",
  "fuchsia-600",
  "rose-600",
  "sky-600",
  "cyan-600",
  "emerald-600",
  "lime-600",
  "amber-600",
  "indigo-600",
  "orange-600",
  "teal-600",
];

const CategoryDetails = () => {
  const { id } = useParams();
  const spotifyApi = useSpotify();
  const [playlist, setPlaylist] = useState(null);

  const [name, setName] = useState(null);

  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [id]);

  const getCategories = async () => {
    const res = await fetch(
      `https://api.spotify.com/v1/browse/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    );
    const data = await res.json();
    setName(data.name);
  };

  const getPlaylist = async () => {
    const res = await fetch(
      `https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    );
    const data = await res.json();
    setPlaylist(data.playlists.items);
  };

  useEffect(() => {
    if (id) {
      getPlaylist();
      getCategories();
    }
  }, [id]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <section
        className={`flex items-end space-x-7 bg-gradient-to-r from-${color} to-black text-white p-8 w-full h-80`}>
        <h1 className="text-xl sm:text-3xl lg:text-5xl xl:text-7xl font-bold">
          {name}
        </h1>
      </section>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl-grid-cols-7 gap-4 mt-6 w-full px-8 py-20">
        {playlist?.map((playlist, i) => (
          <Album
            key={i}
            image={playlist?.images?.[0]?.url}
            title={playlist?.name}
            description={playlist?.description}
            type={playlist?.type}
            id={playlist?.id}
            owner={playlist?.owner?.display_name}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetails;
