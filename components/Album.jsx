import Image from "next/image";
import Link from "next/link";
import React from "react";

const Album = ({ image, title, release, type, description, id }) => {
  return (
    <Link
      href={`/${type}/${id}`}
      className="flex-1 rounded-lg bg-neutral-800/40 hover:bg-neutral-700/60 transition-all duration-300 p-3 space-y-3"
    >
      <Image
        src={image}
        alt="album image"
        width={200}
        height={200}
        className="rounded-lg object-cover shadow-2xl shadow-black w-full"
      />
      <h1 className="text-white font-semibold line-clamp-2">{title}</h1>

      {description && (
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="text-neutral-400 font-semibold text-sm line-clamp-2"
        />
      )}

      {release && (
        <p className="text-neutral-400 font-semibold text-sm">
          {new Date(release).getFullYear()} &bull; {type}
        </p>
      )}
    </Link>
  );
};

export default Album;
