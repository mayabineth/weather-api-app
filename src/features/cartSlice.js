import { createSlice } from "@reduxjs/toolkit";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

const initialState = {
  listFav: getLocalStorage(),
  imgList: [1, 2, 3, 4, 6, 7, 18, 33],
  tempUnit: "C",
  id: "215854",
  query: "Tel Aviv, Israel",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setListFav: (state, { payload }) => {
      state.listFav = payload;
    },
    setId: (state, { payload }) => {
      state.id = payload;
    },
    setQuery: (state, { payload }) => {
      state.query = payload;
    },
    setUnit: (state) => {
      if (state.tempUnit === "C") state.tempUnit = "F";
      else {
        state.tempUnit = "C";
      }
    },
  },
});

export const { setListFav, setId, setQuery, setUnit } = cartSlice.actions;

export default cartSlice.reducer;
