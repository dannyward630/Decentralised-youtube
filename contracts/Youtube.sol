// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract Youtube is ERC721URIStorage {
    struct Video {
        uint256 id;
        string hash;
        string title;
        string description;
        string location;
        string category;
        string thumbnailHash;
        string date;
        address author;
        uint256 createdAt;
    }

    uint256 private videoCount;
    mapping(uint256 => Video) private videos;

    event VideoUploaded(
        uint256 id,
        string hash,
        string title,
        string description,
        string location,
        string category,
        string thumbnailHash,
        string date,
        address author,
        uint256 timestamp
    );

    constructor() ERC721('Decentralised YouTube Video', 'DYTV') {}

    function uploadVideo(
        string memory _videoHash,
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _category,
        string memory _thumbnailHash,
        string memory _date
    ) public returns (uint256) {
        require(bytes(_videoHash).length > 0, 'Video hash is required');
        require(bytes(_title).length > 0, 'Title is required');

        videoCount += 1;
        uint256 videoId = videoCount;

        videos[videoId] = Video({
            id: videoId,
            hash: _videoHash,
            title: _title,
            description: _description,
            location: _location,
            category: _category,
            thumbnailHash: _thumbnailHash,
            date: _date,
            author: msg.sender,
            createdAt: block.timestamp
        });

        _safeMint(msg.sender, videoId);
        _setTokenURI(videoId, string.concat('ipfs://', _videoHash));

        emit VideoUploaded(
            videoId,
            _videoHash,
            _title,
            _description,
            _location,
            _category,
            _thumbnailHash,
            _date,
            msg.sender,
            block.timestamp
        );

        return videoId;
    }

    function getVideoCount() public view returns (uint256) {
        return videoCount;
    }

    function getVideo(uint256 _id) public view returns (Video memory) {
        require(_id > 0 && _id <= videoCount, 'Video does not exist');
        return videos[_id];
    }

    function getAllVideos() public view returns (Video[] memory) {
        Video[] memory allVideos = new Video[](videoCount);

        for (uint256 i = 1; i <= videoCount; i += 1) {
            allVideos[i - 1] = videos[i];
        }

        return allVideos;
    }
}
