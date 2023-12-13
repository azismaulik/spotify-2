import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Song from "./Song";

const TopTracks = ({ id }) => {
  const spotifyApi = useSpotify();
  const [tracksArtist, setTracksArtist] = useState(null);
  const [showed, setShowed] = useState(false);

  const getTracksArtist = async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getArtistTopTracks(id, "ID")
        .then((data) => {
          setTracksArtist(data.body);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  };

  useEffect(() => {
    getTracksArtist();
  }, [spotifyApi, id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Top Tracks</h1>
      {tracksArtist?.tracks?.slice(0, showed ? 10 : 5).map((track, i) => (
        <Song key={i} track={track} order={i} />
      ))}
      <p
        className="text-xs font-bold cursor-pointer text-neutral-400 hover:text-white"
        onClick={() => setShowed(!showed)}
      >
        {showed ? "Show less" : "See more"}
      </p>
    </div>
  );
};

export default TopTracks;
