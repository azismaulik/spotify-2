import { formatDateToMonthDateYear } from "@/lib/date";
import { millisToMinutesAndSeconds } from "@/lib/time";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Album = ({
  image,
  title,
  release,
  type,
  description,
  id,
  owner,
  duration,
}) => {
  return (
    <Link
      href={`/${type}/${id}`}
      className="flex-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 p-3">
      <Image
        src={image}
        alt={title}
        width={200}
        height={200}
        className="rounded-lg object-cover shadow-2xl shadow-black w-full aspect-square"
        priority
      />
      <h1 className="text-white font-semibold truncate mt-3">{title}</h1>

      {description && (
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="text-neutral-400 font-semibold text-sm line-clamp-2 mt-1"
        />
      )}

      {release && type ? (
        <p className="text-neutral-400 font-semibold text-xs mt-1">
          {new Date(release).getFullYear()} &bull; {owner} &bull; {type}
        </p>
      ) : duration ? (
        <p className="text-neutral-400 font-semibold text-xs mt-1">
          {formatDateToMonthDateYear(release)} &bull;{" "}
          {millisToMinutesAndSeconds(duration)}
        </p>
      ) : (
        <p className="text-neutral-400 font-semibold text-xs mt-1">
          by {owner}
        </p>
      )}
    </Link>
  );
};

export default Album;
