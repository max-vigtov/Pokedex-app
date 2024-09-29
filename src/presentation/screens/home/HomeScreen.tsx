import { FlatList, StyleSheet, View } from "react-native"
import { getPokemons } from "../../../actions/pokemons"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { PokeballBg } from '../../components/ui/PokeballBg';
import { Text } from "react-native-paper";
import { globalTheme } from "../../../config/theme/global-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PokemonCard } from "../../components/pokemons/PokemonCard";

export const HomeScreen = () => {
  
  const { top } = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({ 
    queryKey: ['pokemons', 'infinite'], 
    initialPageParam: 0,
    queryFn: async (params) => {
      const pokemons = await getPokemons(params.pageParam);

      pokemons.forEach( pokemon => { 
        queryClient.setQueryData( ['pokemon', pokemon.id], pokemon );
      })
      return pokemons;
    },
    getNextPageParam: (lastPage, pages) => pages.length,

  });
  return (
    <View style={ [globalTheme.globalMargin, styles.container ] }>
       <PokeballBg style={ styles.imgPosition }/>
       <FlatList
          data = { data?.pages.flat() ?? [] }
          style = {{ paddingTop: top + 20 }}
          keyExtractor = { (pokemon, index) => `${ pokemon.id }-${ index }`}
          numColumns = { 2 }
          ListHeaderComponent={ () => (
            <Text variant="displayMedium">Pokedex</Text>
          )}
          renderItem = {({ item }) => <PokemonCard pokemon={item}/> }
          onEndReachedThreshold={ 0.6 }
          onEndReached={ () => fetchNextPage() }
          showsVerticalScrollIndicator={ false }
        />
    </View>
  )
}

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
  container:{
   // backgroundColor: 'grey'
  }
})