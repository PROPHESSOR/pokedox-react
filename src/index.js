import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import PokemonCard from "./components/PokemonCard";

import Config from "./config";
import "./styles.scss";

function App() {
  const [filter_name, set_filter_name] = useState("");
  const [filter_type, set_filter_type] = useState([]);
  const [limit, set_limit] = useState(20);
  const [offset, set_offset] = useState(0);
  const [pokelist, set_pokelist] = useState([]);
  const [types, set_types] = useState([]);
  const [show_filter, set_show_filter] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      const request = await fetch(`${Config.API}/type`);

      const json = await request.json();

      set_types(json.results.map(e => e.name));
    };

    const fetchPokelist = async () => {
      const request = await fetch(`${Config.API}/pokemon?limit=999`);

      const json = await request.json();

      set_pokelist(json.results);
    };

    const fetchFilteredPoketlist = async () => {
      let list = new Set();

      for (const type of filter_type) {
        const request = await fetch(`${Config.API}/type/${type}`);

        const json = await request.json();

        const tmp = json.pokemon.map(e => e.pokemon);

        list = new Set([...list, ...tmp]);
      }

      set_pokelist(Array.from(list));
    };

    // First fetch types
    if (!types.length) fetchTypes();

    // Fetch all pokelist or the filtered one
    if (!filter_type.length) fetchPokelist();
    else fetchFilteredPoketlist();
  }, [types, filter_type]);

  // Funcitons

  const toggleFilterType = type => {
    if (filter_type.includes(type)) {
      set_filter_type(filter_type.filter(x => x !== type));
    } else {
      set_filter_type([...filter_type, type]);
    }
  };

  // Components

  const filtered_pokemons = filter_name
    ? pokelist.filter(pokemon =>
        pokemon.name.startsWith(filter_name.toLowerCase())
      )
    : pokelist;

  const pokemons = filtered_pokemons
    .slice(offset * limit, offset * limit + limit)
    .map((pokemon, i) => (
      <PokemonCard key={pokemon.name} name={pokemon.name || "Unknown"} />
    ));

  const pages = [];
  {
    const makePaginationItem = (
      index,
      is_current = false,
      text = index + 1
    ) => {
      return (
        <div key={index + Math.random()} className="col page-item">
          <button
            style={{ fontWeight: is_current ? "bolder" : "normal" }}
            className="page-link"
            onClick={() => set_offset(index)}
          >
            {text}
          </button>
        </div>
      );
    };

    const num_pages = Math.ceil(filtered_pokemons.length / limit);

    // First page
    pages.push(makePaginationItem(0, offset === 0, "First"));

    if (offset !== 0)
      // Previous page
      pages.push(makePaginationItem(offset - 1));
    if (offset !== 0 && offset !== num_pages - 1)
      // Current page
      pages.push(makePaginationItem(offset, true));
    if (offset !== num_pages - 1)
      // Next page
      pages.push(makePaginationItem(offset + 1));

    // Last page
    pages.push(
      makePaginationItem(num_pages - 1, offset === num_pages - 1, "Last")
    );
  }

  const pagination = (
    <nav>
      <div className="row">{pages}</div>
      <select value={limit} onChange={e => set_limit(+e.target.value)}>
        <option>10</option>
        <option>20</option>
        <option>50</option>
      </select>
    </nav>
  );

  const filter = !show_filter
    ? null
    : types.map(e => (
        <label className="col-lg-2 col-4 col-xs-6 filter" key={e}>
          <input
            type="checkbox"
            value={e}
            checked={filter_type.includes(e)}
            onChange={() => toggleFilterType(e)}
          />
          {e}
        </label>
      ));

  return (
    <div className="container-fluid">
      <h1>PokedoxDemo</h1>
      <div className="row">
        <input
          className="col-10"
          type="text"
          placeholder="Filter by name"
          value={filter_name}
          onChange={e => set_filter_name(e.target.value)}
        />
        <button
          style={{ fontWeight: filter_type.length ? "bolder" : "normal" }}
          className="col-2"
          onClick={() => set_show_filter(!show_filter)}
        >
          Type
        </button>
      </div>
      <div className="row">{filter}</div>
      <div className="row center">{pokemons}</div>
      {pagination}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
