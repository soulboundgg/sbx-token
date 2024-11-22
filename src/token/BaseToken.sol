// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Nonces} from "openzeppelin-contracts/contracts/utils/Nonces.sol";

contract BaseToken is ERC20, ERC20Permit {
    uint256 public constant MAX_SUPPLY = 10_000_000_000e18;

    constructor(string memory _name, string memory _symbol) ERC20Permit(_name) ERC20(_name, _symbol) {}

    function _maxSupply() internal pure returns (uint256) {
        return MAX_SUPPLY;
    }

    function nonces(address _owner) public view override(ERC20Permit) returns (uint256) {
        return Nonces.nonces(_owner);
    }

    function _update(address _from, address _to, uint256 _value) internal virtual override(ERC20) {
        return ERC20._update(_from, _to, _value);
    }
}
