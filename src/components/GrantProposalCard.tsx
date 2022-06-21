import { Image, Box, Text, Button, Flex } from '@chakra-ui/react';
import moment from 'moment';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnsName, useEnsAvatar } from 'wagmi';

import boltSrc from '../assets/bolt.svg';
import { Grant } from '../hooks';

export type GrantProposalCardProps = {
  proposal: Grant;
  inProgress?: boolean;
};

function GrantProposalCard({ proposal, inProgress }: GrantProposalCardProps) {
  const navigate = useNavigate();
  const { data: ensName } = useEnsName({ address: proposal.proposer, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: proposal.proposer, chainId: 1 });
  const timeSinceSubmission = moment(proposal.created_at).fromNow();
  const onPressGrantProposal = useCallback(() => {
    navigate(`/proposals/${proposal.id}`);
  }, [proposal, navigate]);

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
              {ensAvatar ? (
                <Image width="34px" height="34px" borderRadius="40px" src={ensAvatar} />
              ) : (
                <Image height="20px" src={boltSrc} />
              )}
            </Box>
            <Flex alignItems="flex-start" flexDirection="column">
              <Text fontSize="sm" fontWeight={600}>
                {ensName}
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
          {!inProgress && !!proposal.vote_count ? <Text fontWeight="bold">Votes {proposal.vote_count}</Text> : null}
        </Box>
        <Button onClick={onPressGrantProposal} variant="link">
          View proposal
        </Button>
      </Flex>
    </Flex>
  );
}

export default GrantProposalCard;
