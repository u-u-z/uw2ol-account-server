import MetaMask from "./components/MetaMask";
import { useCallback, useState } from "react";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk/dist/browser/algosdk.min.js";
import { Buffer } from 'buffer';

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

    const algodClient = new algosdk.Algodv2("", "https://api.testnet.algoexplorer.io", '');
    const params = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: algoUserAddresses[index].address,
      to: algoUserAddresses[index].address,
      amount: 7788,
      note: new TextEncoder().encode("Hello, world!"),
    });
    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log(signedTxn);
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
