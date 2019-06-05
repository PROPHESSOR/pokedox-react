import React from "react";
import ReactDOM from "react-dom";

import PokemonCard from "./components/PokemonCard";

import Config from "./config";

import "./styles.css";

class App extends React.Component {
  state = {
    pokemons: [],
    limit: 20,
    offset: 0,
    filter: ""
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
    const { offset, limit } = this.state;

    const request = await fetch(
      `${Config.API}/pokemon?limit=${limit}&offset=${offset * limit}`
    );

    const pokelist = await request.json();

    this.setState({ pokemons: pokelist.results });
  }

  async changeOffset(offset) {
    this.setState({ offset });
    await this.getPokelist();
    this.forceUpdate();
  }

  async changeLimit(limit) {
    this.setState({ limit });
    await this.getPokelist();
    this.forceUpdate();
  }

  // Computed properties

  get filteredPokemons() {
    const { pokemons, filter } = this.state;

    if (!filter) return pokemons;

    return pokemons.filter(e => e.name.startsWith(filter));
  }

  // Event handlers

  onFilterChange(filter) {
    this.setState({ filter });
  }

  // Render

  render() {
    const pokemons = this.filteredPokemons.map((e, i) => (
      <PokemonCard key={i} name={e.name || "Unknown"} />
    ));

    const { limit } = this.state;

    const pages = [];

    for (let i = 0; i < Math.ceil(964 / limit); i++) {
      pages.push(
        <div key={i} class="col page-item">
          <button class="page-link" onClick={() => this.changeOffset(i)}>
            {i + 1}
          </button>
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <h1>PokedoxDemo</h1>
        <input
          type="text"
          value={this.state.filter}
          onChange={e => this.onFilterChange(e.target.value)}
        />
        <div className="row">{pokemons}</div>
        <nav>
          <div class="row">{pages}</div>
          <select
            value={this.state.offset}
            onChange={e => this.changeOffset(e.target.value)}
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </nav>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
