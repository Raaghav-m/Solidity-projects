import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  NftMarket,
  ItemBought as ItemBoughtEvent,
  ItemDeleted as ItemCanceledEvent,
  PriceUpdated as PriceUpdatedEvent,
  nftAdded as ItemListedEvent,
} from "../generated/NftMarket/NftMarket";
import {
  nftAdded,
  ActiveItem,
  ItemBought,
  ItemCanceled,
} from "../generated/schema";

export function handlenftAdded(event: ItemListedEvent): void {
  let nftListed = nftAdded.load(
    generatedId(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    generatedId(event.params.tokenId, event.params.nftAddress)
  );

  if (!nftListed) {
    nftListed = new nftAdded(
      generatedId(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      generatedId(event.params.tokenId, event.params.nftAddress)
    );
  }

  nftListed.seller = event.params.sender;
  activeItem.seller = event.params.sender;

  nftListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  nftListed.price = event.params.price;
  activeItem.price = event.params.price;

  nftListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  nftListed.save();
  activeItem.save();
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    generatedId(event.params.price, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    generatedId(event.params.price, event.params.nftAddress)
  );

  if (!itemBought) {
    itemBought = new ItemBought(
      generatedId(event.params.price, event.params.nftAddress)
    );
  }
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.price;
  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemDeleted(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    generatedId(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    generatedId(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      generatedId(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemCanceled.seller = event.params.sender;
  itemCanceled.tokenId = event.params.tokenId;
  itemCanceled.nftAddress = event.params.nftAddress;

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );
  itemCanceled.save();
  activeItem!.save();
}

export function handlePriceUpdated(event: PriceUpdatedEvent): void {
  let nftListed = nftAdded.load(
    generatedId(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    generatedId(event.params.tokenId, event.params.nftAddress)
  );

  if (nftListed) {
    nftListed.nftAddress = event.params.nftAddress;

    nftListed.price = event.params.price;

    nftListed.tokenId = event.params.tokenId;
  }
  if (activeItem) {
    activeItem.price = event.params.price;
    activeItem.buyer = Address.fromString(
      "0x0000000000000000000000000000000000000000"
    );
  }

  nftListed!.save();
  activeItem!.save();
}

function generatedId(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
