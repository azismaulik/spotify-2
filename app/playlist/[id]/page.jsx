"use client";

import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import shuffle from "lodash/shuffle";
import { playlistIdState, playlistState } from "@/atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "@/hooks/useSpotify";
import Image from "next/image";
import Songs from "@/components/Songs";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const PlaylistDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  // const playlistId = useRecoilValue(playlistIdState);
  const playlistId = id;
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    setTimeout(() => {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }, 500);
  }, [playlistId, spotifyApi]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          onClick={signOut}
          className="flex items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 bg-black">
          <UserCircleIcon className="h-8 w-8" />
          <p>{session?.user?.name}</p>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-80`}>
        {playlist?.images?.[0]?.url && (
          <Image
            src={playlist?.images?.[0]?.url}
            width={200}
            height={200}
            alt="Playlist"
            priority
          />
        )}

        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};

export default PlaylistDetail;
