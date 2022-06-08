import { Image, Box, Text, Button, Flex } from '@chakra-ui/react';
import { useCallback } from 'react';

import boltSrc from '../assets/bolt.svg';

// TODO: replace with proposal props from hook
export type ProposalProps = {
  id: string;
  roundId: string;

  title: string;
  description: string | null;
  fullText: string | null;

  proposerAddr: string;
  voteCount: number | null;
  voteStatus: number | null;

  createdAt: number;
};

export type GrantProposalCardProps = {
  proposal: ProposalProps;
  inProgress?: boolean;
};

function GrantProposalCard({ proposal, inProgress }: GrantProposalCardProps) {
  const ensName = 'gail.eth'; // TODO: update to use ethers to get the ENS name from proposal.proposerAddr
  const timeSinceSubmission = '2 days ago'; // TODO: update to calculate time
  const onPressGrantProposal = useCallback(() => {
    // TODO: navigate to proposal
  }, []);

  return (
    <Flex
      justifyContent="space-between"
      flexDirection="column"
      width="325px"
      maxWidth="100%"
      height="308px"
      padding="24px"
      background="white"
      borderRadius="20px"
    >
      <Flex flexDirection="column" gap="24px" width="100%" height="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap="16px">
            {/* TODO: add davatar, stub image for now */}
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              width="34px"
              height="34px"
              background="primary-purple"
              borderRadius={40}
            >
              <Image height="20px" src={boltSrc} />
            </Box>

            <Flex alignItems="flex-start" flexDirection="column">
              <Text fontSize="sm" fontWeight={600}>
                {ensName}
              </Text>
              <Text fontSize="sm">{timeSinceSubmission}</Text>
            </Flex>
          </Flex>
          {proposal.voteStatus && (
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              px="8px"
              background="#F4F9F7"
              borderRadius={30}
            >
              <Text color="secondary-green" fontWeight={600}>
                Funded
              </Text>
            </Box>
          )}
        </Flex>

        <Flex flexDirection="column" gap="8px">
          <Text fontSize="2xl" fontWeight="bold" noOfLines={2}>
            {proposal.title}
          </Text>
          <Text noOfLines={2}>{proposal.description}</Text>
        </Flex>
      </Flex>

      <Flex justifyContent="space-between" width="100%">
        <Box>
          {!inProgress && !!proposal.voteCount ? <Text fontWeight="bold">Votes {proposal.voteCount}</Text> : null}
        </Box>
        <Button onClick={onPressGrantProposal} variant="link">
          View proposal
        </Button>
      </Flex>
    </Flex>
  );
}

export default GrantProposalCard;
