"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

const UserDetail = () => {
  const params = useParams();
  const { id } = params;
  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <section
        className={`flex flex-wrap xl:flex-nowrap items-end space-x-7 bg-gradient-to-b ${color} to-black text-white p-8 w-full h-[450px] sm:h-[400px] sm:pb-28 text-center sm:text-start`}
      >
        {playlist?.images?.[0]?.url && (
          <Image
            src={playlist?.images?.[0]?.url}
            width={200}
            height={200}
            alt="Playlist"
            priority
            className="shadow-2xl mx-auto sm:mx-0"
          />
        )}

        {playlist ? (
          <div className="mx-auto sm:mx-0 w-full sm:w-auto">
            <p className="text-sm capitalize">{playlist?.type}</p>
            <h1 className="text-2xl md:text-5xl xl:text-7xl font-bold">
              {playlist?.name}
            </h1>
            <div
              dangerouslySetInnerHTML={{ __html: playlist?.description }}
              className="mt-4 text-sm text-neutral-300"
            />
            <p className="mt-4 text-white text-sm font-semibold">
              {playlist?.owner.display_name} &bull;{" "}
              {playlist?.followers.total ? (
                <span>
                  {playlist?.followers.total.toLocaleString()}{" "}
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
    </div>
  );
};

export default UserDetail;
