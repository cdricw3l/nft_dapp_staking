// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAsset is  ERC721 ,Ownable {
    uint256 public tokenCounter;
    address public staking_manager;
    

    event deployer_contract();
    constructor(string memory name, string memory symbol,address oracle) 
    ERC721(name, symbol)
    Ownable(staking_manager)
  
     {
        tokenCounter = 0;
    }

    function mintNFT(address to) public  {
        _safeMint(to, tokenCounter);
        tokenCounter += 1;
        to_stacking(msg.sender, staking_manager);
        
    }

    function to_stacking(address sender, address dappStaking) private  {
        payable(sender).transfer(address(this).balance);  // Retirer les fonds pour le propriétaire ou l'administrateur
    }
}
