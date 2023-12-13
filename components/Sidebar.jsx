"use client";

import { playlistIdState } from "@/atoms/playlistAtom";
import { isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import {
  BuildingLibraryIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export const Sidebar = () => {
  const pathname = usePathname();

  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const playlistId = useRecoilValue(playlistIdState);
  const isPlaying = useRecoilValue(isPlayingState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi, playlistId]);

  return (
    <>
      {session && (
        <div
          className={`${
            pathname.includes("/login") && "hidden"
          } text-gray-500 border-r border-gray-900 sticky top-0 left-0 bottom-0 overflow-y-scroll h-screen scrollbar-hide text-xs lg:text-sm sm:w-[14rem] lg:w-[18rem] hidden md:block pb-12`}
        >
          <div className="space-y-5 p-5">
            <Link
              href="/"
              className={`${
                pathname === "/" && "text-white"
              } flex items-center space-x-2 text-neutral-400 font-semibold hover:text-white`}
            >
              {pathname === "/" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              ) : (
                <HomeIcon className="h-6 w-6" />
              )}
              <p>Home</p>
            </Link>
            <Link
              href="/search"
              className={`${
                pathname === "/search" && "text-white"
              } flex items-center space-x-2 text-neutral-400 font-semibold hover:text-white`}
            >
              {pathname === "/search" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <MagnifyingGlassIcon className="h-6 w-6" />
              )}
              <p>Search</p>
            </Link>
            <Link
              href="/library"
              className={`${
                pathname === "/library" && "text-white"
              } flex items-center space-x-2 text-neutral-400 font-semibold hover:text-white`}
            >
              {pathname === "/library" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  {" "}
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />{" "}
                  <path
                    fillRule="evenodd"
                    d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                    clipRule="evenodd"
                  />{" "}
                  <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />{" "}
                </svg>
              ) : (
                <BuildingLibraryIcon className="h-6 w-6" />
              )}
              <p>Your Library</p>
            </Link>
            <hr className="border-t-[0.1px] border-gray-900" />
            <Link
              href=""
              className="flex items-center space-x-2 text-neutral-400 font-semibold hover:text-white"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <p>Create Playlist</p>
            </Link>
            <Link
              href="/collection/tracks"
              className={`${
                pathname === "/collection/tracks" && "text-white"
              } flex items-center space-x-2 text-neutral-400 font-semibold hover:text-white`}
            >
              <HeartIcon className="h-5 w-5" />
              <p>Liked Songs</p>
            </Link>
            <button className="flex items-center space-x-2 text-neutral-400 font-semibold hover:text-white">
              <RssIcon className="h-5 w-5" />
              <p>Your episodes</p>
            </button>
            <hr className="border-t-[0.1px] border-gray-900" />
          </div>
          <div>
            {playlists.map((playlist, i) => (
              <Link
                href={`/playlist/${playlist.id}`}
                key={i}
                className={`${
                  pathname.includes(playlist.id) && "bg-neutral-900"
                } ${
                  playlistId === playlist.id ? "text-green-500" : "text-white"
                } cursor-pointer flex items-center gap-3 rounded hover:bg-neutral-900 p-2 mx-2`}
              >
                <Image
                  src={playlist.images[0].url}
                  width={50}
                  height={50}
                  alt="Playlist"
                  className="rounded-lg"
                />
                <div className="flex justify-between w-full items-center">
                  <div className="space-y-1">
                    <h1 className="font-bold text-base">{playlist.name}</h1>
                    <p className="text-neutral-400 font-semibold text-sm">
                      Playlist &bull; {playlist.owner.display_name}
                    </p>
                  </div>
                  {isPlaying && playlistId === playlist.id && (
                    <SpeakerWaveIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
