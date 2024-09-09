import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";

import hre from "hardhat";
import { getAddress } from "viem";

describe("NFTFactory Contract", function () {
  // Fixture pour déployer le contrat NFTFactory
  async function deployNFTFactoryFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const nftFactory = await hre.viem.deployContract("NFTFactory", [], {
      client: { wallet: owner },
    });

    const publicClient = await hre.viem.getPublicClient();

    return { nftFactory, owner, otherAccount, publicClient };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { nftFactory, owner } = await loadFixture(deployNFTFactoryFixture);

      expect(await nftFactory.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
    });
  });

  describe("Creating NFTs", function () {
    it("Should create a new NFT contract and emit an event", async function () {
      const { nftFactory, owner, publicClient } = await loadFixture(
        deployNFTFactoryFixture
      );

      const assetSymbol = "BTC";
      const name = "Bitcoin NFT";
      const symbol = "BTCNFT";

      // Appeler la fonction createNFTContract
      const hash = await nftFactory.write.createNFTContract(
        [assetSymbol,
        name,
        symbol]
      );
      await publicClient.waitForTransactionReceipt({ hash });

      // Vérifier que le NFT a bien été créé
      const nftAddress = await nftFactory.read.nftContracts([assetSymbol]);
      expect(nftAddress).to.not.equal("0x0000000000000000000000000000000000000000");

      // Vérifier que l'événement a bien été émis
      const creationEvents = await nftFactory.getEvents.NFTContractCreated();
      console.log(creationEvents);
      expect(creationEvents).to.have.lengthOf(1);
      //expect(creationEvents[0].args.[assetSymbol]).to.equal(assetSymbol);
      //expect(creationEvents[0].args.[assetSymbol]).to.equal(nftAddress);
    });

    it("Should revert if called by a non-owner", async function () {
      const { nftFactory, otherAccount } = await loadFixture(
        deployNFTFactoryFixture
      );
    
      const assetSymbol = "ETH";
      const name = "Ethereum NFT";
      const symbol = "ETHNFT";
    
      // Essayer de créer un NFT avec un autre compte (non propriétaire)
      const nftFactoryAsOtherAccount = await hre.viem.getContractAt(
        "NFTFactory",
        nftFactory.address,
        { client: { wallet: otherAccount } }
      );
    
      try {
        await nftFactoryAsOtherAccount.write.createNFTContract([
          assetSymbol,
          name,
          symbol,
        ]);
        // Si la transaction passe, le test échoue
        await expect(
          nftFactoryAsOtherAccount.write.createNFTContract([assetSymbol, name, symbol])
        )
        expect.fail("Transaction should have been reverted by non-owner");

      } catch (error: any) {
        // Vérifier si le message d'erreur contient l'erreur attendue
        console.log(error.details);
        expect(error.details).to.include('OwnableUnauthorizedAccount');

      }
    });
    

  });

  describe("Ownership", function () {
    it("Should revert if called by a non-owner", async function () {
      const { nftFactory, otherAccount } = await loadFixture(
        deployNFTFactoryFixture
      );

      const assetSymbol = "ETH";
      const name = "Ethereum NFT";
      const symbol = "ETHNFT";

      // Essayer de créer un NFT avec un autre compte (non propriétaire)
      const nftFactoryAsOtherAccount = await hre.viem.getContractAt(
        "NFTFactory",
        nftFactory.address,
        { client: { wallet: otherAccount } }
      );

      try {
        await nftFactoryAsOtherAccount.write.createNFTContract([
          assetSymbol,
          name,
          symbol,
        ]);
        // Si la transaction passe, le test échoue
        await expect(
          nftFactoryAsOtherAccount.write.createNFTContract([assetSymbol, name, symbol])
        )
        expect.fail("Transaction should have been reverted by non-owner");

      } catch (error: any) {
        // Vérifier si le message d'erreur contient l'erreur attendue
        console.log(error.details);
        expect(error.details).to.include('OwnableUnauthorizedAccount');

      }
    });
  });
});
