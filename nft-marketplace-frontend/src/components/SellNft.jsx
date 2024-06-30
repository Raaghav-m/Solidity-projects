import React, { useState } from "react";
import { Form } from "@web3uikit/core";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftAbi from "../../constants/BasicNft.json";
import NftMarketplaceAbi from "../../constants/NftMarketplace.json";
import networkMapping from "../../constants/NetworkMapping.json";
import { ethers } from "ethers";

const SellNft = ({ chainId }) => {
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  console.log(chainId, chainString, networkMapping[chainString]);
  const marketplaceAddress = "0x12Ab5A925Ec5Dac5004F07A20ca7b40c0aafb011";
  const { runContractFunction } = useWeb3Contract();
  async function listNft(data) {
    console.log(data);
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    let approveNft = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: approveNft,
      onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
      onError: (error) => {
        console.log(error);
      },
    });
  }
  async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
    console.log("Ok! Now time to list");
    await tx.wait();
    const listOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (error) => console.log(error),
    });
  }
  return (
    <>
      <div className="flex flex-col mx-10 my-20">
        <Form
          onSubmit={listNft}
          data={[
            {
              name: "NFT Address",
              type: "text",
              inputWidth: "50%",
              value: "",
              key: "nftAddress",
            },
            {
              name: "Token ID",
              type: "number",
              value: "",
              inputWidth: "50%",
              key: "tokenId",
            },
            {
              name: "Price (in ETH)",
              type: "number",
              value: "",
              inputWidth: "50%",
              key: "price",
            },
          ]}
          title="Sell your NFT!"
          id="Main Form"
        />
      </div>
    </>
  );
};

export default SellNft;
