import {colors, spacingY} from "@/constants/theme";
import {ModalWrapperProps} from "@/types";
import {Platform, View} from "react-native";

const isIos =Platform.OS === "ios";

export default function ModuleWrapper({style,children,bg=colors.neutral800}:ModalWrapperProps) {
      return (
          <View style={[{backgroundColor:bg,flex:1,paddingTop:isIos ? spacingY._15:20,paddingBottom:isIos?spacingY._20:spacingY._10},style && style]}>{children}</View>
      )
}
