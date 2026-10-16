// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
contract NeonGarageCars is ERC721, ERC2981, AccessControl {
 bytes32 public constant MINTER_ROLE=keccak256("MINTER_ROLE"); uint256 public nextTokenId=1; mapping(uint256=>string) private _uris;
 constructor(address admin,address royaltyReceiver,uint96 royaltyFee) ERC721("Neon Garage Cars","NGCAR"){_grantRole(DEFAULT_ADMIN_ROLE,admin);_grantRole(MINTER_ROLE,admin);_setDefaultRoyalty(royaltyReceiver,royaltyFee);}
 function mint(address to,string calldata uri) external onlyRole(MINTER_ROLE) returns(uint256 id){id=nextTokenId++;_safeMint(to,id);_uris[id]=uri;}
 function tokenURI(uint256 id) public view override returns(string memory){_requireOwned(id);return _uris[id];}
 function supportsInterface(bytes4 i) public view override(ERC721,ERC2981,AccessControl) returns(bool){return super.supportsInterface(i);}
}
