// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFTFactory.sol";

contract DAOGovernance is Ownable {
    IERC20 public governanceToken;
    NFTFactory public nftFactory;
    
    struct Proposal {
        address oracle;
        string  symbole;
        uint256 terme;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;
    uint256 public proposalPrice;
    address public proposer;

    event ProposalCreated(uint256 proposalId, string assetSymbol, uint256 term, address proposer);
    event Voted(uint256 proposalId, bool support, address voter);
    event ProposalExecuted(uint256 proposalId);

    constructor(address _governanceToken, address _nftFactory)Ownable(msg.sender) {
        governanceToken = IERC20(_governanceToken);
        nftFactory = NFTFactory(_nftFactory);
    }

    // Créer une nouvelle proposition pour un NFT
    function createProposal(address token_to_list, string memory assetSymbol, uint256 _term) public payable {
        require(msg.value >= proposalPrice, "Insufficient funds to create proposal");  // Vérifier si le montant envoyé est suffisant
        proposalCount++;
        proposer = msg.sender;
        proposals[proposalCount] = Proposal(token_to_list, assetSymbol,_term,proposer, 0, 0, false);
        emit ProposalCreated(proposalCount, assetSymbol,_term,proposer);
    }

    function whiwdraw() public onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    // Voter sur une proposition
    function vote(uint256 proposalId, bool support) public {
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(proposals[proposalId].executed == false, "Already executed");

        uint256 votingPower = governanceToken.balanceOf(msg.sender);
        require(votingPower > 0 , "incufisante ballance");
        if (support) {
            proposals[proposalId].votesFor += votingPower;
        } else {
            proposals[proposalId].votesAgainst += votingPower;
        }

        hasVoted[proposalId][msg.sender] = true;
        emit Voted(proposalId, support, msg.sender);
    }

    // Exécuter une proposition
    function executeProposal(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.executed == false, "Already executed");
        if (proposal.votesFor > proposal.votesAgainst) {
            return_proposal(proposal.proposer);
        }else {
            nftFactory.createNFTContract(proposal.symbole, proposal.oracle, proposal.terme);

        } 
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function return_proposal(address sender) private {
        payable(msg.sender).transfer(address(this).balance);  // Retirer les fonds pour le propriétaire ou l'administrateur
    }
}
