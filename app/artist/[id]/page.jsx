"use client";

import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Album from "@/components/Album";
import TopTracks from "../components/TopTracks";

const colors = [
  "from-indigo-900",
  "from-blue-900",
  "from-green-900",
  "from-red-900",
  "from-yellow-900",
  "from-pink-900",
  "from-purple-900",
];

const DetailArtist = () => {
  const { id } = useParams();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);

  const [artist, setArtist] = useState(null);

  const [singleArtist, setSingleArtist] = useState(null);
  const [albumsArtist, setAlbumsArtist] = useState(null);

  const [selected, setSelected] = useState("album");

  const getArtist = async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getArtist(id)
        .then((data) => {
          setArtist(data.body);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  };

  const getAlbumsArtist = async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getArtistAlbums(id)
        .then((data) => {
          setAlbumsArtist(
            data.body.items.filter((item) => item.album_type === "album")
          );
          setSingleArtist(
            data.body.items.filter((item) => item.album_type === "single")
          );
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  };

  useEffect(() => {
    getArtist();
    getAlbumsArtist();
  }, [spotifyApi, id]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [id]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <section className="">
        <div
          style={{ backgroundImage: `url(${artist?.images?.[0]?.url})` }}
          className="w-full h-72 bg-cover bg-center bg-fixed p-8 flex flex-col justify-end space-y-7"
        >
          <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold mt-8 [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
            {artist?.name}
          </h1>
          <p className="font-semibold [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
            {artist?.followers?.total.toLocaleString()}{" "}
            {artist?.followers?.total === 1 ? "Follower" : "Followers"}
          </p>
        </div>
        <div
          className={`bg-gradient-to-b ${color} to-black to-25% text-white w-full px-4 md:px-8 flex flex-col space-y-1 pt-20 pb-6`}
        >
          <TopTracks id={id} />
        </div>
        <div className="w-full p-8">
          <h1 className="text-2xl font-bold">Discography</h1>
          <div className="flex gap-4 items-center mt-6">
            <button
              onClick={() => setSelected("album")}
              className={`${
                selected === "album"
                  ? "bg-white/90 text-black"
                  : "bg-neutral-800/40 hover:bg-neutral-800/80"
              } px-4 py-1 rounded-full text-xs font-bold`}
            >
              Albums
            </button>
            <button
              onClick={() => setSelected("single")}
              className={`${
                selected === "single"
                  ? "bg-white/90 text-black"
                  : "bg-neutral-800/40 hover:bg-neutral-800/80"
              } px-4 py-1 rounded-full text-xs font-bold`}
            >
              Singles
            </button>
          </div>
          {selected === "album" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mt-6 w-full">
              {albumsArtist?.slice(0, 7)?.map((album, i) => (
                <Album
                  key={i}
                  image={album?.images?.[0]?.url}
                  title={album?.name}
                  release={album?.release_date}
                  type={album?.album_type}
                  id={album?.id}
                />
              ))}
            </div>
          )}
          {selected === "single" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mt-6 w-full">
              {singleArtist?.slice(0, 7)?.map((album, i) => (
                <Album
                  key={i}
                  image={album?.images?.[0]?.url}
                  title={album?.name}
                  release={album?.release_date}
                  owner={album?.artists[0].name}
                  type="album"
                  id={album?.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DetailArtist;
