import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import PokemonCard from "./components/PokemonCard";

import Config from "./config";

function App() {
  const [filter_name, set_filter_name] = useState("");
  const [filter_type, set_filter_type] = useState("");
  const [limit, set_limit] = useState(20);
  const [offset, set_offset] = useState(0);
  const [pokelist, set_pokelist] = useState([]);

  useEffect(() => {
    const fetchPokelist = async () => {
      const request = await fetch(`${Config.API}/pokemon?limit=999`);

      const json = await request.json();

      set_pokelist(json.results);
    };

    fetchPokelist();
  }, []);

  const filtered_pokemons = filter_name
    ? pokelist.filter(pokemon =>
        pokemon.name.startsWith(filter_name.toLowerCase())
      )
    : pokelist;

  const pokemons = filtered_pokemons
    .slice(offset * limit, offset * limit + limit)
    .map((pokemon, i) => (
      <PokemonCard
        key={pokemon.name}
        name={pokemon.name || "Unknown"}
        filter_type={filter_type}
      />
    ));

  const pages = [];

  const num_pages = Math.ceil(filtered_pokemons.length / limit);
  for (let i = 0; i < num_pages; i++) {
    pages.push(
      <div key={i} className="col page-item">
        <button className="page-link" onClick={() => set_offset(i)}>
          {i + 1}
        </button>
      </div>
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

  return (
    <div className="container-fluid">
      <h1>PokedoxDemo</h1>
      <input
        type="text"
        placeholder="Filter by name"
        value={filter_name}
        onChange={e => set_filter_name(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter, by, types"
        value={filter_type}
        onChange={e => set_filter_type(e.target.value)}
      />
      {/* {pagination} */}
      <div className="row">{pokemons}</div>
      {pagination}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
