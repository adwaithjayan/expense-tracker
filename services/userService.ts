import {UserDataType,ResponseType} from "@/types";
import {doc, updateDoc} from "@firebase/firestore";
import {firestore} from "@/config/firebase";

export const updateUser = async (uid:string,updatedData:UserDataType):Promise<ResponseType>=>{
      try{
            const userRef = doc(firestore,"users",uid);
            await updateDoc(userRef,updatedData)
            return {success:true,msg:"User updated successfully."};
      }
      catch (error:any) {
            console.log("error updating the user ",error);
            return {success:false,msg:error?.message};
      }
}