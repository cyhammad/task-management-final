import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth, addUser, db } from '../firebase';
import { collection, doc, setDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    console.log(user);
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                })
            }
            else {
                setUser(null)
            }
            setLoading(false)
        })
        return ()=> unsubscribe()
    }, [])

    const signup = (name, email, password, phoneNumber) => {
        return createUserWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
            const user = userCredentials.user;
            updateProfile(user, {
                displayName: name,
            }).then(()=>{
                console.log("Profile Updated!!")
                setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    phoneNumber: phoneNumber
                })
                console.log(user);
            })
            
            
        })
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth);
    }

    return (
        <AuthContext.Provider value={{user, login, signup, logout}}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}