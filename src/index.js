import React from "react";
import ReactDOM from "react-dom";

import PokemonCard from "./components/PokemonCard";

import Config from "./config";

import "./styles.css";

class App extends React.Component {
  state = {
    pokemons: []
  };

  replacePokemon(id, data) {
    const { pokemons } = this.state;

    pokemons.splice(id, 1, data);

    this.setState(pokemons);
  }

  async componentDidMount() {
    await this.getPokelist();
  }

  async getPokelist(offset = 0, limit = 20) {
    const request = await fetch(`${Config.API}/pokemon?limit=${limit}`);

    const pokelist = await request.json();

    this.setState({ pokemons: pokelist.results });
  }

  render() {
    const pokemons = this.state.pokemons.map((e, i) => (
      <PokemonCard key={i} name={e.name || "Unknown"} />
    ));

    return (
      <div className="container-fluid">
        <h1>PokedoxDemo</h1>
        <div className="row">{pokemons}</div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
