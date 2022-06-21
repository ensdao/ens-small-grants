import { Image, Box, Text, Button, Flex, Spinner } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useEnsName, useEnsAvatar, useAccount } from 'wagmi';

import boltSrc from '../assets/bolt.svg';
import { Grant } from '../hooks';
import VoteModal from './VoteModal';

function clipAddress(address: string) {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
}

export type ENSAvatarAndNameProps = {
  address: string;
};

function ENSAvatarAndName({ address }: ENSAvatarAndNameProps) {
  const { data: ensName, isLoading } = useEnsName({ address, chainId: 1 });
  const { data: ensAvatar, isLoading: avatarLoading } = useEnsAvatar({ addressOrName: address, chainId: 1 });

  if (isLoading || avatarLoading) return <Spinner />;

  return (
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

      <Text fontSize="sm" fontWeight={600}>
        {ensName || clipAddress(address)}
      </Text>
    </Flex>
  );
}

export type GrantProposalCardProps = {
  proposal: Grant;
  inProgress?: boolean;
};

function VoteSection({ proposal }: GrantProposalCardProps) {
  const [openVoteModal, setOpenVoteModal] = useState(false);
  const { data } = useAccount();

  // TODO: add check if voting ended
  const roundIsClosed = false;

  // TODO: replace with getting the voter via data.address
  const currentVoter = {
    voterAddr: data?.address,
    grantProposalId: 123,
    voteCountForGrantProposal: 0, // this will be > 0 if they voted for this proposal
    votingPower: 123,
    remainingVotingPower: 123, // this will be 0 if they voted on another proposal
  };
  const userHasVotingPower = data?.address && currentVoter?.votingPower > 0;
  const userVotedOnAProposal = userHasVotingPower && currentVoter.votingPower - currentVoter.remainingVotingPower > 0;
  const userVotedForCurrentProposal = userHasVotingPower && currentVoter.voteCountForGrantProposal > 0;

  // TODO: Replace with real votes
  const mockedVoters = [
    { address: '0xEE599e7c078cAdBB7f81531322d6534F22749136', count: 123 },
    { address: '0xEE599e7c078cAdBB7f81531322d6534F22749136', count: 123 },
  ];

  const onOpenVoteModal = useCallback(() => {
    setOpenVoteModal(true);
  }, []);
  const onCloseVoteModal = useCallback(() => {
    setOpenVoteModal(false);
  }, []);

  return (
    <Flex
      flexDirection="column"
      width="100%"
      maxWidth="326px"
      paddingTop="40px"
      paddingRight="24px"
      paddingLeft="24px"
      background="purple-medium"
      borderRadius="20px"
      paddingBottom="40px"
    >
      <Text fontSize="sm" fontWeight={600}>
        Votes
      </Text>
      <Text fontSize="34px" fontWeight={600}>
        {proposal.vote_count}
      </Text>

      <Flex
        alignItems="center"
        flexDirection="column"
        alignSelf="center"
        gap="14px"
        width="100%"
        marginTop="28px"
        marginBottom="34px"
      >
        {roundIsClosed && <Text fontSize="sm">Voting is closed.</Text>}
        {!roundIsClosed && !data?.address && <Text fontSize="sm">Connect wallet to vote.</Text>}

        {userHasVotingPower && (
          <>
            {userVotedForCurrentProposal && <Text>🎉 You voted for this proposal</Text>}
            <Button width="100%" onClick={onOpenVoteModal}>
              {userVotedOnAProposal ? 'Change your vote' : 'Add your vote'}
            </Button>
            <VoteModal onClose={onCloseVoteModal} open={openVoteModal} proposal={proposal} />
          </>
        )}
      </Flex>

      <Flex flexDirection="column" gap="16px">
        {mockedVoters.map(voter => (
          <ENSAvatarAndName key={voter.address} address={voter.address} />
        ))}
      </Flex>
    </Flex>
  );
}

export default VoteSection;
