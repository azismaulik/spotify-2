"use client";

import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Song from "../components/Song";

const colors = [
  "from-red-600",
  "from-blue-600",
  "from-green-600",
  "from-yellow-600",
  "from-pink-600",
  "from-purple-600",
  "from-violet-600",
  "from-fuchsia-600",
  "from-rose-600",
  "from-sky-600",
  "from-cyan-600",
  "from-emerald-600",
  "from-lime-600",
  "from-amber-600",
  "from-indigo-600",
];

const GenreTracks = () => {
  const { name } = useParams();
  const [tracks, setTracks] = useState([]);

  const [color, setColor] = useState(null);
  const [image, setImage] = useState(null);

  const spotifyApi = useSpotify();
  const getTracksByGenre = async () => {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=genre=${name}&type=track&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    );
    const tracks = await res.json();
    setTracks(tracks);
  };

  async function getRandomPictureByKeyword() {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${name}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    const data = await response.json();
    const image = data?.results[0]?.urls?.regular;
    setImage(image);
  }

  useEffect(() => {
    if (name) {
      getRandomPictureByKeyword();
    }
  }, [name]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [name]);

  useEffect(() => {
    getTracksByGenre();
  }, [name]);

  return (
    <div
      className={`flex-grow h-screen overflow-y-scroll scrollbar-hide text-white w-full`}
    >
      <section
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className={`flex items-end space-x-7 text-white p-8 w-full h-80`}
      >
        <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold">{name}</h1>
      </section>

      <div
        className={`px-4 md:px-8 flex flex-col space-y-1 py-20 text-white bg-gradient-to-b ${color} to-black to-[200px] w-full`}
      >
        <h1 className="text-2xl font-bold mb-10">{name} Songs</h1>
        {tracks?.tracks?.items?.map((track, i) => (
          <Song key={i} track={track} order={i} />
        ))}
      </div>
    </div>
  );
};

export default GenreTracks;
