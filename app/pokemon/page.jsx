'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const PokemonInfo = () => {
    const [pokemonData, setPokemonData] = useState(null);
    const [error, setError] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
                setPokemonList(response.data.results.map(pokemon => pokemon.name));
            } catch (error) {
                setError('Failed to load Pokémon list.');
            }
        };

        fetchPokemonList();
    }, []);

    const fetchPokemonData = async (pokemon) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            setPokemonData(response.data);
            setError('');
        } catch {
            setPokemonData(null);
            setError('Pokémon not found. Please try again.');
        }
    };

    const handleSelectChange = (e) => {
        const selectedPokemon = e.target.value;
        const index = pokemonList.indexOf(selectedPokemon);
        setCurrentIndex(index);
        fetchPokemonData(selectedPokemon);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevPokemon = pokemonList[currentIndex - 1];
            setCurrentIndex(currentIndex - 1);
            fetchPokemonData(prevPokemon);
        }
    };

    const handleNext = () => {
        if (currentIndex < pokemonList.length - 1) {
            const nextPokemon = pokemonList[currentIndex + 1];
            setCurrentIndex(currentIndex + 1);
            fetchPokemonData(nextPokemon);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Pokémon Info App</h1>

            <select onChange={handleSelectChange} value={pokemonList[currentIndex] || ''}>
                <option value="" disabled>Select a Pokémon</option>
                {pokemonList.map((pokemon) => (
                    <option key={pokemon} value={pokemon}>
                        {pokemon.toUpperCase()}
                    </option>
                ))}
            </select>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {pokemonData && (
                <div>
                    <h2>{pokemonData.name.toUpperCase()}</h2>
                    <img
                        src={pokemonData.sprites.front_default}
                        alt={pokemonData.name}
                        style={{ height: '150px' }}
                    />
                    <p>Type: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
                    <p>Weight: {pokemonData.weight} kg</p>
                    <p>Height: {pokemonData.height} m</p>

                    <div style={{ marginTop: '10px' }}>
                        <button onClick={handlePrevious} disabled={currentIndex <= 0}>
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ marginLeft: '10px' }}
                            disabled={currentIndex >= pokemonList.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonInfo;
