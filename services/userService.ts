import {UserDataType,ResponseType} from "@/types";
import {doc, updateDoc} from "@firebase/firestore";
import {firestore} from "@/config/firebase";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (uid:string,updatedData:UserDataType):Promise<ResponseType>=>{
      try{
            if(updatedData.image && updatedData?.image?.uri){
                  const imageRes = await uploadFileToCloudinary(updatedData.image,"users");
                  if(!imageRes.success){
                        return{success:false,msg:imageRes.msg || "Error uploading image to cloudinary"};
                  }
                  updatedData.image = imageRes.data;
            }

            const userRef = doc(firestore,"users",uid);
            await updateDoc(userRef,updatedData)
            return {success:true,msg:"User updated successfully."};
      }
      catch (error:any) {
            console.log("error updating the user ",error);
            return {success:false,msg:error?.message};
      }
}