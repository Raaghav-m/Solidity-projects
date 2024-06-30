import React, { useState } from "react";
import { Modal, Input, Typography } from "@web3uikit/core";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers } from "ethers";

const UpdateListing = ({
  nftAddress,
  seller,
  price,
  onClose,
  tokenId,
  nftMarketplaceAbi,
  marketplaceAddress,
}) => {
  let { runContractFunction } = useWeb3Contract();
  let [updatePrice, setUpdatePrice] = useState();
  async function updateListing() {
    let updateOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "updatePrice",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: ethers.utils.parseEther(updatePrice || "0"),
      },
    };
    await runContractFunction({
      params: updateOptions,
      onSuccess: () => console.log("success updating"),
      onError: (e) => console.log(e),
    });
  }

  //   const { runContractFunction: cancelListing, onSuccess } = useWeb3Contract({
  //     abi: nftMarketplaceAbi,
  //     contractAddress: marketplaceAddress,
  //     functionName: "cancelListing",
  //     params: {
  //       nftAddress: nftAddress,
  //       tokenId: tokenId,
  //     },
  //   });
  //   console.log(onSuccess);

  async function cancelListing() {
    console.log("canceling");
    let cancelOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "cancelListing",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: cancelOptions,
      onSuccess: () => console.log("success canceling"),
      onError: (e) => console.log(e),
    });
  }

  return (
    <Modal
      cancelText="Cancel Listing"
      onCancel={cancelListing}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: () => {
            console.log(error);
          },
          onSuccess: () => console.log("success"),
        });
      }}
    >
      <Input
        label="Update listing price in ETH"
        name="New listing price"
        type="number"
        onChange={(event) => {
          setUpdatePrice(event.target.value);
        }}
      />
    </Modal>
  );
};

export default UpdateListing;
