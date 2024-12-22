import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const welcome = () => {
    const router = useRouter()
  return (
    <ScreenWrapper bg="white">
        <StatusBar style='dark' />
      <View style={styles.container}>
        {/* welcome image */}
        <Image source={require('../assets/images/welcome.png')} resizeMode ='contain' style={styles.welcomeImage} />
        {/* title */}
        <View style={{gap : 20}}>
            <Text style={styles.title}>LinkUp!</Text>
            <Text style={styles.punchline}>
                where every thought finds a home and every image tells a story
            </Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
            <Button
            title='Getting Started'
             buttonStyle={{marginHorizontal : wp(3)}}
             onPress={()=>{router.push('signUp')}}
            />
            <View style={styles.footerLine}>
                <Text style={styles.loginText}>
                    Already have an account ?
                </Text>
                <Pressable onPress={()=>{router.push('login')}}>
                    <Text style={[styles.loginText , {color : theme.colors.primaryDark , fontWeight : theme.fonts.semibold}]}>Login</Text>
                </Pressable>
            </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal : wp(4),
        backgroundColor : 'white',
    },
    welcomeImage: {
        width: wp(100),
        height: hp(30),
        alignSelf: 'center',
    },
    title : {
        color : theme.colors.text,
        fontSize : hp(4),
        textAlign: 'center',
        fontWeight : theme.fonts.extrabold
    },
    punchline : {
        color : theme.colors.text,
        fontSize : hp(1.7),
        textAlign: 'center',
        paddingHorizontal : wp(10),
    },
    footer : {
        gap : 30,
        width : '100%'
    },
    footerLine : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        gap : 5
    },
    loginText : {
        textAlign : 'center',
        color : theme.colors.text,
        fontSize : hp(1.6),
    }


})