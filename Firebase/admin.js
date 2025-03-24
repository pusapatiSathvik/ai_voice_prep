import { auth } from 'firebase-admin';
import { initializeApp,getApps, cert } from 'firebase-admin/app';

const initFirebaseAdmin = ()=>{
    const apps = getApps();

    if(!apps.length){

        initializeApp({
            credential : cert({
                projectId:  process.env.FireBase-project_id,
                clientEmail: process.env.FireBase-client_email,
                privateKey : process.env.FireBase-private_key?.replace(/\\n/g,"\n")
            })
        })
    }

    return{
        auth : getAuth(),
        db : getFirestore()
    }
}

export const {auth,db} = initFirebaseAdmin();