import { Image, Box, Text, Button, Flex, Spinner } from '@chakra-ui/react';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useEnsName, useEnsAvatar, useAccount } from 'wagmi';

import boltSrc from '../assets/bolt.svg';
import { Grant, Round, useSnapshotGrant, useSnapshotProposal } from '../hooks';
import VoteModal from './VoteModal';

export function clipAddress(address: string) {
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
  round: Round;
  proposal: Grant;
};

export type VoteInProgressSectionProps = {
  round: Round;
  snapshotProposalId: string;
  proposal: Grant;
};

function VoteInProgressSection({ round, snapshotProposalId, proposal }: VoteInProgressSectionProps) {
  const [openVoteModal, setOpenVoteModal] = useState(false);
  const { data } = useAccount();
  const { vote } = useSnapshotProposal(snapshotProposalId);
  const { snapshotGrant, loading } = useSnapshotGrant(snapshotProposalId, proposal.id.toString());

  const votenumberFormat = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  const onOpenVoteModal = useCallback(() => {
    setOpenVoteModal(true);
  }, []);
  const onCloseVoteModal = useCallback(() => {
    setOpenVoteModal(false);
  }, []);
  const executeVote = useCallback(async () => {
    if (snapshotGrant) {
      await vote(snapshotGrant.choiceId);
      onCloseVoteModal();
    }
  }, [vote, snapshotGrant, onCloseVoteModal]);

  if (loading) {
    return <Spinner />;
  }

  let innerContent = null;

  if (snapshotGrant) {
    const preVoting = moment() < round.voting_start || !!snapshotGrant.voteStatus;
    const roundIsClosed = !!snapshotGrant.voteStatus;

    const currentVoter = {
      voterAddr: data?.address,
      grantProposalId: proposal.id,
      voteCountForGrantProposal: snapshotGrant.currentVotes, // this will be > 0 if they voted for this proposal
      votingPower: snapshotGrant.votesAvailable ?? 0,
      remainingVotingPower: snapshotGrant.votesAvailable ?? 0, // this will be 0 if they voted on another proposal
    };
    const userHasVotingPower = data?.address && currentVoter?.votingPower > 0;
    // const userVotedOnAProposal = userHasVotingPower && currentVoter.votingPower - currentVoter.remainingVotingPower > 0;
    const userVotedForCurrentProposal = userHasVotingPower && currentVoter.voteCountForGrantProposal > 0;

    innerContent = (
      <>
        <Text fontSize="sm" fontWeight={600}>
          Votes
        </Text>
        <Text fontSize="34px" fontWeight={600}>
          {Math.floor(snapshotGrant.voteCount)}
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
          {preVoting && <Text fontSize="sm">Voting has not started.</Text>}
          {!preVoting && roundIsClosed && <Text fontSize="sm">Voting is closed.</Text>}
          {!preVoting && !roundIsClosed && !data?.address && <Text fontSize="sm">Connect wallet to vote.</Text>}

          {!preVoting && !roundIsClosed && userHasVotingPower && (
            <>
              {userVotedForCurrentProposal && <Text>🎉 You voted for this proposal</Text>}
              <Button width="100%" disabled={!!userVotedForCurrentProposal} onClick={onOpenVoteModal}>
                {userVotedForCurrentProposal
                  ? 'Already Voted'
                  : `Vote${
                      snapshotGrant.votesAvailable
                        ? ' (' + votenumberFormat.format(snapshotGrant.votesAvailable) + ')'
                        : ''
                    }`}
              </Button>
              <VoteModal
                onClose={onCloseVoteModal}
                open={openVoteModal}
                proposal={proposal}
                onVote={executeVote}
                votingPower={currentVoter.votingPower}
              />
            </>
          )}
        </Flex>

        <Flex flexDirection="column" gap="16px">
          {snapshotGrant.voteSamples.map(v => (
            <ENSAvatarAndName key={v.id} address={v.voter} />
          ))}
        </Flex>
      </>
    );
  } else {
    innerContent = (
      <Flex
        alignItems="center"
        flexDirection="column"
        alignSelf="center"
        gap="14px"
        width="100%"
        marginTop="28px"
        marginBottom="34px"
      >
        <Text fontSize="sm">Voting has not started.</Text>
      </Flex>
    );
  }

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
      {innerContent}
    </Flex>
  );
}

function VotePendingSection() {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      alignSelf="center"
      gap="14px"
      width="100%"
      marginTop="28px"
      marginBottom="34px"
    >
      <Text fontSize="sm">Voting has not started.</Text>
    </Flex>
  );
}

function VoteSection({ round, proposal }: GrantProposalCardProps) {
  let innerContent = null;

  innerContent = round.snapshot_proposal_id ? (
    <VoteInProgressSection round={round} snapshotProposalId={round.snapshot_proposal_id} proposal={proposal} />
  ) : (
    <VotePendingSection />
  );

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
      {innerContent}
    </Flex>
  );
}

export default VoteSection;
