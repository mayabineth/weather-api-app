import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { setListFav, setUnit, setId, setQuery } from "../features/cartSlice";
import "./Favorites.css";

const Favorites = () => {
  const { listFav, imgList, tempUnit } = useSelector((store) => store.cart);
  const dispatch = useDispatch();

  return (
    <div className="fav-page">
      <section className="section-center">
        <div className="flex-header">
          <div>
            <h3>My Favorites</h3>
          </div>
          <div>
            <button onClick={() => dispatch(setUnit())}>
              {tempUnit === "C" ? <RiCelsiusFill /> : <RiFahrenheitFill />}
            </button>
          </div>
        </div>
        <div className="grid">
          {listFav &&
            listFav.map((item) => {
              const { text, location, icon, key, temp } = item;
              let pic = imgList.includes(icon)
                ? require(`../img/${icon}.png`)
                : require(`../img/2.png`);
              return (
                <Link
                  to="/"
                  key={key}
                  onClick={() => {
                    dispatch(setId(key));
                    dispatch(setQuery(location));
                  }}
                  className="grid-item"
                >
                  <div className="">{location}</div>
                  <div>
                    {tempUnit === "C" ? parseInt((temp - 32) / 1.8) : temp}
                    <span>&nbsp;&deg;{tempUnit}</span>
                  </div>
                  <div>{text}</div>
                  <img
                    alt=""
                    style={{ width: "100%", maxWidth: "75px" }}
                    src={pic}
                  />
                </Link>
              );
            })}
        </div>
        <button
          className="clear-btn"
          onClick={() => {
            dispatch(setListFav([]));
          }}
        >
          clear
        </button>
      </section>
    </div>
  );
};

export default Favorites;
