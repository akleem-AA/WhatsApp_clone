import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'

export default function BackButton({navigation}) {
  // const navigation = useNavigation()
  console.log("back button navigatio",navigation)
  return (
    <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/arrow_back.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 ,
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
})
