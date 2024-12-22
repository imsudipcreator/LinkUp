import { StyleSheet, Text, View , Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'
import Loading from '../components/Loading'

const index = () => {
  const router = useRouter()
  return (
    <View style={{flex :1, justifyContent:'center', alignItems:'center'}}>
      <Loading/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})