import { FlatList, StyleSheet, View } from "react-native"
import { getPokemons } from "../../../actions/pokemons"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { PokeballBg } from '../../components/ui/PokeballBg';
import { Text } from "react-native-paper";
import { globalTheme } from "../../../config/theme/global-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PokemonCard } from "../../components/pokemons/PokemonCard";

export const HomeScreen = () => {
  
  const { top } = useSafeAreaInsets()

  // const { isLoading, data: pokemons= [] } = useQuery({ 
  //   queryKey: ['pokemons'], 
  //   queryFn: () => getPokemons(0),
  //   staleTime: 10000 * 60 * 60, 
  // });

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({ 
    queryKey: ['pokemons', 'infinite'], 
    initialPageParam: 0,
    queryFn: ( params ) => getPokemons(params.pageParam),
    getNextPageParam: (lastPage, pages) => pages.length

    // staleTime: 10000 * 60 * 60, 
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