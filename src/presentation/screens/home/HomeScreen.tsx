import { StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { getPokemons } from "../../../actions/pokemons"
import { useQuery } from "@tanstack/react-query"

export const HomeScreen = () => {
  
  const { isLoading, data } = useQuery({ 
    queryKey: ['pokemons'], 
    queryFn: () => getPokemons(),
    staleTime: 10000 * 60 * 60, 
  });

  return (
    <View style={ styles.container }>
        <Text variant="displaySmall">Home Screen</Text>

        {
          isLoading ? (
            <ActivityIndicator/>
            ) : (
              <Button mode="contained" 
                onPress={() => console.log('Pressed')}>
                Press me
              </Button>
           )
        }
        
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  }
})