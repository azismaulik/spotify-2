"use client";

import useSpotify from "@/hooks/useSpotify";
import { useCallback, useEffect, useRef, useState } from "react";
import Cardcategory from "../category/components/CardCategory";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import TopResult from "./components/TopResult";
import Song from "./components/Song";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import Album from "@/components/Album";

const options = [
  "all",
  "songs",
  "artists",
  "albums",
  "playlists",
  "podcasts",
  "episodes",
];

const Search = () => {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const search = useSearchParams().get("search");
  const [categories, setCategories] = useState([]);

  const [query, setQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [topResult, setTopResult] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [shows, setShows] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [audiobooks, setAudiobooks] = useState([]);

  const searching = async () => {
    if (search) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${search}&type=track,album,artist,playlist,show,episode,episode,audiobook&country=ID&locale=en&market=ID&limit=50`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        );
        const data = await response.json();
        setTopResult(data?.tracks?.items[0]);
        setTracks(data?.tracks?.items);
        setAlbums(data?.albums?.items);
        setArtists(data?.artists?.items);
        setPlaylists(data?.playlists?.items);
        setShows(data?.shows?.items);
        setEpisodes(data?.episodes?.items);
        setAudiobooks(data?.audiobooks?.items);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = () => {
    if (query.length >= 3) {
      router.push(`/search?search=${query}`);
    }
  };

  useEffect(() => {
    searching();
    fetchBrowse();
  }, [spotifyApi, search]);

  const fetchBrowse = () => {
    spotifyApi
      .getCategories({
        limit: 50,
        offset: 0,
        country: "ID",
        locale: "en",
      })
      .then((data) => {
        const categories = data.body.categories.items;
        setCategories(
          categories?.filter(
            (item) =>
              item.id.toUpperCase() !== item.name.toUpperCase() &&
              item.name !== "Diwali"
          )
        );
      })
      .catch((err) => console.log("Something went wrong!", err));
  };

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide px-8 pt-16 pb-20">
      <div className="flex-1 flex gap-4">
        <div className="w-full relative">
          {query && (
            <div
              onClick={() => setQuery("")}
              className="absolute top-2 right-1 text-white hover:text-neutral-700 cursor-pointer transition-all duration-300"
            >
              <XCircleIcon className="w-8 h-8" />
            </div>
          )}
          <input
            type="text"
            placeholder="Search..."
            onChange={handleChange}
            value={query}
            autoComplete="off"
            autoFocus={true}
            className="w-full bg-neutral-700/40 hover:bg-neutral-600/60 transition-all duration-300 py-3 px-5 rounded-full"
          />
        </div>
        {query.length >= 3 && (
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-neutral-700/40 hover:bg-neutral-600/60 transition-all duration-300 py-3 px-5 rounded-full"
          >
            Search
          </button>
        )}
      </div>
      {search && (
        <div className="my-8 flex gap-3 items-center overflow-x-scroll scrollbar-hide">
          {options.map((category, i) => (
            <p
              onClick={() => setSelectedCategory(category)}
              key={i}
              className={`${
                category === selectedCategory
                  ? "bg-white text-neutral-900 font-semibold"
                  : "text-white bg-neutral-900 hover:bg-neutral-800"
              } rounded-xl py-1 px-4 cursor-pointer capitalize`}
            >
              {category}
            </p>
          ))}
        </div>
      )}
      <div className="my-8">
        {search && selectedCategory === "all" && (
          <>
            <div className="flex flex-wrap gap-8 items-stretch">
              <div className="w-full sm:w-[400px]">
                <h1 className="text-white text-3xl font-bold mb-4">
                  Top Result
                </h1>
                <TopResult track={topResult} />
              </div>
              <div className="flex-1">
                <h1 className="text-white text-3xl font-bold mb-4">Songs</h1>
                {tracks?.slice(0, 4).map((track, i) => (
                  <Song track={track} key={i} />
                ))}
              </div>
            </div>
            <h1 className="text-white text-3xl font-bold mb-4 mt-8">Artists</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
              {artists?.slice(0, 6).map((artist, i) => (
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

            <h1 className="text-white text-3xl font-bold mb-4 mt-8">Albums</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
              {albums?.slice(0, 6).map((album, i) => (
                <Album
                  key={i}
                  image={album?.images?.[0]?.url}
                  title={album?.name}
                  description={album?.description}
                  type={album?.type}
                  id={album?.id}
                  release={album?.release_date}
                  owner={album?.artists?.[0]?.name}
                />
              ))}
            </div>

            <h1 className="text-white text-3xl font-bold mb-4 mt-8">
              Playlists
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
              {playlists?.slice(0, 6).map((playlist, i) => (
                <Album
                  key={i}
                  image={playlist?.images?.[0]?.url}
                  title={playlist?.name}
                  id={playlist?.id}
                  owner={playlist?.owner?.display_name}
                  type="playlist"
                />
              ))}
            </div>

            <h1 className="text-white text-3xl font-bold mb-4 mt-8">
              Podcasts
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
              {shows?.slice(0, 6).map((show, i) => (
                <Album
                  key={i}
                  image={show?.images?.[0]?.url}
                  title={show?.name}
                  id={show?.id}
                  owner={show?.publisher}
                />
              ))}
            </div>

            <h1 className="text-white text-3xl font-bold mb-4 mt-8">
              Episodes
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
              {episodes?.slice(0, 6).map((episode, i) => (
                <Album
                  key={i}
                  image={episode?.images[0]?.url}
                  title={episode?.name}
                  release={episode?.release_date}
                  id={episode?.id}
                  duration={episode?.duration_ms}
                />
              ))}
            </div>
          </>
        )}
        {selectedCategory === "songs" && (
          <div className="flex-1">
            {tracks?.map((song, i) => (
              <Song track={song} key={i} />
            ))}
          </div>
        )}

        {selectedCategory === "artists" && (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {artists?.map((artist, i) => (
              <Link
                href={`/artist/${artist?.id}`}
                key={i}
                className="flex-1 rounded-md p-3 bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
              >
                <Image
                  className="rounded-full shadow-2xl shadow-black aspect-square"
                  src={artist?.images[0]?.url || "/no-image.webp"}
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
        )}

        {selectedCategory === "albums" && (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {albums?.map((album, i) => (
              <Album
                key={i}
                image={album?.images?.[0]?.url}
                title={album?.name}
                description={album?.description}
                type={album?.type}
                id={album?.id}
                release={album?.release_date}
                owner={album?.artists?.[0]?.name}
              />
            ))}
          </div>
        )}

        {selectedCategory === "playlists" && (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {playlists?.map((playlist, i) => (
              <Album
                key={i}
                image={playlist?.images?.[0]?.url}
                title={playlist?.name}
                id={playlist?.id}
                owner={playlist?.owner?.display_name}
                type="playlist"
              />
            ))}
          </div>
        )}

        {selectedCategory === "podcasts" && (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {shows?.map((show, i) => (
              <Album
                key={i}
                image={show?.images?.[0]?.url}
                title={show?.name}
                id={show?.id}
                owner={show?.publisher}
              />
            ))}
          </div>
        )}

        {selectedCategory === "episodes" && (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {episodes?.map((episode, i) => (
              <Album
                key={i}
                image={episode?.images[0]?.url}
                title={episode?.name}
                release={episode?.release_date}
                id={episode?.id}
                duration={episode?.duration_ms}
              />
            ))}
          </div>
        )}
      </div>

      {!search && (
        <>
          <h1 className="text-white text-3xl font-bold mb-2 mt-8">Browse</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {categories?.map((category, i) => (
              <Cardcategory
                key={i}
                name={category.name}
                image={category.icons[0].url}
                id={category.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
