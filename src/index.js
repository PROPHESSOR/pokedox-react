import React from "react";
import ReactDOM from "react-dom";

import PokemonCard from "./components/PokemonCard";

import Config from "./config";

class App extends React.Component {
  state = {
    pokemons: [],
    limit: 20,
    offset: 0,
    filter_name: "",
    filter_type: ""
  };

  replacePokemon(id, data) {
    const { pokemons } = this.state;

    pokemons.splice(id, 1, data);

    this.setState(pokemons);
  }

  async componentDidMount() {
    await this.getPokelist();
  }

  async getPokelist() {
    const request = await fetch(`${Config.API}/pokemon?limit=999`);

    const pokelist = await request.json();

    this.setState({ pokemons: pokelist.results });
  }

  onChangeOffset(offset) {
    this.setState({ offset });
  }

  onChangeLimit(limit) {
    this.setState({ limit });
  }

  // Event handlers

  onFilterNameChange(filter_name) {
    this.setState({ filter_name });
  }

  onFilterTypeChange(filter_type) {
    this.setState({ filter_type });
  }

  // Computed

  get filteredPokemons() {
    const { filter_name, pokemons } = this.state;

    if (filter_name)
      return pokemons.filter(pokemon =>
        pokemon.name.startsWith(filter_name.toLowerCase())
      );

    return pokemons;
  }

  get pokemonsSlice() {
    const { offset, limit } = this.state;

    const realOffset = offset * limit;

    return this.filteredPokemons.slice(realOffset, realOffset + limit);
  }

  // Render

  render() {
    const { limit, filter_type } = this.state;

    const pokemons = this.pokemonsSlice.map((e, i) => (
      <PokemonCard
        key={e.name}
        name={e.name || "Unknown"}
        filter_type={filter_type}
      />
    ));

    const pages = [];

    const num_pages = Math.ceil(this.filteredPokemons.length / limit);
    for (let i = 0; i < num_pages; i++) {
      pages.push(
        <div key={i} className="col page-item">
          <button className="page-link" onClick={() => this.onChangeOffset(i)}>
            {i + 1}
          </button>
        </div>
      );
    }

    const pagination = (
      <nav>
        <div className="row">{pages}</div>
        <select
          value={this.state.limit}
          onChange={e => this.onChangeLimit(Number(e.target.value))}
        >
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
          value={this.state.filter_name}
          onChange={e => this.onFilterNameChange(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter, by, types"
          value={this.state.filter_type}
          onChange={e => this.onFilterTypeChange(e.target.value)}
        />
        {/* {pagination} */}
        <div className="row">{pokemons}</div>
        {pagination}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
