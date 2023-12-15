"use client";

import useSpotify from "@/hooks/useSpotify";
import { useCallback, useEffect, useRef, useState } from "react";
import Cardcategory from "../category/components/CardCategory";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import TopResult from "./components/TopResult";
import Song from "./components/Song";

const Search = () => {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const [query, setQuery] = useState("");

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [shows, setShows] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  const topResult = tracks[0];

  console.log("topResult: ", topResult);

  const searching = async ({ code }) => {
    if (query.length >= 3 && code === "Enter") {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track,album,artist,playlist,show,episode,episode&country=ID,locale=en&market=ID`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        );
        const data = await response.json();
        setTracks(data?.tracks?.items);
        setAlbums(data?.albums?.items);
        setArtists(data?.artists?.items);
        setPlaylists(data?.playlists?.items);
        setShows(data?.shows?.items);
        setEpisodes(data?.episodes?.items);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    fetchBrowse();
  }, [spotifyApi]);

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
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide px-8 py-20">
      <h1 className="text-white text-3xl font-bold mb-4">Search</h1>
      <div className="flex-1 flex gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          onChange={handleChange}
          value={query}
          onKeyDown={searching}
          className="w-full bg-neutral-700/40 hover:bg-neutral-600/60 transition-all duration-300 py-3 px-5 rounded-full"
        />
        {query.length >= 3 && (
          <button
            type="button"
            onClick={() => searching({ code: "Enter" })}
            className="bg-neutral-700/40 hover:bg-neutral-600/60 transition-all duration-300 py-3 px-5 rounded-full"
          >
            Search
          </button>
        )}
      </div>
      <div className="my-8">
        {topResult && (
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
          </>
        )}
      </div>
      {!topResult && (
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
      {/* )} */}
    </div>
  );
};

export default Search;
