import { Box, Text, Image, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Routes, Route } from 'react-router-dom';

import daoLogoSrc from './assets/dao_purple.svg';
import GrantRoundSection, { RoundProps } from './components/GrantRoundSection';

const mockRound: RoundProps = {
  id: '123',
  snapshotId: '1',
  granteeAddr: '0x00000000000000',
  title: 'Round 3',
  description: null,
  proposalStart: 1_636_984_800,
  proposalEnd: 1_637_084_800,
  voteStart: 1_637_384_800,
  voteEnd: 1_637_584_800,
  allocationTokenAmount: BigInt(3_204_000_000_000_000_000),
  allocationTokenAddr: '0x00000000000000',
  maxWinnerCount: 1,
};

function Home() {
  return (
    <Box width="100%" maxWidth="936px" paddingBottom="100px">
      <Flex flexDirection="column" gap="42px">
        <Flex flexDirection="column" gap="24px">
          <Flex alignItems="center" gap="8px">
            <Image height="48px" src={daoLogoSrc} />
            <Text paddingTop="8px" fontWeight="bold" size="2xl">
              Small Grants
            </Text>
          </Flex>
          <Text>
            ENS Small Grants are small, quickly executable grants that are funded over a week-long period. Each round
            consists of 3 days in which anyone can propose a project for funding, followed by 7 days where $ENS token
            holders can vote for the best proposals. At the end of the voting period, the top 5 projects each get a
            share of the rounds funding pool.
          </Text>
        </Flex>

        <GrantRoundSection round={mockRound} inProgress />

        <Text paddingTop="8px" fontWeight="bold" size="2xl">
          Funded rounds
        </Text>

        <GrantRoundSection round={mockRound} />
      </Flex>
    </Box>
  );
}

function App() {
  return (
    <Box alignItems="center" flexDirection="column" display="flex" width="100%">
      <Box justifyContent="center" display="flex" width="100%" paddingTop="36px" paddingBottom="36px">
        <Box alignItems="center" flexDirection="row" display="flex" width="100%" maxWidth="936px">
          <Text>Web3 Starter</Text>
          <Box marginLeft="auto">
            <ConnectButton showBalance={false} />
          </Box>
        </Box>
      </Box>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Box>
  );
}

export default App;
