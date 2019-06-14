import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";
import { observer, useObservable } from "mobx-react-lite";

import PokemonCard from "./components/PokemonCard";

// import store from "./store";

import Config from "./config";
import "./styles.scss";

const App = observer(() => {
  const store = useObservable({
    pokelist: [],
    filter_name: "",
    filter_type: new Set(),

    setPoketlist(array) {
      store.pokelist = array;
    },

    setFilterName(string) {
      store.filter_name = string;
    },

    toggleFilterType(type) {
      const { filter_type } = store;

      if (filter_type.has(type)) filter_type.delete(type);
      else filter_type.add(type);
    },

    get filtered_pokelist() {
      const { pokelist, filter_name } = store;

      return filter_name
        ? pokelist.filter(pokemon =>
            pokemon.name.startsWith(filter_name.toLowerCase())
          )
        : pokelist;
    }
  });

  const { filtered_pokelist, filter_name, filter_type } = store;
  const [limit, set_limit] = useState(20);
  const [offset, set_offset] = useState(0);

  const [types, set_types] = useState([]);
  const [show_filter, set_show_filter] = useState(false);

  const refetch = () => {
    const fetchTypes = async () => {
      const request = await fetch(`${Config.API}/type`);

      const json = await request.json();

      set_types(json.results.map(e => e.name));
    };

    const fetchPokelist = async () => {
      const request = await fetch(`${Config.API}/pokemon?limit=999`);

      const json = await request.json();

      store.setPoketlist(json.results);
    };

    const fetchFilteredPoketlist = async () => {
      let list = new Set();

      for (const type of filter_type) {
        const request = await fetch(`${Config.API}/type/${type}`);

        const json = await request.json();

        const tmp = json.pokemon.map(e => e.pokemon);

        list = new Set([...list, ...tmp]);
      }

      store.setPoketlist(Array.from(list));
    };

    // First fetch types
    if (!types.length) fetchTypes();

    // Fetch all pokelist or the filtered one
    if (!filter_type.size) fetchPokelist();
    else fetchFilteredPoketlist();
  };

  useEffect(refetch, [types, filter_type, store]);

  useEffect(() => autorun(refetch), []); // eslint-disable-line

  // Components

  const pokemons = filtered_pokelist
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

    const num_pages = Math.ceil(filtered_pokelist.length / limit);

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
            checked={filter_type.has(e)}
            onChange={() => store.toggleFilterType(e)}
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
          onChange={e => store.setFilterName(e.target.value)}
        />
        <button
          style={{ fontWeight: filter_type.size ? "bolder" : "normal" }}
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
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
