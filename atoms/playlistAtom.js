import { atom } from "recoil";

export const playlistState = atom({
  key: "playlistState",
  default: null,
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "2mUnC49nuj9oQ8FwYrRFQY",
});

export const likedSongsState = atom({
  key: "likedSongsState",
  default: [],
});
