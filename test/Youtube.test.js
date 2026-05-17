const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Youtube', function () {
  async function deployYoutube() {
    const [owner, creator, viewer] = await ethers.getSigners();
    const Youtube = await ethers.getContractFactory('Youtube');
    const youtube = await Youtube.deploy();
    await youtube.deployed();

    return { youtube, owner, creator, viewer };
  }

  it('allows any connected wallet to upload and own a video NFT', async function () {
    const { youtube, creator } = await deployYoutube();

    const tx = await youtube
      .connect(creator)
      .uploadVideo(
        'QmVideoHash',
        'Creator Upload',
        'A decentralized upload',
        'Earth',
        'Education',
        'QmThumbHash',
        '2026-05-16',
      );
    const receipt = await tx.wait();
    const event = receipt.events.find((item) => item.event === 'VideoUploaded');
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    expect(event.args.id.toNumber()).to.equal(1);
    expect(event.args.hash).to.equal('QmVideoHash');
    expect(event.args.title).to.equal('Creator Upload');
    expect(event.args.description).to.equal('A decentralized upload');
    expect(event.args.location).to.equal('Earth');
    expect(event.args.category).to.equal('Education');
    expect(event.args.thumbnailHash).to.equal('QmThumbHash');
    expect(event.args.date).to.equal('2026-05-16');
    expect(event.args.author).to.equal(creator.address);
    expect(event.args.timestamp.toNumber()).to.equal(block.timestamp);

    expect(await youtube.ownerOf(1)).to.equal(creator.address);

    const video = await youtube.getVideo(1);
    expect(video.author).to.equal(creator.address);
    expect(video.hash).to.equal('QmVideoHash');
    expect(video.title).to.equal('Creator Upload');
    expect(await youtube.tokenURI(1)).to.equal('ipfs://QmVideoHash');
  });

  it('does not restrict uploads to the deployer', async function () {
    const { youtube, owner, viewer } = await deployYoutube();

    await youtube
      .connect(owner)
      .uploadVideo('QmOwnerVideo', 'Owner video', '', '', 'Technology', '', '2026-05-16');
    await youtube
      .connect(viewer)
      .uploadVideo('QmViewerVideo', 'Viewer video', '', '', 'Music', '', '2026-05-16');

    expect(await youtube.ownerOf(1)).to.equal(owner.address);
    expect(await youtube.ownerOf(2)).to.equal(viewer.address);
    expect((await youtube.getVideoCount()).toNumber()).to.equal(2);
  });

  it('rejects empty required metadata', async function () {
    const { youtube, creator } = await deployYoutube();

    await expectRevert(
      youtube.connect(creator).uploadVideo('', 'No hash', '', '', 'Other', '', '2026-05-16'),
      'Video hash is required',
    );

    await expectRevert(
      youtube.connect(creator).uploadVideo('QmVideoHash', '', '', '', 'Other', '', '2026-05-16'),
      'Title is required',
    );
  });
});

async function expectRevert(action, reason) {
  try {
    await action;
    expect.fail(`Expected transaction to revert with "${reason}"`);
  } catch (error) {
    expect(error.message).to.include(reason);
  }
}
