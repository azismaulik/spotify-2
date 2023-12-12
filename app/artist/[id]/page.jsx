"use client";

import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Song from "../components/Song";
import Album from "@/components/Album";

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
  const [tracksArtist, setTracksArtist] = useState(null);

  const [singleArtist, setSingleArtist] = useState(null);
  const [albumsArtist, setAlbumsArtist] = useState(null);

  const [selected, setSelected] = useState("album");

  const [showed, setShowed] = useState(false);

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

  const getTracksArtist = async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getArtistTopTracks(id, "ID")
        .then((data) => {
          setTracksArtist(data.body);
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
    getTracksArtist();
    getAlbumsArtist();
  }, [spotifyApi, id]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [id]);

  console.log(albumsArtist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <section className="">
        <div
          style={{ backgroundImage: `url(${artist?.images?.[0]?.url})` }}
          className="w-full h-72 bg-cover bg-center bg-fixed p-8 flex flex-col justify-end space-y-7">
          <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold mt-8 [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
            {artist?.name}
          </h1>
          <p className="font-semibold [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
            {artist?.followers?.total.toLocaleString()}{" "}
            {artist?.followers?.total === 1 ? "Follower" : "Followers"}
          </p>
        </div>
        <div
          className={`bg-gradient-to-b ${color} to-black to-25% text-white w-full px-8 flex flex-col space-y-1 pt-20 pb-6`}>
          <h1 className="text-2xl font-bold mb-4">Top Tracks</h1>
          {tracksArtist?.tracks.slice(0, showed ? 10 : 5).map((track, i) => (
            <Song key={i} track={track} order={i} />
          ))}
          <p
            className="text-xs font-bold cursor-pointer text-neutral-400 hover:text-white"
            onClick={() => setShowed(!showed)}>
            {showed ? "Show less" : "See more"}
          </p>
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
              } px-4 py-1 rounded-full text-xs font-bold`}>
              Albums
            </button>
            <button
              onClick={() => setSelected("single")}
              className={`${
                selected === "single"
                  ? "bg-white/90 text-black"
                  : "bg-neutral-800/40 hover:bg-neutral-800/80"
              } px-4 py-1 rounded-full text-xs font-bold`}>
              Singles
            </button>
          </div>
          {selected === "album" && (
            <div className="flex overflow-x-auto scrollbar-hide space-x-3 mt-6 w-full">
              {albumsArtist?.map((album, i) => (
                <Album
                  key={i}
                  image={album?.images?.[0]?.url}
                  title={album?.name}
                  release={album?.release_date}
                  type={album?.album_type}
                />
              ))}
            </div>
          )}
          {selected === "single" && (
            <div className="flex overflow-x-auto scrollbar-hide space-x-3 mt-6 w-full">
              {singleArtist?.map((album, i) => (
                <Album
                  key={i}
                  image={album?.images?.[0]?.url}
                  title={album?.name}
                  release={album?.release_date}
                  type={album?.album_type}
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
