import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker';
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av';
import { createOrUpdatePost } from '../../services/postService'

const NewPost = () => {
  const post = useLocalSearchParams();
  
  const {user} = useAuth();
  const bodyRef = useRef('');
  const editorRef = useRef(null);
  const router = useRouter();
  const [ loading, setLoading ] = useState(false);
  const [file , setFile] = useState(file);

  const onPick = async (isImage) => {

    let mediaConfig ={
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
    }

    if(!isImage){
      mediaConfig={
        mediaTypes : ['videos'],
        allowsEditing : true,
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  useEffect(()=>{ 
    if(post && post.id){
        bodyRef.current = post.body;
        setFile(post.file || null);
        setTimeout(()=>{
          editorRef?.current?.setContentHTML(post.body);
        },300)
    }
  },[])


  const isLocalFile = file => {
    if(!file) return null;
    if(typeof file == 'object'){
      return true;
    }
    return false;
  }


  const getFileType = file => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }
    
    if(file.includes('postImages')){
      return 'image';
    }
    return 'video';
  }

  const getFileUri = file => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  }

  const onSubmit = async () => {
     if(!bodyRef.current && !file){
      Alert.alert('Post', 'Please choose a file or write something to post');
      return;
     }

     let data = {
      file,
      body : bodyRef.current,
      userid : user?.id,
     }

     if(post && post.id) data.id = post.id;

    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
     
    if(res.success){
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    }else{
      Alert.alert('Post', res.msg);
      console.log("Post error", res.msg)
    }
  }


  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
           <Header title="Create Post"/>
           <ScrollView contentContainerStyle={{gap : 20}}>
            {/* avatar */}
             <View style={styles.header}>
              <Avatar
                uri={user?.image}
                size={hp(6.5)}
                rounded={theme.radius.xl}
              />
              <View style={{gap : 2}}>
                  <Text style={styles.username}>
                      {
                        user && user.name
                      }
                  </Text>
                  <Text style={styles.publicText}>
                     Public
                  </Text>
              </View>
             </View>

              <View style={styles.textEditor}>
                <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body}/>
              </View> 

              {
                file && (
                  <View style={styles.file}>
                    {
                      getFileType(file) == 'video' ? (
                        <Video
                          style={{flex : 1}}
                          source={{uri : getFileUri(file)}}
                          useNativeControls
                          resizeMode="cover"
                          isLooping
                        />
                      ):(
                        <Image source={{uri : getFileUri(file)}} resizeMode='cover' style={{flex : 1}}/>
                      )
                    }
                    <Pressable style={styles.closeIcon} onPress={()=>setFile(null)}>
                      <Icon name="delete" size={20} color='white'/>
                    </Pressable>
                  </View>
                )
              }

              <View style={styles.media}>
                 <Text style={styles.addImageText}>Add to your post</Text>
                 <View style={styles.mediaIcons}>
                    <TouchableOpacity onPress={()=>onPick(true)}>
                      <Icon name="image" size={30} color={theme.colors.dark}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>onPick(false)}>
                      <Icon name="video" size={33} color={theme.colors.dark}/>
                    </TouchableOpacity>
                 </View>
              </View>
           </ScrollView>
           <Button
            title={post && post.id ? 'Update' : 'Post'}
            loading={loading}
            onPress={onSubmit}
            buttonStyle={{height : hp(6.2)}}
            hasShadow={false}
           />
      </View>
      
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    marginBottom : 30,
    paddingHorizontal : wp(4),
    gap : 15
  },
  title : {
    fontSize : hp(2.5),
    fontWeight : theme.fonts.semibold,
    color : theme.colors.text,
    textAlign : 'center',
  },
  header : {
    flexDirection : 'row',
    alignItems : 'center',
    gap : 12
  },
  username : {
    fontSize : hp(2.2),
    fontWeight : theme.fonts.semibold,
    color : theme.colors.text,
  },
  avatar :{
    width : hp(6.5),
    height : hp(6.5),
    borderRadius : theme.radius.xl,
    borderCurve : 'continuous',
    borderWidth : 1,
    borderColor : 'rgba(0,0,0,0.1)',
  },
  publicText : {
    fontSize : hp(1.7),
    fontWeight : theme.fonts.medium,
    color : theme.colors.textLight,
  },
  media : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : "space-between",
    borderWidth : 1.5,
    borderColor : theme.colors.gray,
    borderRadius : theme.radius.xl,
    padding : 12,
    borderCurve : 'continuous',
    paddingHorizontal : 18,
  },
  mediaIcons : {
    flexDirection : 'row',
    alignItems : 'center',
    gap : 15,
  },
  addImageText : {
    fontSize : hp(1.9),
    fontWeight : theme.fonts.semibold,
    color : theme.colors.text,
  },
  imageIcon : {
    borderRadius : theme.radius.md,
  },
  file : {
    width : "100%",
    overflow : 'hidden',
    borderCurve : 'continuous',
    borderRadius : theme.radius.xl,
    height : hp(30),
  },
  video :{

  },
  closeIcon : {
    position : 'absolute',
    top : 10,
    right : 10,
    backgroundColor : 'rgba(255,0,0,0.6)',
    borderRadius : 50,
    padding : 7,
  },
  textEditor : {

  }
})