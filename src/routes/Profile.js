import { auth, dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        auth.signOut();
        history.push("/");
    };
    /*const getMySweets = async() => {
        const q = query(
            collection(dbService, "sweets"),
            where("creatorId", "==", userObj.uid)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    };
    useEffect(() => {
        getMySweets();
    }, [])*/
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, { displayName: newDisplayName });
        }
    }
    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} />
            <input type="submit" value="Update Profile" />
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
export default Profile;