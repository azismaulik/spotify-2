import { atom } from "recoil";

export const playlistState = atom({
  key: "playlistState",
  default: null,
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: null,
});

export const likedSongsState = atom({
  key: "likedSongsState",
  default: [],
});

export const AlbumIdState = atom({
  key: "AlbumIdState",
  default: null,
});
