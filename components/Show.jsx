"use client";

import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";

const Show = () => {
  const spotifyApi = useSpotify();
  const [show, setShow] = useState(null);

  const getShow = () => {
    spotifyApi.getMySavedShows().then((data) => {
      setShow(data.body);
    });
  };

  useEffect(() => {
    getShow();
  }, []);

  console.log(show);
  return <div></div>;
};

export default Show;
