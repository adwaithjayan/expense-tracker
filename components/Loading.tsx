import {View, Text, ActivityIndicatorProps, ActivityIndicator} from 'react-native'
import React from 'react'
import {colors} from "@/constants/theme";

const Loading = ({size='large',color=colors.primary}:ActivityIndicatorProps) => {
      return (
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator color={color} size={size}/>
          </View>
      )
}
export default Loading
