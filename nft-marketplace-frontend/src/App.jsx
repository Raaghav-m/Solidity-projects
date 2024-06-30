import "./App.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SellNft from "./components/SellNft";
import GraphExample from "./components/GraphExample";
import { useMoralis } from "react-moralis";

function App() {
  let { chainId } = useMoralis();
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<SellNft chainId={chainId} />} />
      </Routes>
    </>
  );
}

export default App;
