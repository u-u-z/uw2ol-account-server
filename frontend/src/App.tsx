import MetaMask from "./components/MetaMask";
import { useCallback, useState } from "react";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk/dist/browser/algosdk.min.js";
import { Buffer } from 'buffer';
import { auth, getNonce, login, register } from "./services"

const myAlgoConnect = new MyAlgoConnect();

function App() {
  window.Buffer = Buffer;
  const [algoUserAddresses, setAlgoUserAddresses] = useState<any[]>([]);

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

    alert('We will only initiate signatures, we will not send any transactions.');

    const algodClient = new algosdk.Algodv2("", "https://api.testnet.algoexplorer.io", '');
    const params = await algodClient.getTransactionParams().do();

    // const nonce = await getNonce(algoUserAddresses[index].address, true);
    console.log(algoUserAddresses[index].address);
    const nonce = 222
  
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: algoUserAddresses[index].address,
      to: algoUserAddresses[index].address,
      amount: 0,
      note: new TextEncoder().encode(`I'm signing my one-time nonce: ${nonce}`),
    });

    console.log(`txn`, txn);
    const txnByte = txn.toByte();
    console.log(`txnByte`, txnByte)


    const signedTxn = await myAlgoConnect.signTransaction(txnByte);
    const decodeSignedTxn = algosdk.decodeSignedTransaction(signedTxn.blob);

    console.log(signedTxn, decodeSignedTxn)

    console.log(`verify`, algosdk.verifyBytes(signedTxn.blob, decodeSignedTxn.sig, algoUserAddresses[index].address));


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
