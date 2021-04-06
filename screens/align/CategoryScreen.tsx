import React, {useEffect} from 'react'
import { PlatformColor } from 'react-native'
import { View } from '../../components/Themed'

const CategoryScreen = ({ navigation, route }) => {
  const {routeTitle} = route.params

  useEffect(() => {
    navigation.setOptions({title: `${routeTitle}`})
  }, [])

  return (
    <View
      lightColor='#f5f5f5'
      darkColor={PlatformColor('systemGray6')}
      style={{
        height: '100%'
      }}>
      
  </View>

  )
}

export default CategoryScreen
