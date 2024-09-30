import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigator/StackNavigator";
import { PokemonCard } from "../../components/pokemons/PokemonCard";
import { PokeballBg } from '../../components/ui/PokeballBg';
import { globalTheme } from "../../../config/theme/global-theme";
import { getPokemons } from "../../../actions/pokemons"
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { FlatList, StyleSheet, View } from "react-native"
import { FAB, Text, useTheme } from "react-native-paper";

interface Props extends StackScreenProps<RootStackParams,'HomeScreen'> {};

export const HomeScreen = ({ navigation }: Props) => {
  
  const { top } = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const theme = useTheme();

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
    getNextPageParam: (lastPage, allPages) => allPages.length
  });

  if ( isLoading ) {
    return (
      <FullScreenLoader/>
    )
  }

  return (
    <View style={ globalTheme.globalMargin }>
       <PokeballBg style={ styles.imgPosition }/>
       <FlatList
          data = { data?.pages.flat() ?? [] }
          style = {{ paddingTop: top + 20 }}

          keyExtractor = { (pokemon, index) => `${ pokemon.id }-${ index }`}
          numColumns = { 2 }
          ListHeaderComponent={ () => (
            <Text variant="displayMedium" style={{ color: theme.dark ? 'white' : 'black', paddingBottom: 30}}>Pokedex</Text>
          )}
          renderItem = {({ item }) => <PokemonCard pokemon={item}/> }
          onEndReachedThreshold={ 0.6 }
          onEndReached={ () => fetchNextPage() }
          showsVerticalScrollIndicator={ false }
        />

        <FAB
          label="Search"
          style={[ globalTheme.fab, { backgroundColor: theme.colors.primary}]}
          mode="elevated"
          color={ theme.dark ? 'black' : 'white'}
          onPress={ () => navigation.push('SearchScreen') }
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
})