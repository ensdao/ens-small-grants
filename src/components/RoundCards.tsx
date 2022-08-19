import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Box, Button, Text } from '@chakra-ui/react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';

import type { Round } from '../hooks';

export type RoundCardProps = {
  round: Round;
};

export const RoundCard = ({ round }: RoundCardProps) => {
  const now = moment();
  const roundStatus =
    round.proposal_start > now ? (
      <Badge colorScheme="purple">Upcoming</Badge>
    ) : round.voting_end > now ? (
      <Badge colorScheme="green">Active</Badge>
    ) : (
      <Badge colorScheme="blue">Ended</Badge>
    );

  return (
    <Box
      justifyContent="space-between"
      flexDirection="column"
      display="flex"
      minWidth="300px"
      minHeight="300px"
      padding="24px"
      background="white"
      borderRadius="20px"
      boxShadow="rgb(232 232 235) 0px 2px 12px"
    >
      <Box flexDirection="column" display="flex">
        <Text fontSize="24px">{round.title}</Text>
        <Box>{roundStatus}</Box>
      </Box>
      <Box justifyContent="flex-end" display="flex">
        <Button as={RouterLink} rightIcon={<ArrowRightOutlined />} to={`/rounds/${round.id}`}>
          View Round
        </Button>
      </Box>
    </Box>
  );
};

export type RoundCardsProps = {
  label?: string;
  rounds: Round[];
};

export const RoundCards = ({ label, rounds }: RoundCardsProps) => {
  return (
    <Box flexDirection="column" gap="12px" display="flex">
      {label && (
        <Text paddingTop="8px" fontWeight="bold" size="2xl">
          {label}
        </Text>
      )}
      <Box flexWrap="wrap" gap="16px" display="flex">
        {rounds.map(r => (
          <RoundCard key={r.id} round={r} />
        ))}
      </Box>
    </Box>
  );
};
