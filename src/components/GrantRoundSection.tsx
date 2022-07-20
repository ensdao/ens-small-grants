import { Image, Text, Box, Button, Flex, Collapse, Spinner, Center } from '@chakra-ui/react';
import { ethers } from 'ethers';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import boltSrc from '../assets/bolt.svg';
import checkmarkWhiteSrc from '../assets/checkmark_white.svg';
import proposalSrc from '../assets/proposal.svg';
import { useGrants } from '../hooks';
import { Round } from '../hooks';
import GrantProposalCard from './GrantProposalCard';
import ProgressBar from './ProgressBar';

const roundProgress = (round: Round) => {
  const now = moment();
  if (round.proposal_start > now) {
    return 0;
  } else if (round.proposal_end > now) {
    return 30;
  } else if (round.voting_start > now) {
    return 50;
  } else if (round.voting_end > now) {
    return 70;
  } else {
    return 100;
  }
};

export type GrantRoundSectionProps = {
  round: Round;
};

function GrantRoundSection({ round }: GrantRoundSectionProps) {
  const [expandProposals, setExpandProposals] = useState(false);
  const allocationAmount = round.allocation_token_amount
    ? ethers.utils.formatEther(round.allocation_token_amount.div(round.max_winner_count))
    : '0';
  const { grants, loading } = useGrants(1);
  const navigate = useNavigate();

  const onPressSubmitProposal = useCallback(() => {
    navigate('/create_proposal');
  }, [navigate]);

  const onToggleExpandProposals = useCallback(() => {
    setExpandProposals(!expandProposals);
  }, [expandProposals]);

  const now = moment();
  const beforeStart = now < round.proposal_start;
  const inProgress = round.proposal_start < now && round.voting_end > now;
  const proposalsOpen = round.proposal_start < now && round.proposal_end > now;

  const proposalsSection = loading ? (
    <Center minHeight="250px">
      <Spinner />
    </Center>
  ) : (
    <>
      <Collapse in={inProgress || expandProposals}>
        <Flex justifyContent="center" flexWrap="wrap" gap="24px" paddingTop="42px">
          {grants &&
            grants.map(g => <GrantProposalCard key={g.id} roundId={round.id} proposal={g} inProgress={inProgress} />)}
        </Flex>
      </Collapse>

      {inProgress && proposalsOpen && (!grants || grants.length === 0) && (
        <Flex alignItems="center" flexDirection="column" gap="24px">
          <Image height="161px" src={proposalSrc} />
          <Text>Be the first to add a proposal</Text>
          <Button onClick={onPressSubmitProposal}>Submit Proposal</Button>
        </Flex>
      )}
      {beforeStart && (
        <Flex alignItems="center" flexDirection="column" gap="24px">
          <Image height="161px" src={proposalSrc} />
          <Text>Proposals will be accepted at round start time</Text>
        </Flex>
      )}
    </>
  );

  return (
    <Box width="100%" padding="60px" background={inProgress ? 'purple-medium' : 'purple-light'} borderRadius="20px">
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Flex flexWrap="wrap">
          <Text fontSize="sm" fontWeight="bold">
            {round.title}
          </Text>

          {beforeStart ? (
            <Box width="20px" height="20px" />
          ) : (
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
          )}

          <Text marginEnd="6px" fontSize="sm" fontWeight="bold">
            {allocationAmount}Ξ
          </Text>
          <Text fontSize="sm"> for each of the top {round.max_winner_count} voted projects</Text>
        </Flex>

        {inProgress ? (
          <>
            {proposalsOpen && (
              <Button fontSize={['8px', '14px', '16px']} onClick={onPressSubmitProposal}>
                Submit Proposal
              </Button>
            )}
          </>
        ) : (
          !beforeStart && (
            <Button onClick={onToggleExpandProposals} variant="link">
              {expandProposals ? 'Show less' : 'Show proposals'}
            </Button>
          )
        )}
      </Flex>

      {inProgress ? (
        <Box width="100%" paddingTop="42px">
          <ProgressBar progressNumber={roundProgress(round)} totalNumber={100} />
          <Box justifyContent="space-between" flexDirection="row" display="flex">
            <Box>
              <Text>Proposals Open</Text>
            </Box>
            <Box>
              <Text>Voting Open</Text>
            </Box>
            <Box>
              <Text>Voting Closed</Text>
            </Box>
          </Box>
        </Box>
      ) : beforeStart ? (
        <Flex gap="6px" paddingTop="16px">
          <Text fontSize="sm" fontWeight="bold">
            Proposal Period Begins
          </Text>
          <Text fontSize="sm">{round.proposal_start.format('MMMM D, YYYY hh:mma')}</Text>
        </Flex>
      ) : (
        <Flex gap="6px" paddingTop="16px">
          <Text fontSize="sm" fontWeight="bold">
            Voting Ended
          </Text>
          <Text fontSize="sm">{round.voting_end.format('MMMM D, YYYY')}</Text>
        </Flex>
      )}

      {proposalsSection}
    </Box>
  );
}

export default GrantRoundSection;
