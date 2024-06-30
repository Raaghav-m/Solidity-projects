import React, { useEffect, useState } from "react";
import { Card } from "@web3uikit/core";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NftMarketplaceAbi from "../../constants/NftMarketplace.json";
import networkMapping from "../../constants/NetworkMapping.json";
import nftAbi from "../../constants/BasicNft.json";
import UpdateListing from "./UpdateListing";
import { ethers } from "ethers";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

const NftBox = ({ nftAddress, price, seller, tokenId }) => {
  let { isWeb3Enabled, account, chainId } = useMoralis();
  let chainString = chainId ? parseInt(chainId).toString() : null;
  console.log(chainId);
  let marketplaceAddress = networkMapping[chainString].NftMarketplace[0];

  let [imageUri, setImageUri] = useState();
  let [name, setName] = useState();
  let [description, setDescription] = useState();
  let [attributes, setAttributes] = useState();
  let [isModal, setIsModal] = useState(false);

  const { runContractFunction: getUri } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);

  async function updateUI() {
    const tokenURI = await getUri();
    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");

      setImageUri(imageURIURL);
      setName(tokenURIResponse.name);
      setDescription(tokenURIResponse.description);
      setAttributes(tokenURIResponse.attributes);
    }
  }
  let { runContractFunction: buyItem } = useWeb3Contract({
    abi: NftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "sellItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
    gasLimit: ethers.utils.hexlify(100000), // manually set gas limit (adjust as needed)
  });

  function handleClick() {
    account == seller
      ? setIsModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => console.log("success"),
        });
  }
  function handleClose() {
    setIsModal(false);
  }

  useEffect(() => {
    updateUI();
  }, []);
  return (
    <>
      <div>
        {isModal && (
          <UpdateListing
            nftAddress={nftAddress}
            seller={seller}
            price={price}
            tokenId={tokenId}
            onClose={handleClose}
            nftMarketplaceAbi={NftMarketplaceAbi}
            marketplaceAddress={marketplaceAddress}
          />
        )}
      </div>
      <Card title={name} description={description} onClick={handleClick}>
        <div className="p-2">
          <div className="flex flex-col items-end gap-2">
            <div>#{tokenId}</div>
            <div className="italic text-sm">
              Owned by {formattedSellerAddress}
            </div>
            <img src={imageUri} />
            <div className="font-bold">
              {ethers.utils.formatUnits(price, "ether")} ETH
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default NftBox;
