"use client";

import { likedSongsState } from "@/atoms/playlistAtom";
import Song from "@/components/Song";
import useSpotify from "@/hooks/useSpotify";
import { HeartIcon } from "@heroicons/react/24/solid";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-violet-500",
  "from-fuchsia-500",
  "from-rose-500",
  "from-sky-500",
  "from-cyan-500",
  "from-emerald-500",
  "from-lime-500",
  "from-amber-500",
];

const LikedTracks = () => {
  const spotifyApi = useSpotify();
  const [likedSongs, setLikedSongs] = useRecoilState(likedSongsState);
  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMySavedTracks({ limit: 50 }).then((data) => {
        setLikedSongs(data.body);
      });
    }
  }, [spotifyApi]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      {likedSongs ? (
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-[400px] pb-28`}
        >
          <div className="w-52 h-52 bg-gradient-to-br from-blue-600 via-purple-800 to-cyan-200 flex justify-center items-center">
            <HeartIcon className="w-24 h-24 text-white" />
          </div>

          <div>
            <p className="text-sm">Playlist</p>
            <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold">
              Liked Songs
            </h1>
            <p className="mt-4 text-white text-sm font-semibold">
              {likedSongs?.total} songs
            </p>
          </div>
        </section>
      ) : (
        ""
      )}
      <div className="px-4 md:px-8 flex flex-col space-y-1 pb-28 text-white">
        {likedSongs?.items?.map((track, i) => (
          <Song key={i} track={track} order={i} savedTracks={true} />
        ))}
      </div>
    </div>
  );
};

export default LikedTracks;
