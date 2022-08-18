import { Box, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { Round } from '../hooks';

export type RoundCardProps = {
  round: Round;
};

export const RoundCard = ({ round }: RoundCardProps) => {
  return (
    <Box padding="24px" background="white" borderRadius="20px">
      <Link as={RouterLink} fontSize="24px" to={`/rounds/${round.id}`}>
        {round.title}
      </Link>
    </Box>
  );
};

export type RoundCardsProps = {
  label?: string;
  rounds: Round[];
};

export const RoundCards = ({ label, rounds }: RoundCardsProps) => {
  return (
    <Box>
      {label && (
        <Text paddingTop="8px" fontWeight="bold" size="2xl">
          {label}
        </Text>
      )}
      <Box flexDirection="column" display="flex">
        {rounds.map(r => (
          <RoundCard key={r.id} round={r} />
        ))}
      </Box>
    </Box>
  );
};
