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
});