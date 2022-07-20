import { ArrowLeftOutlined } from '@ant-design/icons';
import { Box, Center, Spinner, Text, Link, Avatar } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { useGrant, useRound } from '../hooks';
import VoteSection from './VoteSection';

export function Proposal() {
  const { id, roundId } = useParams<{ id: string; roundId: string }>();
  const { grant, loading, votesAvailable } = useGrant(id!);
  const { round, loading: roundLoading } = useRound(roundId!);
  const { data: ensName } = useEnsName({ address: grant?.proposer, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: grant?.proposer, chainId: 1 });

  if (loading || roundLoading || !grant || !round) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Box alignItems="center" flexDirection="column" display="flex">
      <Box flexWrap="wrap" flexDirection="row" gap="32px" display="flex" width="100%" maxWidth="936px">
        <Box flex={2}>
          <Link as={ReactRouterLink} to="/">
            <ArrowLeftOutlined /> Back to all proposals
          </Link>
          <Box alignItems="center" gap="16px" display="flex" marginTop="32px">
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              overflow="hidden"
              width="40px"
              height="40px"
              background="primary-purple"
              borderRadius={40}
            >
              <Avatar width={'40px'} height={'40px'} src={ensAvatar as string} />
            </Box>
            <Text fontSize="14px" fontWeight="bold">
              {ensName || grant.proposer}
            </Text>
          </Box>
          <Box flexDirection="column" gap="22px" display="flex" marginTop="34px">
            <Text fontSize="34px" fontWeight="bold">
              {grant.title}
            </Text>
            <Text fontSize="24px" fontWeight="bold">
              {grant.description}
            </Text>
            <Box
              sx={{
                '& > h1': {
                  fontSize: '24px',
                },
                '& > h2': {
                  fontSize: '20px',
                },
                '& > h3': {
                  fontSize: '18px',
                },
                '& > strong': {
                  fontWeight: 'bold',
                },
              }}
            >
              <ReactMarkdown>{grant.full_text}</ReactMarkdown>
            </Box>
          </Box>
        </Box>
        <Box flex={1}>
          <VoteSection round={round} proposal={grant} votesAvailable={votesAvailable} />
        </Box>
      </Box>
    </Box>
  );
}
