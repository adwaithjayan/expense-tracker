import {TouchableOpacity} from 'react-native'
import {BackButtonProps} from "@/types";
import {useRouter} from "expo-router";
import {CaretLeft} from "phosphor-react-native";
import {verticalScale} from "@/utils/styling";
import {colors, radius} from "@/constants/theme";

const BackButton = ({style,iconSize=26}:BackButtonProps) => {
      const router = useRouter();
      return (
          <TouchableOpacity onPress={()=>router.back()} style={[{backgroundColor:colors.neutral600,alignSelf:'flex-start',borderCurve:'continuous',borderRadius:radius._12,padding:5},style]}>
                <CaretLeft size={verticalScale(iconSize)} color={colors.white} weight='bold'/>
          </TouchableOpacity>
      )
}
export default BackButton

