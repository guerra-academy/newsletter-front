import React from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

const LoginBox: React.FC = () => {
    const { signIn } = useAuthContext();

    const boxStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        outline: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.2s',
    };

    return (
        <div style={boxStyle}>
            <h2>Welcome to Newsletter Admin</h2>
            <p>Please, log in with your Asgardeo account to access the admin area.</p>
            <button style={buttonStyle} onClick={() => signIn()}>
                Login with Asgardeo
            </button>
        </div>
    );
};

export default LoginBox;
