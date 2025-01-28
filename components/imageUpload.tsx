import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/types'
import { UploadSimple, X, XCircle } from 'phosphor-react-native'
import { colors, radius } from '@/constants/theme'
import Typo from './Type'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { getFilePath } from '@/services/imageService'
import * as ImagePicker from "expo-image-picker";


const ImageUpload = ({file=null,onSelect,onClear,containerStyle,imageStyle,placeholder=""}:ImageUploadProps) => {
    const pickImage =async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes:['images'],
                          allowsEditing:false,
                          aspect:[4,3],
                          quality:0.5
                    })
        
                    if(!result.canceled){
                          onSelect(result.assets[0])
                    }
    }
  return (
    <View>
      {!file&& <TouchableOpacity onPress={pickImage} style={[styles.inputContainer,containerStyle && containerStyle]}>
        <UploadSimple color={colors.neutral200}/>
        {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>}
        {
            file && <View style={[styles.images,imageStyle && imageStyle]}>
                <Image style={{flex: 1}} source={getFilePath(file)} contentFit='cover' transition={100}/>
                <TouchableOpacity onPress={onClear} style={styles.delete}>
                    <XCircle size={verticalScale(24)} weight='fill' color={colors.white}/>
                </TouchableOpacity>
            </View>
        }
    </View>
  )
}

export default ImageUpload

const styles = StyleSheet.create({
  inputContainer:{
    height:verticalScale(54),
    backgroundColor:colors.neutral700,
    borderRadius:radius._15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:10,
    borderWidth:1,
    borderColor:colors.neutral500,
    borderStyle:'dashed',
  },
  images:{
    height:scale(150),
    width:scale(150),
    borderRadius:radius._15,
    borderCurve:'continuous',
    overflow:'hidden',
  },
  delete:{
    position:'absolute',
    top:scale(6),
    right:scale(6),
    shadowColor:colors.black,
    shadowOpacity:1,
    shadowRadius:10,
    shadowOffset:{width:0,height:5},
  }
})