import MetaMask from "./components/MetaMask";
import { useCallback, useState } from "react";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk";

const myAlgoConnect = new MyAlgoConnect();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function App() {

  const [algoUserAddresses, setAlgoUserAddresses] = useState<any[]>([]);

  const getAlgoUserAddress = useCallback(async () => {

    const accountsSharedByUser = await myAlgoConnect.connect()
    console.log(accountsSharedByUser);
    setAlgoUserAddresses(accountsSharedByUser);
  }, [algoUserAddresses])

  const signMessage = useCallback(async () => {
    const encodeMessage = encoder.encode('fff');
    const msg = await myAlgoConnect.signLogicSig(encodeMessage, algoUserAddresses[0].address);
    console.log(msg);
    console.log(decoder.decode(msg));
  }, [algoUserAddresses]);

  return <>
    <div>
      <MetaMask />
    </div>
    <div>
      {algoUserAddresses.length > 0 ? algoUserAddresses.map(i => {
        return <div>Address:{i.address} <button onClick={() => { signMessage() }}>sign</button></div>
      }) : <button onClick={() => { getAlgoUserAddress() }}>Login with MyAlgo</button>}



    </div>
  </>
}

export default App;
