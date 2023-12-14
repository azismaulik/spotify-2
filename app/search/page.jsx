"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Cardcategory from "../category/components/CardCategory";

const Search = () => {
  const spotifyApi = useSpotify();

  const [categories, setCategories] = useState([]);
  // const getGenres = () => {
  //   spotifyApi.getAvailableGenreSeeds().then((data) => {
  //     const genres = data.body.genres;
  //     setGenres(genres);
  //   });
  // };

  const fetchBrowse = () => {
    spotifyApi
      .getCategories({
        limit: 50,
      })
      .then((data) => {
        setCategories(data.body.categories.items);
      })
      .catch((err) => console.log("Something went wrong!", err));
  };

  useEffect(() => {
    fetchBrowse();
    // getGenres();
  }, [spotifyApi]);

  const [query, setQuery] = useState("");

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide px-8 py-20">
      {!query && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {/* {genres?.map((genre, i) => (
            <CardGenre key={i} genre={genre} />
          ))} */}
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
