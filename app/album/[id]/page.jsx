"use client";

import { useEffect, useState } from "react";
import shuffle from "lodash/shuffle";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "@/hooks/useSpotify";
import Image from "next/image";
import { useParams } from "next/navigation";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Song from "../components/Song";
import { AlbumIdState } from "@/atoms/playlistAtom";
import { formatDateToMonthDateYear } from "@/lib/date";
import Album from "@/components/Album";

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

const AlbumDetail = () => {
  const { id } = useParams();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [album, setAlbum] = useState(null);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [albumIdState, setAlbumIdState] = useRecoilState(AlbumIdState);
  const [artistId, setArtistId] = useState(null);

  const [artistAlbum, setArtistAlbum] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [id]);

  const playSong = () => {
    setIsPlaying(true);
    setAlbumIdState(id);
    if (albumIdState === id) {
      spotifyApi
        .play()
        .catch((err) => console.log("Something went wrong!", err));
    } else {
      setCurrentTrackId(album?.tracks?.items[0].id);
      spotifyApi
        .play({
          context_uri: `spotify:album:${id}`,
          offset: { uri: album?.tracks?.items[0].uri },
          position_ms: 0,
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
    spotifyApi
      .pause()
      .catch((err) => console.log("Something went wrong!", err));
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken) {
      spotifyApi
        .getAlbum(id)
        .then((data) => {
          setArtistId(data.body.artists[0].id);
          setAlbum(data.body);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [id, spotifyApi]);

  useEffect(() => {
    if (album) {
      spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => {
          setArtistAlbum(data.body);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [album, spotifyApi]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide pb-12">
      <section
        className={`flex flex-wrap xl:flex-nowrap items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-[450px] sm:h-[400px] sm:pb-28 text-center sm:text-start`}
      >
        {album?.images?.[0]?.url && (
          <Image
            src={album?.images?.[0]?.url}
            width={200}
            height={200}
            alt="album"
            priority
            className="shadow-2xl mx-auto sm:mx-0"
          />
        )}

        {album ? (
          <div className="mx-auto sm:mx-0 w-full sm:w-auto">
            <p className="text-sm capitalize">{album?.type}</p>
            <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold">
              {album?.name}
            </h1>
            <div
              dangerouslySetInnerHTML={{ __html: album?.description }}
              className="mt-4 text-sm text-neutral-300"
            />
            <p className="mt-4 text-white text-sm font-semibold">
              {album?.artists[0]?.name} &bull;{" "}
              {new Date(album?.release_date).getFullYear()} &bull;
              {album?.followers?.total ? (
                <span>
                  {album?.followers?.total.toLocaleString()}{" "}
                  {album?.followers?.total > 1 ? "Likes" : "Like"} &bull;
                </span>
              ) : (
                ""
              )}{" "}
              {album?.tracks.total} songs
            </p>
          </div>
        ) : (
          ""
        )}
      </section>

      <div>
        {isPlaying && albumIdState === id ? (
          <button
            className="mx-8 p-4 rounded-full bg-red-500 hover:scale-105 transition-all duration-200 shadow-2xl mb-6"
            onClick={pauseSong}
          >
            <PauseIcon className="w-6 h-6 text-black" />
          </button>
        ) : (
          <button
            className="mx-8 p-4 rounded-full bg-green-500 hover:scale-105 transition-all duration-200 shadow-2xl mb-6"
            onClick={playSong}
          >
            <PlayIcon className="w-6 h-6 text-black" />
          </button>
        )}
        <div className="px-4 md:px-8 flex flex-col space-y-1 pb-12 text-white">
          {album?.tracks.items.map((track, i) => (
            <Song key={i} track={track} order={i} albumId={id} />
          ))}
        </div>
        <div className="text-neutral-400 px-4 md:px-8">
          <h1 className="text-sm font-bold">
            {formatDateToMonthDateYear(album?.release_date)}
          </h1>
          <p className="text-xs my-[2px]">{album?.label}</p>
          {album?.copyrights.map((copyright, i) => (
            <p key={i} className="text-xs">
              {copyright?.text}
            </p>
          ))}
        </div>

        <div className="mt-20 px-4 md:px-8">
          <h1 className="text-white  text-3xl font-bold mb-4 mt-8">
            More by {album?.artists[0]?.name}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {artistAlbum?.items?.slice(0, 7).map((album, i) => (
              <Album
                key={i}
                id={album?.id}
                title={album?.name}
                owner={album?.artists[0]?.name}
                image={album?.images?.[0]?.url}
                release={album?.release_date}
                type={album?.type}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;
