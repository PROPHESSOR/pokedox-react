import React, { Component } from "react";

import Config from "../../config.json";

import "./styles.scss";

export default class PokemonCard extends Component {
  state = {
    pokemon: {
      name: this.props.name
    }
  };

  componentDidMount() {
    this.fetchPokemon();
  }

  async fetchPokemon() {
    const { pokemon } = this.state;

    const request = await fetch(`${Config.API}/pokemon/${pokemon.name}`);

    const _pokemon = await request.json();

    this.setState({ pokemon: _pokemon });
  }

  toCamelCase(str) {
    return str.charAt().toUpperCase() + str.slice(1);
  }

  // Computed properties, Yeah, Vue.js-like

  get displayableName() {
    return this.toCamelCase(this.state.pokemon.name);
  }

  get isLoadedClass() {
    return this.state.pokemon.id ? "ready" : "awaiting";
  }

  get pokemonAvatar() {
    const { pokemon } = this.state;

    if (!pokemon.sprites) return null;

    return (
      <img
        className="card-img-top"
        src={pokemon.sprites.front_default}
        alt={this.displayableName}
      />
    );
  }

  get pokemonStats() {
    const { pokemon } = this.state;

    if (!pokemon.id) return null;

    return (
      <div className="card-text">
        <ul>
          <li>Weight: {pokemon.weight} Kg</li>
          <li>
            Abilities: {pokemon.abilities.map(e => e.ability.name).join(", ")}
          </li>
          <li>Forms: {pokemon.forms.map(e => e.name).join(", ")}</li>
        </ul>
      </div>
    );
  }

  get pokemonBadges() {
    const { pokemon } = this.state;

    if (!pokemon.id) return null;

    return pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((e, i) => (
        <span key={i} className="badge badge-secondary">
          {e.type.name}
        </span>
      ));
  }

  get show() {
    const { pokemon } = this.state;
    const { filter_name, filter_type } = this.props;

    if (filter_name && !pokemon.name.startsWith(filter_name)) return false;

    if (pokemon.id && filter_type) {
      const types = filter_type.split(/\s*,\s*/);

      if (!pokemon.types.some(x => types.includes(x.type.name))) return false;
    }

    return true;
  }

  // Render

  render() {
    if (!this.show) return null;

    return (
      <div
        className={`${
          this.isLoadedClass
        } col-sm-4 col-md-3 col-lg-2 card pokecard`}
      >
        {this.pokemonAvatar}

        <div className="card-body">
          <h5 className="card-title">
            {this.displayableName} {this.pokemonBadges}
          </h5>

          {this.pokemonStats}
        </div>
      </div>
    );
  }
}
