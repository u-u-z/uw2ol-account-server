import MetaMask from "./components/MetaMask";
import { useCallback, useState } from "react";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk/dist/browser/algosdk.min.js";
import { Buffer } from 'buffer';
import * as tweetnacl from "tweetnacl";
import { getNonce, algoAuth } from "./services";

const myAlgoConnect = new MyAlgoConnect();
let accessToken: string | null = null;

enum State {
  Login,
  RegisterOrConfirm,
  Success,
}

function App() {
  window.Buffer = Buffer;
  const [algoUserAddresses, setAlgoUserAddresses] = useState<any[]>([]);
  const [state, setState] = useState(State.Login);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");

  const getAlgoUserAddress = useCallback(async () => {
    const accountsSharedByUser = await myAlgoConnect.connect()
    console.log(accountsSharedByUser);
    setAlgoUserAddresses(accountsSharedByUser);
  }, [algoUserAddresses])

  const signMessage = useCallback(async (index: number) => {
    const session = new URLSearchParams(window.location.search).get("session");

    if (!session) {
      window.alert("Missing session");
      return;
    }
    
    const algodClient = new algosdk.Algodv2("", "https://api.testnet.algoexplorer.io", '');
    const params = await algodClient.getTransactionParams().do();

    const nonce = await getNonce(algoUserAddresses[index].address, true);
    console.log(algoUserAddresses[index].address);

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: algoUserAddresses[index].address,
      to: algoUserAddresses[index].address,
      amount: 1,
      note: new TextEncoder().encode(`I'm signing my one-time nonce: ${nonce}`),
    });
    // TODO NEED RESOLVE 

    const txnByte = txn.toByte();

    console.log(txnByte);

    const signedTxn = await myAlgoConnect.signTransaction(txnByte);

    const signature = algosdk.decodeObj(signedTxn.blob).sig;
    const message = new Uint8Array(txn.bytesToSign());
    const publickey = algosdk.decodeAddress(algoUserAddresses[index].address).publicKey;

    const signatureVerified = tweetnacl.sign.detached.verify(message, signature, publickey);

    if (signatureVerified) {
      const base64VerifyData = {
        signature: Buffer.from(signature).toString('base64'),
        message: Buffer.from(message).toString('base64'),
        publickey: Buffer.from(publickey).toString('base64'),
      };

      const authResponse = await algoAuth(base64VerifyData.publickey, base64VerifyData.signature, session, base64VerifyData.message);
      accessToken = authResponse.accessToken;
      debugger
      setName(authResponse.name ?? "");
      setState(State.RegisterOrConfirm);

    } else {
      throw new Error('Signature verification failed');
    }

  }, [algoUserAddresses]);

  return <>
    <div>
      <MetaMask />
    </div>
    <div>
      {algoUserAddresses.length > 0 ? algoUserAddresses.map((i, key) => {
        return <div key={key}>Address:{i.address} <button onClick={() => { signMessage(key) }}>sign</button></div>
      }) : <button onClick={() => { getAlgoUserAddress() }}>Login with MyAlgo</button>}
    </div>
  </>
}

export default App;
