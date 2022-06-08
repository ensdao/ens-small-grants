import { Image, Text, Box, Button, Flex, Collapse } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';

import boltSrc from '../assets/bolt.svg';
import checkmarkWhiteSrc from '../assets/checkmark_white.svg';
import proposalSrc from '../assets/proposal.svg';
import GrantProposalCard from './GrantProposalCard';
import ProgressBar from './ProgressBar';

const mockProposal = {
  id: '123',
  roundId: '1',
  title: 'ENS Marketplace on Zora',
  description: 'Create the Zora frontend for ENS to allow for better selling and buying of ENS names.',
  fullText: null,
  proposerAddr: '0xEE599e7c078cAdBB7f81531322d6534F22749136',
  voteCount: 338,
  voteStatus: null,
  createdAt: 1_636_984_800,
};

// TODO: replace with proposal props from hook
export type RoundProps = {
  id: string;
  snapshotId: string | null;
  granteeAddr: string;

  title: string;
  description: string | null;

  proposalStart: number;
  proposalEnd: number;

  voteStart: number;
  voteEnd: number;

  allocationTokenAmount: bigint | null;
  allocationTokenAddr: string;
  maxWinnerCount: number;
};

export type GrantRoundSectionProps = {
  round: RoundProps;
  inProgress?: boolean;
};

function GrantRoundSection({ round, inProgress }: GrantRoundSectionProps) {
  const [expandProposals, setExpandProposals] = useState(false);
  const allocationAmount = round.allocationTokenAmount ? ethers.utils.formatEther(round.allocationTokenAmount) : 0;
  // TODO: get proposals from rounds, for now stub it
  const proposals = [
    mockProposal,
    { ...mockProposal, id: '2', voteStatus: inProgress ? null : 2 },
    { ...mockProposal, id: '3' },
    { ...mockProposal, id: '4' },
  ];

  const onPressSubmitProposal = useCallback(() => {
    // TODO: add interaction for submitting a new proposal
  }, []);

  const onToggleExpandProposals = useCallback(() => {
    setExpandProposals(!expandProposals);
  }, [expandProposals]);

  return (
    <Box width="100%" padding="60px" background={inProgress ? 'purple-medium' : 'purple-light'} borderRadius="20px">
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Flex flexWrap="wrap">
          <Text fontSize="sm" fontWeight="bold">
            {round.title}
          </Text>

          <Box
            alignItems="center"
            justifyContent="center"
            display="flex"
            width="20px"
            height="20px"
            marginRight="6px"
            marginLeft="6px"
            background={inProgress ? 'secondary-green' : 'primary-purple'}
            borderRadius={40}
          >
            {inProgress ? <Image height="12px" src={boltSrc} /> : <Image height="9px" src={checkmarkWhiteSrc} />}
          </Box>

          <Text marginEnd="6px" fontSize="sm" fontWeight="bold">
            {allocationAmount}Ξ
          </Text>
          <Text fontSize="sm"> for a max of {round.maxWinnerCount} voted projects</Text>
        </Flex>

        {inProgress ? (
          <Button onClick={onPressSubmitProposal}>Submit Proposal</Button>
        ) : (
          <Button onClick={onToggleExpandProposals} variant="link">
            {expandProposals ? 'Show less' : 'Show proposals'}
          </Button>
        )}
      </Flex>

      {inProgress ? (
        <Box width="100%" paddingTop="42px">
          <ProgressBar progressNumber={368.81} totalNumber={958} />
        </Box>
      ) : (
        <Flex gap="6px" paddingTop="16px">
          <Text fontSize="sm" fontWeight="bold">
            Issued
          </Text>
          {/* TODO: put in real date */}
          <Text fontSize="sm">May 10</Text>
        </Flex>
      )}

      <Collapse in={inProgress || expandProposals}>
        <Flex flexWrap="wrap" gap="24px" paddingTop="42px">
          {proposals.map(p => (
            <GrantProposalCard key={p.id} proposal={p} inProgress={inProgress} />
          ))}
        </Flex>
      </Collapse>

      {inProgress && proposals.length === 0 && (
        <Flex alignItems="center" flexDirection="column" gap="24px">
          <Image height="161px" src={proposalSrc} />
          <Text>Be the first to add a proposal</Text>
          <Button onClick={onPressSubmitProposal}>Submit Proposal</Button>
        </Flex>
      )}
    </Box>
  );
}

export default GrantRoundSection;
