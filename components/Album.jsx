import Image from "next/image";
import React from "react";

const Album = ({ image, title, release, type }) => {
  return (
    <div className="max-w-[210px] rounded-lg bg-neutral-800/40 hover:bg-neutral-700/60 transition-all duration-300 p-3 space-y-3">
      <Image
        src={image}
        alt="album image"
        width={200}
        height={200}
        className="rounded-lg object-cover shadow-2xl shadow-black max-w-full max-h-[180px]"
      />
      <h1 className="text-white font-semibold">{title}</h1>
      <p className="text-neutral-400 font-semibold text-sm">
        {new Date(release).getFullYear()} &bull; {type}
      </p>
    </div>
  );
};

export default Album;
