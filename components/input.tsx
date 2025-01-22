import {View, Text, TextInput} from 'react-native'
import React from 'react'
import {InputProps} from "@/types";
import {colors, radius, spacingX} from "@/constants/theme";
import {verticalScale} from "@/utils/styling";

const Input = (props:InputProps) => {
      return (
          <View style={[{flexDirection:'row',paddingHorizontal:spacingX._15,gap:spacingX._10,height:verticalScale(54),alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.neutral300,borderRadius:radius._17,borderCurve:'continuous'},props.containerStyle && props.containerStyle]}>
                {props.icon && props.icon}
                <TextInput {...props} style={[{color:colors.white,fontSize:verticalScale(14),flex:1},props.inputStyle]} placeholderTextColor={colors.neutral400} ref={props.inputRef && props.inputRef}/>
          </View>
      )
}
export default Input

