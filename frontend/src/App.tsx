import MetaMask from "./components/MetaMask";
import { useCallback, useState } from "react";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk";


function App() {

  const [algoUserAddresses, setAlgoUserAddresses] = useState<any[]>([]);

  const getAlgoUserAddress = useCallback(async () => {
    const myAlgoConnect = new MyAlgoConnect();
    const accountsSharedByUser = await myAlgoConnect.connect()
    console.log(accountsSharedByUser);
    setAlgoUserAddresses(accountsSharedByUser);
  }, [algoUserAddresses])

  return <>
    <div>
      <MetaMask />
    </div>
    <div>
      {algoUserAddresses.length > 0 ? algoUserAddresses.map(i => {
        return <div>Address:{i.address}</div>
      }) : <button onClick={() => { getAlgoUserAddress() }}>Login with MyAlgo</button>}



    </div>
  </>
}

export default App;
