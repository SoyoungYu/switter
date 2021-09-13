import React, { useState } from "react";
import { auth } from "fBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            if (newAccount) {
                const data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                const data = await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "이미 회원이시라면" : "회원가입하기"}</span>
            <div>
                <button>Continue with Google</button>
            </div>
        </div>
    )
};
export default Auth;