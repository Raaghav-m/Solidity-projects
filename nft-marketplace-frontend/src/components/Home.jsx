import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../../constants/SubgraphQueries";
import NftBox from "./NftBox";

const Home = () => {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  let [uri, setUri] = useState();
  return (
    <>
      <div className="mx-20 my-10">
        {loading || !data.activeItems ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-start">
            {data.activeItems.map((el, index) => {
              return (
                <div className="w-1/4 m-4">
                  <NftBox
                    nftAddress={el.nftAddress}
                    price={el.price}
                    seller={el.seller}
                    tokenId={el.tokenId}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
