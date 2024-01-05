"use client";

import NewRelease from "@/components/NewRelease";
import PopularPlaylist from "@/components/PopularPlaylist";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import RelatedArtist from "@/components/RelatedArtist";
import Show from "@/components/Show";
import { getGreeting } from "@/lib/greeting";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";

const colors = [
  "from-neutral-700",
  "from-stone-700",
  "from-slate-700",
  "from-gray-700",
  "from-zinc-700",
];

export default function Home() {
  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  return (
    <div
      className={`bg-gradient-to-b ${color} to-[200px] to-black text-white p-8 w-full min-h-screen`}
    >
      <h1 className="text-3xl font-bold mt-14">{getGreeting()}</h1>
      <RecentlyPlayed />
      <PopularPlaylist />
      <NewRelease />
      <RelatedArtist />

      {/* <Show /> */}
    </div>
  );
}
