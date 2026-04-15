import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from '@amazon-devices/react-native-safe-area-context'
import MainContainer from '../Container/MainContainer'

const VideoDetailScreen = () => {
  return (
    <SafeAreaView>
        <MainContainer>
            <View>
                <Text>Video detail</Text>
            </View>
        </MainContainer>
    </SafeAreaView>
  )
}

export default VideoDetailScreen