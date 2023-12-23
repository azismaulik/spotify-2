"use client";

import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { PlayIcon } from "@heroicons/react/24/solid";
import { shuffle } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";

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

const Profile = () => {
  const spotifyApi = useSpotify();
  const [profile, setProfile] = useState(null);
  const [color, setColor] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  const getProfile = () => {
    spotifyApi
      .getMe()
      .then((data) => setProfile(data.body))
      .catch((err) => console.log("Something went wrong!", err));
  };

  const getTopArtists = () => {
    spotifyApi
      .getMyTopArtists()
      .then((data) => setTopArtists(data.body))
      .catch((err) => console.log("Something went wrong!", err));
  };

  const getTopTracks = () => {
    spotifyApi
      .getMyTopTracks()
      .then((data) => setTopTracks(data.body))
      .catch((err) => console.log("Something went wrong!", err));
  };

  const playSongByArtist = (id) => {
    spotifyApi
      .play({
        context_uri: `spotify:artist:${id}`,
        position_ms: 0,
      })
      .catch((err) => console.log("Something went wrong!", err));
  };

  useEffect(() => {
    setColor(shuffle(colors).pop());
  });

  useEffect(() => {
    getProfile();
    getTopArtists();
    getTopTracks();
  }, []);

  console.log(topArtists);
  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <section
        className={`flex flex-wrap xl:flex-nowrap items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-[450px] sm:h-[400px] sm:pb-28 text-center sm:text-start`}>
        <Image
          src={profile?.images?.[0]?.url || "/no-image.webp"}
          width={200}
          height={200}
          alt="profile"
          priority
          className="shadow-2xl mx-auto sm:mx-0 rounded-full aspect-square"
        />

        {profile ? (
          <div className="mx-auto sm:mx-0 w-full sm:w-auto">
            <p className="text-sm capitalize">Profile</p>
            <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold">
              {profile?.display_name}
            </h1>
            <div
              dangerouslySetInnerHTML={{ __html: profile?.description }}
              className="mt-4 text-sm text-neutral-300"
            />
            {/* <p className="mt-4 text-white text-sm font-semibold">
              {profile?.owner.display_name} &bull;{" "}
              {profile?.followers.total ? (
                <span>
                  {profile?.followers.total.toLocaleString()}{" "}
                  {profile?.followers.total > 1 ? "Likes" : "Like"} &bull;
                </span>
              ) : (
                ""
              )}{" "}
              {profile?.tracks.total} songs
            </p> */}
          </div>
        ) : (
          ""
        )}
      </section>
      <section className="px-8">
        <h1 className="text-2xl font-bold">Top artist this month</h1>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {topArtists?.items?.slice(0, 6).map((artist) => (
            <div
              key={artist?.id}
              className="p-4 bg-neutral-900 rounded-md hover:bg-neutral-800 relative group">
              <Image
                src={artist?.images?.[0]?.url || "/no-image.webp"}
                width={200}
                height={200}
                alt="profile"
                priority
                className="rounded-full"
              />
              <h1 className="mt-4 font-bold text-white truncate">
                {artist?.name}
              </h1>
              <p className="mt-2 text-sm text-neutral-400">Artist</p>
              <div
                onClick={() => playSongByArtist(artist.id)}
                className="absolute top-1/2 right-5 hidden group-hover:block bg-green-500 rounded-full text-black p-3 cursor-pointer">
                <PlayIcon width={23} height={23} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-8">
        <h1 className="text-2xl font-bold mb-4">Top tracks this month</h1>
        {topTracks?.items?.map((track, i) => (
          <div className="grid grid-cols-3 items-center gap-4 p-3 group hover:bg-neutral-900 rounded">
            <div className="flex gap-4 items-center">
              <p>{i + 1}</p>
              <Image
                src={track?.album?.images?.[0]?.url}
                width={50}
                height={50}
                alt={track?.name}
                priority
                className="rounded-md"
              />
              <div>
                <p className="text-white font-semibold">{track?.name}</p>
                <p className="text-neutral-400 text-sm">
                  {track?.artists[0]?.name}
                </p>
              </div>
            </div>

            <p className="ml-4">{track?.album?.name}</p>
            <p className="text-neutral-400 ml-auto">
              {millisToMinutesAndSeconds(track?.duration_ms)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Profile;
