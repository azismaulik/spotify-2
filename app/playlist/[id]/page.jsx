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
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [id]);

  // const playPlaylist = () => {
  //   spotifyApi.getPlaylist(id).then((data) => {
  //     setCurrentTrackId(data.body?.tracks?.items[0]?.track?.id);
  //     setIsPlaying(true);
  //     spotifyApi.play({
  //       uris: data.body?.tracks?.items[0]?.track?.uri,
  //     });
  //   });
  // };

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
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-80`}>
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
        {/* <button onClick={playPlaylist}>play</button> */}
        <Songs />
      </div>
    </div>
  );
};

export default PlaylistDetail;
