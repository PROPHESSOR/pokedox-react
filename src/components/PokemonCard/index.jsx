import React, { useState, useEffect } from "react";

import Config from "../../config.json";

import "./styles.scss";

const toCamelCase = str => str.charAt().toUpperCase() + str.slice(1);

export default function PokemonCard(props) {
  const { name } = props;

  const [pokemon, set_pokemon] = useState({ name });

  useEffect(() => {
    const fetchPokemon = async () => {
      const request = await fetch(`${Config.API}/pokemon/${pokemon.name}`);

      const json = await request.json();

      set_pokemon(json);
    };

    fetchPokemon();
  }, [pokemon.name]);

  const pokemon_avatar = !pokemon.sprites ? null : (
    <img
      className="card-img-top"
      src={pokemon.sprites.front_default}
      alt={toCamelCase(pokemon.name)}
    />
  );

  const pokemon_badges = !pokemon.id
    ? null
    : pokemon.types
        .sort((a, b) => a.slot - b.slot)
        .map((e, i) => (
          <span key={i} className="badge badge-secondary">
            {e.type.name}
          </span>
        ));

  const pokemon_stats = !pokemon.id ? null : (
    <div className="card-text">
      <ul>
        <li>
          <b>Weight:</b> {pokemon.weight} Kg
        </li>
        <li>
          <b>Abilities:</b>{" "}
          {pokemon.abilities.map(e => e.ability.name).join(", ")}
        </li>
        <li>
          <b>Forms:</b> {pokemon.forms.map(e => e.name).join(", ")}
        </li>
      </ul>
    </div>
  );

  return (
    <div
      className={`${
        pokemon.id ? "ready" : "awaiting"
      } col-sm-4 col-md-3 col-lg-2 card pokecard`}
    >
      {pokemon_avatar}

      <div className="card-body">
        <h5 className="card-title">
          {toCamelCase(pokemon.name)} {pokemon_badges}
        </h5>

        {pokemon_stats}
      </div>
    </div>
  );
}
