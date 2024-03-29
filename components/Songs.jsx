import { playlistState } from "@/atoms/playlistAtom";
import { useRecoilValue } from "recoil";
import Song from "./Song";

const Songs = () => {
  const playlist = useRecoilValue(playlistState);

  return (
    <div className="px-4 md:px-8 flex flex-col space-y-1 pb-28 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <Song
          key={i}
          track={track}
          order={i}
          idPlaylist={playlist?.id}
          savedTracks={false}
        />
      ))}
    </div>
  );
};

export default Songs;
