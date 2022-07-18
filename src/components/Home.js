import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { setListFav, setUnit, setId, setQuery } from "../features/cartSlice";
import "./Home.css";

const Home = () => {
  const [colorFav, setColorFav] = useState("white");
  const [suggests, setSuggests] = useState([]);
  const [fiveDays, setFiveDays] = useState([]);
  const [text, setText] = useState("");
  const [alert, setAlert] = useState(false);
  const { id, query, listFav, imgList, tempUnit } = useSelector(
    (store) => store.cart
  );
  const dispatch = useDispatch();

  const api = `2f0EbQAklmLvjan1rnBAsgRSzTAwCsDK`;
  const search_url = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${api}&q=${query}`;
  const five_days_url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}?apikey=${api}`;
  const fav_url = `https://dataservice.accuweather.com/currentconditions/v1/${id}?apikey=${api}`;

  const searchComplete = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newData = data.map((item) => {
        const { LocalizedName, Country, Key } = item;
        const newItem = {
          id: Key,
          location: `${LocalizedName}, ${Country.LocalizedName}`,
        };
        return newItem;
      });
      setSuggests(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const displayFiveDays = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const { DailyForecasts } = data;
      setText(DailyForecasts[0].Day.IconPhrase);
      const newData = DailyForecasts.map((item) => {
        const { Date: date, Temperature, Day, EpochDate } = item;
        const dateSplit = date.substring(0, 10).split("-");
        const newDate = new Date(
          dateSplit[0],
          dateSplit[1] - 1,
          dateSplit[2]
        ).toLocaleString("en-US", {
          weekday: "short",
        });
        const newItem = {
          date: newDate,
          temp: Temperature.Maximum.Value,
          text: Day.IconPhrase,
          icon: Day.Icon,
          id: EpochDate,
        };
        return newItem;
      });
      setFiveDays(newData);
      const specificItem = listFav.find((item) => item.key === id);
      if (specificItem === undefined) setColorFav("white");
      else setColorFav("red");
    } catch (error) {
      console.log(error);
    }
  };

  const addToFav = async () => {
    if (colorFav === "white") {
      setColorFav("red");
      try {
        const response = await fetch(fav_url);
        const data = await response.json();
        const { WeatherText, Temperature, WeatherIcon } = data[0];
        const newItem = {
          key: id,
          location: query,
          text: WeatherText,
          icon: WeatherIcon,
          temp: Temperature.Imperial.Value,
        };
        dispatch(setListFav([...listFav, newItem]));
      } catch (error) {
        console.log(error);
      }
    } else {
      setColorFav("white");
      dispatch(setListFav(listFav.filter((item) => item.key !== id)));
    }
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(listFav));
  }, [listFav]);
  useEffect(() => {
    searchComplete(search_url);
  }, [query]);
  useEffect(() => {
    displayFiveDays(five_days_url);
  }, [id]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  const showSuggest = (suggest) => {
    dispatch(setQuery(suggest.location));
    dispatch(setId(suggest.id));
    setSuggests([]);
  };
  const handleChangingLocation = (e) => {
    const newEdit = e.target.value;
    if (/^[,A-Za-z\s]*$/.test(newEdit)) {
      dispatch(setQuery(e.target.value));
    } else {
      dispatch(setQuery(e.target.value));
      setAlert(true);
    }
  };
  return (
    <div className="home-page">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        {alert && <p className="alert">invalid location input</p>}
        <input
          type="text"
          className="form-input"
          placeholder="Enter Location..."
          value={query}
          onChange={handleChangingLocation}
        />
        <div className="auto-search">
          {suggests &&
            suggests.map((suggest, id) => {
              return (
                <div
                  className="auto-search-item"
                  key={id}
                  onClick={() => showSuggest(suggest)}
                  multiple
                  value={suggest.location}
                >
                  {suggest.location}
                </div>
              );
            })}
        </div>
      </form>

      <section className="section-center">
        <div className="flex-header">
          <div>
            <h3>{query}</h3>
          </div>
          <div className="flex-header-buttons">
            <button onClick={() => dispatch(setUnit())}>
              {tempUnit === "C" ? <RiCelsiusFill /> : <RiFahrenheitFill />}
            </button>
            <button onClick={addToFav}>
              {colorFav === "white" ? <MdFavoriteBorder /> : <MdFavorite />}
            </button>
          </div>
        </div>

        <h2 className="text">{text}</h2>
        <div className="flex-row-5-items">
          {fiveDays &&
            fiveDays.map((data) => {
              const { date, temp, text, icon, id } = data;
              let pic = imgList.includes(icon)
                ? require(`../img/${icon}.png`)
                : require(`../img/2.png`);
              return (
                <div key={id} className="flex-column-5-items">
                  <div>{date}</div>
                  <div>
                    {tempUnit === "C" ? parseInt((temp - 32) / 1.8) : temp}
                    <span>&nbsp;&deg;{tempUnit}</span>
                  </div>
                  <img
                    alt=""
                    style={{ width: "100%", maxWidth: "75px" }}
                    src={pic}
                  />
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};

export default Home;
