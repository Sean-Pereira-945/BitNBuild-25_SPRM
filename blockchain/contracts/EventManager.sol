// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventManager {
    struct Event {
        uint256 id;
        string name;
        address organizer;
        uint256 timestamp;
    }

    mapping(uint256 => Event) public events;
    uint256 public nextEventId;

    event EventCreated(uint256 indexed id, string name, address indexed organizer, uint256 timestamp);

    function createEvent(string memory name) public {
        events[nextEventId] = Event(nextEventId, name, msg.sender, block.timestamp);
        emit EventCreated(nextEventId, name, msg.sender, block.timestamp);
        nextEventId++;
    }
}
