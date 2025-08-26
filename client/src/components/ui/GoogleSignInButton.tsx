import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const GoogleSignInButton = () => {
    const { loginWithGoogle } = useAuth(); 

    return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => { // CHANGED: parameter name
                try {
                    // CHANGED: sending the credential property
                    const res = await axios.post('http://localhost:5000/api/auth/google', {
                        token: credentialResponse.credential, 
                    });
                    
                    const { token, user } = res.data;
                    loginWithGoogle(token, user); 
                    toast.success('Signed in with Google!');
                } catch (error) {
                    console.error('Google sign-in failed:', error);
                    toast.error('Google sign-in failed.');
                }
            }}
            onError={() => {
                toast.error('Google sign-in failed.');
            }}
        />
    );
};