import { useState, useEffect } from "react";
import useSpotify from "./useSpotify";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "@/atoms/songAtom";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  const getSongInfo = async () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setSongInfo(data.body?.item);
    });
  };

  useEffect(() => {
    getSongInfo();
  }, [currentTrackId, spotifyApi, songInfo]);

  return songInfo;
}

export default useSongInfo;
