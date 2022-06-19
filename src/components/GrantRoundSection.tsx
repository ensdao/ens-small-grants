import { Image, Text, Box, Button, Flex, Collapse, Spinner, Center } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import boltSrc from '../assets/bolt.svg';
import checkmarkWhiteSrc from '../assets/checkmark_white.svg';
import proposalSrc from '../assets/proposal.svg';
import { useGrants } from '../hooks';
import { Round } from '../hooks';
import GrantProposalCard from './GrantProposalCard';
import ProgressBar from './ProgressBar';

export type GrantRoundSectionProps = {
  round: Round;
  inProgress?: boolean;
};

function GrantRoundSection({ round, inProgress }: GrantRoundSectionProps) {
  const [expandProposals, setExpandProposals] = useState(false);
  const allocationAmount = round.allocation_token_amount
    ? ethers.utils.formatEther(round.allocation_token_amount)
    : '0';
  const { grants, loading } = useGrants(1);
  const navigate = useNavigate();

  const onPressSubmitProposal = useCallback(() => {
    navigate('/create_proposal');
  }, [navigate]);

  const onToggleExpandProposals = useCallback(() => {
    setExpandProposals(!expandProposals);
  }, [expandProposals]);

  const proposalsSection = loading ? (
    <Center minHeight="250px">
      <Spinner />
    </Center>
  ) : (
    <>
      <Collapse in={inProgress || expandProposals}>
        <Flex flexWrap="wrap" gap="24px" paddingTop="42px">
          {grants && grants.map(g => <GrantProposalCard key={g.id} proposal={g} inProgress={inProgress} />)}
        </Flex>
      </Collapse>

      {inProgress && (!grants || grants.length === 0) && (
        <Flex alignItems="center" flexDirection="column" gap="24px">
          <Image height="161px" src={proposalSrc} />
          <Text>Be the first to add a proposal</Text>
          <Button onClick={onPressSubmitProposal}>Submit Proposal</Button>
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
          <Text fontSize="sm"> for the top {round.max_winner_count} voted projects</Text>
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

      {proposalsSection}
    </Box>
  );
}

export default GrantRoundSection;
