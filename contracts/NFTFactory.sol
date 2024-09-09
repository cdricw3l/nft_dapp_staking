// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTAsset.sol";

contract NFTFactory is Ownable {
    mapping(string => address) public nftContracts;
    string[] public nftSymbols;  // Liste des symboles des actifs pour itérer

    event NFTContractCreated(string assetSymbol, address nftContract);

    constructor(address owner) Ownable(owner) {
        // Initialisation si nécessaire
    }

    function createNFTContract(string memory assetSymbol, address oracle, uint256 terme ) public onlyOwner {
        require(nftContracts[assetSymbol] == address(0), "NFT for this asset already exists");

        // Créer une nouvelle instance de NFTAsset avec `name` et `symbol`
        NFTAsset newNFT = new NFTAsset(name, symbol);

        // Enregistrer l'adresse du nouveau contrat NFT
        nftContracts[assetSymbol] = address(newNFT);

        // Ajouter le symbole dans le tableau pour suivre l'ordre de création
        nftSymbols.push(assetSymbol);

        // Transférer la propriété du contrat NFTAsset au créateur (msg.sender)
        newNFT.transferOwnership(msg.sender);

        emit NFTContractCreated(assetSymbol, address(newNFT));
    }

    // Fonction pour récupérer tous les contrats NFT sous forme de liste
    function getAllNFTContracts() public view returns (address[] memory) {
        address[] memory contracts = new address[](nftSymbols.length);
        
        // Boucler sur tous les symboles et récupérer les adresses associées
        for (uint256 i = 0; i < nftSymbols.length; i++) {
            contracts[i] = nftContracts[nftSymbols[i]];
        }

        return contracts;
    }
}
