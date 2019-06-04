import React, { Component } from "react";

import Config from "../../config.json";

import "./styles.scss";

export default class PokemonCard extends Component {
  state = {
    pokemon: {
      name: this.props.name
    }
  };

  async componentDidMount() {
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
      <p className="card-text">
        <ul>
          <li>Weight: {pokemon.weight} Kg</li>
          <li>
            Abilities: {pokemon.abilities.map(e => e.ability.name).join(", ")}
          </li>
          <li>Forms: {pokemon.forms.map(e => e.name).join(", ")}</li>
        </ul>
      </p>
    );
  }

  get pokemonBadges() {
    const { pokemon } = this.state;

    if (!pokemon.id) return null;

    return pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map(e => <span class="badge badge-secondary">{e.type.name}</span>);
  }

  // Render

  render() {
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
