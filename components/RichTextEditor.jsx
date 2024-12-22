import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({
    editorRef,
    onChange
}) => {
  return (
    <View style={{minHeight : 285}}>
      <RichToolbar
      actions={[
        actions.insertImage,
        actions.setBold,
        actions.setItalic,
        actions.insertBulletsList,
        actions.insertOrderedList,
        actions.insertLink,
        actions.keyboard,
        actions.setStrikethrough,
        actions.setUnderline,
        actions.removeFormat,
        actions.insertVideo,
        actions.checkboxList,
        actions.undo,
        actions.redo
      ]}
        editor={editorRef}
        style={styles.richBar}
        selectedIconTint={theme.colors.primaryDark}
        flatContainerStyle={styles.flatStyle}
        disabled={false}
      />

      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={'What is on your mind?'}
        onChange={onChange}
      />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar:{
        borderTopLeftRadius : theme.radius.xl,
        borderTopRightRadius : theme.radius.xl,
        backgroundColor : theme.colors.gray,
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth : 1.5,
        borderTopWidth : 0,
        borderBottomLeftRadius : theme.radius.xl,
        borderBottomRightRadius : theme.radius.xl,
        borderColor : theme.colors.gray,
        padding : 5
    },
    contentStyle: {
       color: theme.colors.text,
       placeholderColor: 'gray',
    },
    flatStyle : {
        paddingHorizontal : 8,
        gap : 3
    }
})