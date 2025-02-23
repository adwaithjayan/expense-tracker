import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types"
import {
    collection,
    deleteDoc,
    doc,
    getDoc, getDocs,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import {createOrUpdateWallet} from "@/services/walletService";
import {getLast12Months, getLast7Days, getYearsRange} from "@/utils/common";
import {scale} from "@/utils/styling";
import {colors} from "@/constants/theme";

export const createOrUpdateTransaction = async (transactionData:Partial<TransactionType>):Promise<ResponseType>=>{
    try{
        const {id,type,walletId,amount,image} = transactionData;
        if(!amount || amount <=0 || !walletId || !type){
            return {success: false, msg: "Invalid data"};
        }
        if(id){
            const oldTransactionSnap = await getDoc(doc(firestore,"transactions",id));
            const oldTransaction = oldTransactionSnap.data() as TransactionType;
            const shouldRevertOriginal = oldTransaction.type != type || oldTransaction.amount != amount || oldTransaction.walletId != walletId;
            if(shouldRevertOriginal){
                let res = await revertAndUpdateWallet(oldTransaction,Number(amount),type,walletId);
                if(!res.success) return res;
            }
        }else {
            let res = await updateWalletForNewTransaction(walletId, Number(amount!), type);
            if (!res.success) return res;
        }
        if(image){
            const imageUploadRes = await uploadFileToCloudinary(image,"transactions");
            if(!imageUploadRes.success){
                return{success: false, msg: imageUploadRes.msg || "Error uploading transaction icon to cloudinary"};
            }
            transactionData.image = imageUploadRes.data;
        };

        const transactionRef = id? doc(firestore,"transactions",id): doc(collection(firestore,"transactions"));
        await setDoc(transactionRef,transactionData,{merge:true});
        return {success:true,msg: "Transaction saved successfully.",data:{...transactionData,id:transactionRef.id}};
    }
    catch(err:any){
        console.log("Error creating or updating transaction")
        return {success: false, msg: err?.message || "Error creating or updating transaction"};
    }
}

const updateWalletForNewTransaction =async (walletId:string, amount:number,type:string)=>{
    try{
        const walletRef= doc(firestore,"wallets",walletId);
        const walletSnap = await getDoc(walletRef);
        if(!walletSnap.exists()){
            return {success: false, msg: "Wallet not found"};
        }
        const walletData = walletSnap.data() as WalletType;
        if(type ==='expense' && walletData.amount! - amount <0){
            return {success: false, msg:"Selected wallet don't have enough balance"}
        }
        const updateType = type =='income' ? "totalIncome":"totalExpenses";
        const updatedWalletAmount = type =='income' ?Number(walletData.amount) + amount:Number(walletData.amount) -amount;
        const updatedTotals = type == 'income' ? Number(walletData.totalIncome) + amount : Number(walletData.totalExpenses) -amount;

        await updateDoc(walletRef,{
            amount:updatedWalletAmount,
            [updateType]:updatedTotals
        });
        return {success:true}

    }
    catch(err:any){
        console.log("Error updating transaction")
        return {success: false, msg: err?.message || "Error updating transaction"};
    }
}


const revertAndUpdateWallet =async (oldTransaction:TransactionType, newAmount:number,newType:string,newWalletId:string)=>{
    try{
        const originalWalletSnap= await getDoc(doc(firestore,"wallets",oldTransaction.walletId));

        const orginalWallet = originalWalletSnap.data() as WalletType;

        let newWalletSnap = await getDoc(doc(firestore,"wallets",newWalletId));
        let newWallet = newWalletSnap.data() as WalletType;
        const revertType = oldTransaction.type == "income"?"totalIncome" :"totalExpenses";
        const revertIncomeExpence:number = oldTransaction.type === 'income' ? -Number(oldTransaction.amount) : Number(oldTransaction.amount);
        const revertWalletAmount = Number(orginalWallet.amount) + revertIncomeExpence;
        const revertedIncomeExpense = Number(orginalWallet[revertType]) - Number(oldTransaction.amount);

        if(newType == 'expense'){
            if(oldTransaction.walletId == newWalletId && revertWalletAmount<newAmount){
                return {success:false,msg:"The selected wallet don&apos;t have enough balance"}
            }
        }
        if(newWallet.amount!<newAmount){
            return {
                success:false,
                msg:"The selected wallet don&apos;t have enough balance"
            }
        }

        await createOrUpdateWallet({
            id:oldTransaction.walletId,
            amount:revertWalletAmount,
            [revertType]:revertedIncomeExpense,
        })

        newWalletSnap = await getDoc(doc(firestore,"wallets",newWalletId));
        newWallet = newWalletSnap.data() as WalletType;

        const updateType = newType == 'income' ? 'totalIncome' :"totalExpenses";

        const updatedWalletAmount:number = newType =='income' ? Number(newAmount) :-Number(newAmount);
        const newWalletAmount = Number(newWallet.amount) + updatedWalletAmount;
        const newIncomeExpenceAmount = Number(newWallet[updateType]! + Number(newAmount))

        await createOrUpdateWallet({
            id:newWalletId,
            amount:newAmount,
            [updateType]:newIncomeExpenceAmount
        })
        return {success:true}
    }
    catch(err:any){
        console.log("Error updating transaction")
        return {success: false, msg: err?.message || "Error updating transaction"};
    }
}

export const delectTransaction = async (transactionId:string,walletId:string) =>{
    try {
        const transactionRef = doc(firestore,"transaction",transactionId)
        const transactionSnap =await getDoc(transactionRef);
        if(!transactionSnap.exists()) return {success: false, msg: "Transaction not found"};
        const transaction = transactionSnap.data() as TransactionType;

        const transactionType =  transaction?.type;
        const transactionAmount = transaction?.amount;
        const walletSnap =await getDoc(doc(firestore,"wallet",walletId));
        const wallet = walletSnap.data() as WalletType;

        const updateType =transactionType == 'income' ? "totalIncome" :"totalExpenses";
        const newWalletAmount = wallet?.amount! -(transactionType == 'income' ? transactionAmount : -transactionAmount);
        const newIncomeExpenceAmount = wallet[updateType]! -transactionAmount;

        if(transactionType == 'expense' && newWalletAmount<0){
            return {success:false,msg:"You can not delete this transaction"};
        }
        await createOrUpdateWallet({
            id:walletId,
            amount:newWalletAmount,
            [updateType]:newIncomeExpenceAmount
        });
        await deleteDoc(transactionRef)

        return {success:true}
    }
    catch(err:any){
        console.log("Error deleting transaction")
        return {success: false, msg: err?.message || "Error deleting transaction"};
    }
}

export const weeklyStats =async (uid:string):Promise<ResponseType>=>{
    try {
        const db = firestore;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate()-7);

        const transQuery = query(
            collection(db,'transactions'),
                where("date",">=",Timestamp.fromDate(sevenDaysAgo)),
                where("date","<=",Timestamp.fromDate(today)),
                orderBy("date","desc"),
                where("uid","==",uid)
                )
            const querySnap =await getDocs(transQuery);
        const weeklyData = getLast7Days();
        const transactions:TransactionType[] =[];

        querySnap.forEach(doc=>{
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);
            const transactionDate  = (transaction.date as Timestamp).toDate().toISOString().split("T")[0];
            const dayData =weeklyData.find(day=>day.date == transactionDate);
            if(dayData){
                if(transaction.type == "income"){
                    dayData.income += transaction.amount;
                }else if(transaction.type == "expense") {
                    dayData.expense += transaction.amount;
                }
            }
        });

        const stats = weeklyData.flatMap(day=>[
            {
                value:day.income,
                label:day.day,
                spacing:scale(4),
                labelWidth:scale(30),
                frontColor:colors.primary,
            },
            {value: day.expense,frontColor:colors.rose}
        ]);

        return {success:true,data: {stats,transactions}};
    }
    catch(err:any){
        console.log("Error fetching transaction")
        return {success: false, msg: err?.message || "Error fetching transaction"};
    }
}

