import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon"
import type { PokeAPIPaginatedResponse, PokeAPIPokemonResponse } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";

export const getPokemonById = async ( id: number ):Promise<Pokemon> => {

    try {       

        const { data } = await pokeApi.get<PokeAPIPokemonResponse>(`/pokemon/${id}`);

        const pokemon = await  PokemonMapper.pokeApiPokemonToEntity(data) ;
        
        return pokemon;

    } catch (error) {
        throw new Error("Error getting Pokemons");        
    }

}