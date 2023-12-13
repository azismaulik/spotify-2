import Image from "next/image";

const RecentlyCard = ({ image, title, playing }) => {
  return (
    <div className="flex-1 flex items-center rounded bg-neutral-600/50 hover:bg-neutral-500/50">
      <Image
        src={image}
        alt="image"
        width={80}
        height={80}
        className="rounded-l w-20"
        priority
      />
      <div className="flex justify-between items-center w-full px-2">
        <p className="text-sm font-bold">{title}</p>
        {playing && (
          <Image
            className="w-5 h-5"
            src="/playing.gif"
            alt="playing"
            width={20}
            height={20}
          />
        )}
      </div>
    </div>
  );
};

export default RecentlyCard;
