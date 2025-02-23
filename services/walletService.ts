import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import {collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch} from "firebase/firestore";
import { firestore } from "@/config/firebase";




export const createOrUpdateWallet = async (walletData: Partial<WalletType>): Promise<ResponseType> => {
    try {
        let walletToSave = { ...walletData };

        if (walletData.image) {
            const imageUploadRes = await uploadFileToCloudinary(walletData.image, "wallets");

            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Error uploading wallet icon to Cloudinary" };
            }

            walletToSave.image = imageUploadRes.data; // Ensure this is a URL string
        }

        if (!walletData?.id) {
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date();
        }

        console.log("Final Wallet to Save:", walletToSave);

        const walletRef = walletData?.id
            ? doc(firestore, "wallets", walletData?.id)
            : doc(collection(firestore, "wallets"));

        await setDoc(walletRef, walletToSave, { merge: true });

        return { success: true, data: { ...walletToSave, id: walletRef.id } };
    } catch (err: any) {
        console.log("Error creating or updating wallet", err);
        return { success: false, msg: err?.message || "Error creating or updating wallet" };
    }
};


export const deleteWallet = async (walletId:string):Promise<ResponseType> =>{
    try{
        const ref = doc(firestore,'wallets',walletId)
        await deleteDoc(ref);
        return {success:true,msg:'Wallet deleted successfully'};
    }
    catch(err:any){
        console.log("Error deleting wallet", err);
        return {success: false, msg: err?.message || "Error deleting wallet"};
    }
}

export const deleteTransactionByWallet = async (walletId:string):Promise<ResponseType> =>{
    try{
        let hasMoreTransactions =true;
        while (hasMoreTransactions){
            const transactionQuery = query(collection(firestore,"transactions"),where('walletId','==',walletId));
            const transSnap =await getDocs(transactionQuery);
            if(transSnap.size ==0){
                hasMoreTransactions = false;
                break;
            }
            const batch = writeBatch(firestore);
            transSnap.forEach((doc) => {
                batch.delete(doc.ref)
            })
            await batch.commit();

        }
        return {
            success:true,
            msg:'All transactions have been deleted',
        }
    }
    catch(err:any){
        console.log("Error deleting wallet", err);
        return {success: false, msg: err?.message || "Error deleting wallet"};
    }
}