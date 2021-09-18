import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import { addDoc, collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";

const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    
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
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setSweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
            <input value={sweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
            <input type="submit" value="Sweet" />
        </form>
        <div>
            {sweets.map((sweet) => (
                <div key={sweet.id}>
                    <h4>{sweet.text}</h4>
                </div>
            ))}
        </div>
    </div>
    );
};
export default Home;