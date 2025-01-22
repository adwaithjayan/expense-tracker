import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {CustomButtonProps} from "@/types";
import {colors, radius} from "@/constants/theme";
import {verticalScale} from "@/utils/styling";
import Loading from "@/components/Loading";

const Button = ({style,onPress,loading=false,children}:CustomButtonProps) => {
      if(loading){
            return  <View style={[{backgroundColor:'transparent',borderRadius:radius._17,borderCurve:'continuous',height:verticalScale(52),justifyContent:'center',alignItems:'center'}]}>
                  <Loading/>
            </View>
      }
      return (
          <TouchableOpacity onPress={onPress} style={[{backgroundColor:colors.primary,borderRadius:radius._17,borderCurve:'continuous',height:verticalScale(52),justifyContent:'center',alignItems:'center'},style]}>
                {children}
          </TouchableOpacity>
      )
}
export default Button
