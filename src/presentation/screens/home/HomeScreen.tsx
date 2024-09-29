import { StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"

export const HomeScreen = () => {
  return (
    <View style={ styles.container }>
        <Text variant="displaySmall">Home Screen</Text>
        <Button mode="contained" 
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  }
})