import { useState, useEffect } from "react";
import useSpotify from "./useSpotify";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "@/atoms/songAtom";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  const getCurrentSongInfo = () => {
    if (currentTrackId) {
      spotifyApi.getTrack(currentTrackId).then((data) => {
        setSongInfo(data.body);
      });
    }
  };

  useEffect(() => {
    getCurrentSongInfo();
  }, [currentTrackId]);

  return songInfo;
}

export default useSongInfo;