export const monthlyStats =async (uid:string):Promise<ResponseType>=>{
    try {
        const db = firestore;
        const today = new Date();
        const twelveMonthAgo = new Date(today);
        twelveMonthAgo.setDate(today.getMonth()-12);

        const transQuery = query(
            collection(db,'transactions'),
                where("date",">=",Timestamp.fromDate(twelveMonthAgo)),
                where("date","<=",Timestamp.fromDate(today)),
                orderBy("date","desc"),
                where("uid","==",uid)
                )
            const querySnap =await getDocs(transQuery);
        const monthlyData = getLast12Months();
        const transactions:TransactionType[]=[];

        querySnap.forEach(doc=>{
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);
            const transactionDate  = (transaction.date as Timestamp).toDate();
            const monthName = transactionDate.toLocaleDateString("default",{
                month:"short"
            })
            const shortYear = transactionDate.getFullYear().toString().slice(-2);
            const montData =monthlyData.find(month=>month.month == `${monthName} ${shortYear}`);
            if(montData){
                if(transaction.type == "income"){
                    montData.income += transaction.amount;
                }else if(transaction.type == "expense") {
                    montData.expense += transaction.amount;
                }
            }
        });

        const stats = monthlyData.flatMap(month=>[
            {
                value:month.income,
                label:month.month,
                spacing:scale(4),
                labelWidth:scale(30),
                frontColor:colors.primary,
            },
            {value: month.expense,frontColor:colors.rose}
        ]);

        return {success:true,data: {stats,transactions}};
    }
    catch(err:any){
        console.log("Error fetching transaction")
        return {success: false, msg: err?.message || "Error fetching transaction"};
    }
}



export const yearlyStats =async (uid:string):Promise<ResponseType>=>{
    try {
        const db = firestore;


        const transQuery = query(
            collection(db,'transactions'),
            orderBy("date","desc"),
            where("uid","==",uid)
        )
        const querySnap =await getDocs(transQuery);
        const transactions:TransactionType[] = [];
        const firstTransaction = querySnap.docs.reduce((early,doc)=>{
            const transactionDate =doc.data().date.toDate();
            return transactionDate <early ? transactionDate :early
        },new Date())

        const firstYear  = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();

        const yearlyData =getYearsRange(firstYear,currentYear);


        querySnap.forEach(doc=>{
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);
            const transactionYear  = (transaction.date as Timestamp).toDate().getFullYear();

            const yearData =yearlyData.find((item:any)=>item.year === transactionYear.toString());
            if(yearData){
                if(transaction.type == "income"){
                    yearData.income += transaction.amount;
                }else if(transaction.type == "expense") {
                    yearData.expense += transaction.amount;
                }
            }
        });

        const stats = yearlyData.flatMap((year:any)=>[
            {
                value:year.income,
                label:year.year,
                spacing:scale(4),
                labelWidth:scale(35),
                frontColor:colors.primary,
            },
            {value: year.expense,frontColor:colors.rose}
        ]);

        return {success:true,data: {stats,transactions}};
    }
    catch(err:any){
        console.log("Error fetching transaction")
        return {success: false, msg: err?.message || "Error fetching transaction"};
    }
}