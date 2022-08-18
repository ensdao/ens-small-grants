import { ArrowLeftOutlined } from '@ant-design/icons';
import { Box, Text, Flex, Spinner, Button } from '@chakra-ui/react';
import moment from 'moment';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';

import GrantRoundSection from '../components/GrantRoundSection';
import { useRound } from '../hooks';

const MAX_WIDTH = '1200px';

export const Round = () => {
  const { id } = useParams<{ id: string }>();
  const { round, loading } = useRound(id!);

  if (loading || !round) {
    return <Spinner />;
  }

  // Check if round[0] is active (in proposals or voting stage)
  const isActiveRound = moment(round.voting_end).isAfter(moment());

  return (
    <Box alignItems="center" flexDirection="column" display="flex">
      <Box width="100%" maxWidth={MAX_WIDTH} paddingBottom="100px">
        <Button as={ReactRouterLink} marginBottom="36px" leftIcon={<ArrowLeftOutlined />} to="/" variant="link">
          Back to all rounds
        </Button>
        <Flex flexDirection="column" gap="42px">
          <Flex flexDirection="column" gap="24px">
            {isActiveRound && (
              <Text>
                Proposals are open through <strong>{moment(round.proposal_end).format('MMMM Do LT')}</strong>. Voting
                starts immediately after and is open until{' '}
                <strong>{moment(round.voting_end).format('MMMM Do LT')}</strong>.
              </Text>
            )}
          </Flex>

          <GrantRoundSection round={round} />
        </Flex>
      </Box>
    </Box>
  );
};
