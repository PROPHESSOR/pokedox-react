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
    const { offset, limit } = this.state;

    const request = await fetch(
      `${Config.API}/pokemon?limit=${limit}&offset=${offset * limit}`
    );

    const pokelist = await request.json();

    this.setState({ pokemons: pokelist.results });
  }

  // FIXME: It doesn't work
  async changeOffset(offset) {
    this.setState({ offset }, async () => {
      await this.getPokelist();
    });
  }

  // FIXME: It doesn't work
  async changeLimit(limit) {
    this.setState({ limit }, async () => {
      await this.getPokelist();
    });
  }

  // Event handlers

  onFilterNameChange(filter_name) {
    this.setState({ filter_name });
  }

  onFilterTypeChange(filter_type) {
    this.setState({ filter_type });
  }

  // Render

  render() {
    const { limit, filter_name, filter_type } = this.state;

    const pokemons = this.state.pokemons.map((e, i) => (
      <PokemonCard
        key={i}
        name={e.name || "Unknown"}
        filter_name={filter_name}
        filter_type={filter_type}
      />
    ));

    const pages = [];

    for (let i = 0; i < Math.ceil(964 / limit); i++) {
      pages.push(
        <div key={i} className="col page-item">
          <button className="page-link" onClick={() => this.changeOffset(i)}>
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
        <div className="row">{pokemons}</div>
        <nav>
          <div className="row">{pages}</div>
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
