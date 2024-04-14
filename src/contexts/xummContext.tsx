import React, { createContext, useContext, useState, useEffect } from 'react';
import { Xumm } from 'xumm';

const API_KEY = "XUMM_API_KEY";
const API_SECRET = "XUMM_API_SECRET";

console.log("api key:", process.env);

interface xummContextType {
    xummClient: Xumm | undefined;
    userWallet: string | undefined;
    connectWallet: () => Promise<boolean | undefined>;
    disconnectWallet: () => Promise<null>;
}

const XUMMContext = createContext<xummContextType | undefined>(undefined);

export const useXUMM = () => {
    const context = useContext(XUMMContext);
    if (!context) {
        throw new Error('useXumm must be used within a Xumm Provider');
    }
    return context;
};


export const XUMMProvider: ({ children }: any) => React.JSX.Element = ({ children }: any) => {
    const [xummClient, setXummClient] = useState<Xumm | undefined>(undefined);
    const [userWallet, setUserWallet] = useState<string | undefined>(undefined);

    const connectWallet = async () => {
        try {
            const auth = await xummClient?.authorize();
            const userWalletAddress = await xummClient?.user?.account;
            userWalletAddress !== undefined && setUserWallet(userWalletAddress);
            return (userWalletAddress !== undefined ? true : false);
        } catch (error) {
            console.log("error into connect wallet:", error);
            return (undefined);
        }
    }

    const disconnectWallet = async () => {
        try {
            const disconnection = await xummClient?.logout();
            console.log("disconnect from userWallet:", disconnection);
            return (null);
        } catch (error) {
            console.log("error from disconnectWallet:", error);
            return (null);
        }
    }

    useEffect(() => {
        if (xummClient !== undefined && xummClient?.user) {
            console.log("wallet connected:", xummClient?.user);
        } else {
            console.log("wallet not connected");
        }
        return () => {
            if (xummClient) {
                disconnectWallet();
                console.log("client Disconnected");
            } else {
                console.log("xummClient not found");
            }
        };
    }, [xummClient]);

    useEffect(() => {
        const initializeXUMMClient = async () => {
            console.log("API KEY:", API_KEY);
            const client = new Xumm(API_KEY, API_SECRET);
            client && setXummClient(client);
            console.log("client initalize");
        }

        initializeXUMMClient();
        console.log("env:", process.env);
    }, []);

    return (
        <XUMMContext.Provider value={{ xummClient, connectWallet, disconnectWallet, userWallet }}>
            {children}
        </XUMMContext.Provider>
    );
};