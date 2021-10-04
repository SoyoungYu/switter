import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fBase";
import { addDoc, collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import Sweet from "../components/Sweet";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, uploadBytes, uploadString, ref } from "firebase/storage";


const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    const [attachment, setAttachment] = useState();
    
    useEffect(() => {
        const q = query(collection(dbService, 'sweets'));
        onSnapshot(q, snapshot => {
            const sweetArr = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSweets(sweetArr);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        try {
            if (attachment !== "") {
                const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
                const uploadFile = await uploadString(attachmentRef, attachment, "data_url");
                console.log(uploadFile);
                attachmentUrl = await getDownloadURL(uploadFile.ref);
            }
        } catch (e) {
            console.log("Error: " + e);
        }
        
        try {
            const docRef = await addDoc(collection(dbService, "sweets"), {
                text: sweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.log("Error adding document: ", error);
        }

        setSweet("");
        setAttachment("");
    };
    /*const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const docRef = await addDoc(collection(dbService, "sweets"), {
                text: sweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.log("Error adding document: ", error);
        }

        setSweet("");
    }; */
    /*const onSubmit = async (event) => {
        event.preventDefault();

        const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(attachmentRef, attachment, "data_url");
        const attachmentUrl = await getDownloadURL(response.ref);
        const sweetObj = {
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }

        try {
            const docRef = await addDoc(collection(dbService, "sweets"), {sweetObj});

            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.log("Error adding document: ", error);
        }

        setSweet("");
        setAttachment("");
    };*/

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setSweet(value);
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: { result }} = finishedEvent;
            setAttachment(result)
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null)
    return (
        <div>
            <form onSubmit={onSubmit}>
            <input value={sweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Sweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
        <div>
            {sweets.map((sweet) => (
                <Sweet key={sweet.id} sweetObj={sweet} isOwner={sweet.creatorId === userObj.uid} />
            ))}
        </div>
    </div>
    );
};
export default Home;