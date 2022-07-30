import { Box, Text, Button, Flex, Avatar } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnsName, useEnsAvatar } from 'wagmi';

import { Grant } from '../hooks';
import { voteCountFormatter } from '../utils';

export type GrantProposalCardProps = {
  roundId: string;
  proposal: Grant;
  inProgress?: boolean;
};

function GrantProposalCard({ roundId, proposal }: GrantProposalCardProps) {
  const navigate = useNavigate();
  const { data: ensName } = useEnsName({ address: proposal.proposer, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: proposal.proposer, chainId: 1 });
  const timeSinceSubmission = proposal.created_at.fromNow();
  const onPressGrantProposal = useCallback(() => {
    navigate(`/rounds/${roundId}/proposals/${proposal.id}`);
  }, [roundId, proposal, navigate]);

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
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              width="34px"
              height="34px"
              background="primary-purple"
              borderRadius={40}
            >
              <Avatar width={'34px'} height="34px" src={ensAvatar as string} />
            </Box>
            <Flex alignItems="flex-start" flexDirection="column">
              <Text fontSize="sm" fontWeight={600}>
                {ensName || `${proposal.proposer.slice(0, 6)}..${proposal.proposer.slice(36, 40)}`}
              </Text>
              <Text fontSize="sm">{timeSinceSubmission}</Text>
            </Flex>
          </Flex>
          {proposal.vote_status && (
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
          {proposal.vote_count !== undefined && proposal.vote_count !== null ? (
            <Text fontWeight="bold">Votes: {voteCountFormatter.format(proposal.vote_count)}</Text>
          ) : null}
        </Box>
        <Button onClick={onPressGrantProposal} variant="link">
          View proposal
        </Button>
      </Flex>
    </Flex>
  );
}

export default GrantProposalCard;
