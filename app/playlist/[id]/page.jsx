"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import shuffle from "lodash/shuffle";
import { playlistIdState, playlistState } from "@/atoms/playlistAtom";
import { useRecoilState } from "recoil";
import useSpotify from "@/hooks/useSpotify";
import Image from "next/image";
import Songs from "@/components/Songs";
import { useParams } from "next/navigation";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

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

const PlaylistDetail = () => {
  const { id } = useParams();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [id]);

  const playSong = () => {
    setIsPlaying(true);
    setPlaylistId(id);
    if (playlistId === id) {
      spotifyApi
        .play()
        .catch((err) => console.log("Something went wrong!", err));
    } else {
      setCurrentTrackId(playlist?.tracks?.items[0].track.id);
      spotifyApi
        .play({
          context_uri: `spotify:playlist:${id}`,
          offset: { uri: playlist?.tracks?.items[0].track.uri },
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
        .getPlaylist(id)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [id, spotifyApi]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-80`}
      >
        {playlist?.images?.[0]?.url && (
          <Image
            src={playlist?.images?.[0]?.url}
            width={200}
            height={200}
            alt="Playlist"
            priority
            className="shadow-2xl"
          />
        )}

        {playlist ? (
          <div>
            <p className="text-xs">{playlist?.type}</p>
            <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold">
              {playlist?.name}
            </h1>
            <p className="mt-4 text-sm">{playlist?.description}</p>
            <p className="mt-4 text-white text-sm font-semibold">
              {playlist?.owner.display_name} &bull;{" "}
              {playlist?.followers.total ? (
                <span>
                  {playlist?.followers.total}{" "}
                  {playlist?.followers.total > 1 ? "Likes" : "Like"} &bull;
                </span>
              ) : (
                ""
              )}{" "}
              {playlist?.tracks.total} songs
            </p>
          </div>
        ) : (
          ""
        )}
      </section>

      <div>
        {isPlaying && playlistId === id ? (
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

        <Songs />
      </div>
    </div>
  );
};

export default PlaylistDetail;
