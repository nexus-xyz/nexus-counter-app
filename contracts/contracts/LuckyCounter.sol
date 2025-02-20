// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LuckyCounter - Count & Win NFTs with a Testnet pot Twist!
 * @notice Each count costs 0.01 NEX and adds to the growing testnet pot.
 * @notice Get lucky? Win an exclusive NFT AND claim the entire testnet pot!
 * @dev The more people play, the bigger the testnet pot gets.
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LuckyCounter is ERC721 {
    using Counters for Counters.Counter;
    using Strings for uint256;

    address public owner;
    uint256 public rewardChance;
    uint256 public chainId;
    uint256 public constant TICKET_PRICE = 0.01 ether;

    event CountIncremented(uint256 newCount, address user);
    event WonNFT(address indexed winner, uint256 tokenId);
    event WonJackpot(address indexed winner, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Received(address indexed sender, uint amount);
    event Withdrawal(uint amount, uint when);
    event RewardChanceUpdated(uint256 newChance);

    Counters.Counter private _tokenIdCounter;
    uint256 private count;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _rewardChance,
        uint256 _chainId
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
        rewardChance = 3;
        chainId = _chainId;
    }

    function increment() public payable {
        require(block.chainid == chainId, "Wrong chain");
        require(msg.value == TICKET_PRICE, "Incorrect payment amount");

        count += 1;
        emit CountIncremented(count, msg.sender);

        uint256 randomValue = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    msg.sender
                )
            )
        ) % 100;

        if (randomValue < rewardChance) {
            uint256 jackpot = address(this).balance - msg.value;
            
            _mintNFT(msg.sender);
            
            if (jackpot > 0) {
                (bool success, ) = msg.sender.call{value: jackpot}("");
                require(success, "Failed to send jackpot");
                emit WonJackpot(msg.sender, jackpot);
            }
        }
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function getJackpotBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setRewardChance(uint256 newChance) external onlyOwner {
        require(newChance <= 100, "Invalid chance");
        require(newChance > 0, "Chance must be greater than 0");
        rewardChance = newChance;
        emit RewardChanceUpdated(newChance);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function _mintNFT(address to) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        emit WonNFT(to, tokenId);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        payable(owner).transfer(amount);
        emit Withdrawal(amount, block.timestamp);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">',
            '<rect width="100%" height="100%" fill="#2A0134"/>',
            '<text x="50%" y="40%" font-family="Arial" font-size="24" fill="gold" text-anchor="middle">',
            'Lucky Counter #',
            tokenId.toString(),
            '</text>',
            '<text x="50%" y="60%" font-family="Arial" font-size="16" fill="gold" text-anchor="middle">',
            'NEXUS Testnet II',
            '</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "Lucky Counter #',
            tokenId.toString(),
            '", "description": "A lucky winner of the LuckyCounter game!", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '"}'
        ))));

        return string(abi.encodePacked('data:application/json;base64,', json));
    }
}
