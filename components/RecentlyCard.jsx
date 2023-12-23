import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const RecentlyCard = ({
  image,
  title,
  playing,
  handlePlaySong,
  handlePauseSong,
}) => {
  return (
    <div className="flex-1 flex items-center rounded bg-neutral-600/50 hover:bg-neutral-500/50 group cursor-pointer">
      <Image
        src={image}
        alt="image"
        width={60}
        height={60}
        className="rounded-l aspect-square"
        priority
      />
      <div className="flex justify-between items-center w-full px-4">
        <p className="text-sm font-bold">{title}</p>
        {playing ? (
          <>
            <Image
              className="w-5 h-5 group-hover:hidden"
              src="/playing.gif"
              alt="playing"
              width={20}
              height={20}
            />
            <div
              onClick={handlePauseSong}
              className="p-3 rounded-full bg-green-500 text-black hidden group-hover:block cursor-pointer shadow-2xl">
              <PauseIcon className="w-6 h-6" />
            </div>
          </>
        ) : (
          <div
            onClick={handlePlaySong}
            className="p-3 rounded-full bg-green-500 text-black hidden group-hover:block cursor-pointer shadow-2xl">
            <PlayIcon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyCard;
