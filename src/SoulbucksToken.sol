// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract SoulbucksToken is ERC20, ERC20Permit {
    uint256 public constant MAX_SUPPLY = 1_000_000_000e18;
    constructor(string memory _name, string memory _symbol, address _owner)
        ERC20Permit(_name)
        ERC20(_name, _symbol)
    {
        _mint(_owner, MAX_SUPPLY);
    }
}
