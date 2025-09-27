// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POAP is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public eventIdOfToken;
    mapping(uint256 => string) public eventNames;
    mapping(uint256 => address) public eventOrganizers;
    mapping(uint256 => string) public eventURIs;
    uint256 public nextEventId;

    event EventCreated(uint256 indexed eventId, string name, address indexed organizer, string uri);
    event POAPMinted(uint256 indexed eventId, uint256 indexed tokenId, address indexed attendee);

    constructor() ERC721("Proof of Attendance", "POAP") {}

    function createEvent(string memory name, string memory uri) public returns (uint256) {
        uint256 eventId = nextEventId++;
        eventNames[eventId] = name;
        eventOrganizers[eventId] = msg.sender;
        eventURIs[eventId] = uri;
        emit EventCreated(eventId, name, msg.sender, uri);
        return eventId;
    }

    function mintPOAP(uint256 eventId, address attendee) public onlyOwner returns (uint256) {
        require(bytes(eventNames[eventId]).length > 0, "Event does not exist");
        uint256 tokenId = nextTokenId++;
        _mint(attendee, tokenId);
        _setTokenURI(tokenId, eventURIs[eventId]);
        eventIdOfToken[tokenId] = eventId;
        emit POAPMinted(eventId, tokenId, attendee);
        return tokenId;
    }
}
