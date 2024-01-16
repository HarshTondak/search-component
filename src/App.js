import React, { useState, useEffect } from "react";

const App = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [q, setQ] = useState("");
  const [searchParam] = useState(["capital", "name", "numericCode"]);
  const [filterParam, setFilterParam] = useState(["All"]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/iamspruce/search-filter-painate-reactjs/main/data/countries.json"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  let data = Object.values(items);
  console.log(data);

  // useEffect(() => {
  //   data = Object.values(items);
  // }, [items]);

  function search(items) {
    return items.filter((item) => {
      if (item.region == filterParam) {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      } else if (filterParam == "All") {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      }
    });
  }

  function handleSelectCountry(country) {
    const updatedData = data.filter(
      (item) => item.alpha3Code !== country.alpha3Code
    );
    setItems(updatedData);

    setSelectedCountry((prevSelectedCountries) => [
      ...prevSelectedCountries,
      country,
    ]);
    setQ("");
  }

  function handleRemoveCountry(country) {
    setItems((prevItems) => [...prevItems, country]);

    setSelectedCountry((prevSelectedCountries) =>
      prevSelectedCountries.filter(
        (item) => item.alpha3Code !== country.alpha3Code
      )
    );
  }

  if (error) {
    return (
      <p>
        {error.message}, if you get this error, the free API I used might have
        stopped working...
      </p>
    );
  } else if (!isLoaded) {
    return <h4>LOADING...</h4>;
  } else {
    return (
      <div className="wrapper">
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <div className="select">
            <select
              onChange={(e) => {
                setFilterParam(e.target.value);
              }}
              className="custom-select"
              aria-label="Filter Countries By Region"
            >
              <option value="All">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">America</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
            <span className="focus"></span>
          </div>
        </div>

        {selectedCountry.length > 0 && (
          <div>
            <ul>
              {selectedCountry.map((country, index) => (
                <li key={index}>
                  {country.name}{" "}
                  <button
                    onClick={() => handleRemoveCountry(country)}
                    className="cross"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="card-grid">
          {search(data).map((item) => (
            <li key={item.alpha3Code}>
              <article
                className="card"
                onClick={() => handleSelectCountry(item)}
              >
                <div className="card-image">
                  <img src={item.flag.large} alt={item.name} />
                </div>
                <div className="card-content">
                  <h2 className="card-name">{item.name}</h2>
                  <ol className="card-list">
                    <li>
                      population: <span>{item.population}</span>
                    </li>
                    <li>
                      Region: <span>{item.region}</span>
                    </li>
                    <li>
                      Capital: <span>{item.capital}</span>
                    </li>
                  </ol>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default App;
