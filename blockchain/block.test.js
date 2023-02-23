const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util');

describe('Block', ()=> { 
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });
    //difficulty level decides how many leading zeros the block hash should have.
    //Nounce is a adjusted value for the miner to create new hashes

  it('has a timestamp, lastHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock()', () => {
    const lastBlock = Block.genesis();
    const data = 'mined data';
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a SHA-256 `hash` based on the proper inputs', () => {
      expect(minedBlock.hash)
        .toEqual(
          cryptoHash(
            minedBlock.timestamp,
            minedBlock.nonce,
            minedBlock.difficulty,
            lastBlock.hash,
            data
          )
        );
    });

    it('sets a `hash` that matches the difficulty criteria', () => {
        //A sub string fromm 0 upto the mined bloack.difficulty matches a string of 0's length equal to that difficulty itself.
        expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
            .toEqual('0'.repeat(minedBlock.difficulty));
       });

    it('adjusts the difficulty', () => {
        //Either the difficulty is raised or its lowered
        //An array will hold the raised and lowered difficulty values
        const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

        expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
       });
    });

  describe('adjustDifficulty()', () => {
        //Every block gets mined under a fixed duartion, if that duration is not uniform throughout the chain, that indicates there might 
        //be a tramper with the data.
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1);
            //Calculating difficulty value based of the block and block-timmestamp and its checking wheather the new time stamp has fallen 
            //greater than or lower than the mmine rate. In the above case its lower as we are subtracting a 100 ms 
        });
        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty-1);
        });

        it('has a lower limit of 1', ()=>{
            block.difficulty = -1;

            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1); //1 is now set as the new lower limit
        });
     });
});