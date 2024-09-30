import { FlatList, View } from "react-native"
import { ActivityIndicator, TextInput, useTheme, Text } from 'react-native-paper';
import { globalTheme } from "../../../config/theme/global-theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PokemonCard } from "../../components/pokemons/PokemonCard"
import { useQuery } from "@tanstack/react-query"
import { getPokemonNamesWithId } from "../../../actions/pokemons"
import { useMemo, useState } from "react"
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { getPokemonsByIds } from "../../../actions/pokemons/get-pokemons-by-ids";
import { useDebounceValue } from "../../hooks/useDebounceValue";

export const SearchScreen = () => {

  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');
  const theme = useTheme();
  const debouncedValue = useDebounceValue(term);

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  const pokemonNameIdList = useMemo(() => {
    if ( !isNaN(Number(debouncedValue)) ) {
      const pokemon = pokemonNameList.find((pokemon) => pokemon.id === Number(debouncedValue));
      return pokemon ? [ pokemon ] : [];
    }

    if (debouncedValue.length === 0) return [];
    if (debouncedValue.length < 3) return [];

    return pokemonNameList.filter((pokemon) => pokemon.name.toLowerCase().includes(debouncedValue.toLowerCase()));

  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });


  if ( isLoading ) {
    return ( <FullScreenLoader/> )      
  }

  return (
    <View style={[globalTheme.globalMargin, {paddingTop: top + 10, flex: 1}]}>
        <TextInput
          textColor={ theme.dark ? 'white' : 'black'}
          placeholder="Search Pokemon"
          mode="flat"
          autoFocus
          autoCorrect={false}
          onChangeText={setTerm}
          value={term}
        />
       { isLoadingPokemons && <ActivityIndicator style={{ paddingTop: 20 }}/>}
         
        <FlatList
          data = { pokemons }
          style={{paddingTop: top + 20}}
          keyExtractor = { (pokemon, index) => `${ pokemon.id }-${ index }`}
          numColumns = { 2 }
          renderItem = {({ item }) => <PokemonCard pokemon={item}/> }
          onEndReachedThreshold={ 0.6 }
          showsVerticalScrollIndicator={ false }
          ListFooterComponent={ <View style={{ height: 150 }}/>}
        />        
    </View>
  )
}