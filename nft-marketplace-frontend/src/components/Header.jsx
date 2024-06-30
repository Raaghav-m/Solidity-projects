import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@web3uikit/web3";

const Header = () => {
  return (
    <nav className="my-10 flex flex-row justify-between items-center">
      <h1 className="mx-8  text-3xl">Nft Marketplace</h1>
      <div className="flex flex-row">
        <Link
          className="mx-8 my-2 hover:underline hover:underline-offset-8 hover:decoration-solid"
          to="/"
        >
          Home
        </Link>
        <Link
          className="mx-8 my-2 hover:underline hover:underline-offset-8 hover:decoration-solid"
          to="/sell"
        >
          Sell Nfts
        </Link>
        <ConnectButton className="mx-8" />
      </div>
    </nav>
  );
};

export default Header;
