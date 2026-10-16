// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
contract NeonGarageParts is ERC1155,ERC2981,AccessControl {bytes32 public constant MINTER_ROLE=keccak256("MINTER_ROLE");constructor(address admin,string memory baseUri,address royaltyReceiver,uint96 fee) ERC1155(baseUri){_grantRole(DEFAULT_ADMIN_ROLE,admin);_grantRole(MINTER_ROLE,admin);_setDefaultRoyalty(royaltyReceiver,fee);}function mint(address to,uint256 id,uint256 amount,bytes calldata data) external onlyRole(MINTER_ROLE){_mint(to,id,amount,data);}function supportsInterface(bytes4 i) public view override(ERC1155,ERC2981,AccessControl) returns(bool){return super.supportsInterface(i);}}
