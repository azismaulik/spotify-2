"use client";

import { shuffle } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const colors = [
  "bg-red-600",
  "bg-blue-600",
  "bg-green-600",
  "bg-yellow-600",
  "bg-pink-600",
  "bg-purple-600",
  "bg-violet-600",
  "bg-fuchsia-600",
  "bg-rose-600",
  "bg-sky-600",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-lime-600",
  "bg-amber-600",
  "bg-indigo-600",
];

const CardCategory = ({ name, image, id }) => {
  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  return (
    <Link
      href={`/category/${id}`}
      className={`rounded-lg p-4 flex-1 h-48 ${color} overflow-hidden relative`}
    >
      <Image
        src={image}
        alt={name}
        width={100}
        height={100}
        className="object-contain absolute -right-2 bottom-0 rotate-12 aspect-square"
        priority
      />
      <h1 className="text-white font-bold text-lg capitalize">
        {name?.split("-").join(" ")}
      </h1>
    </Link>
  );
};

export default CardCategory;
