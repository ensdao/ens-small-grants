import { ArrowLeftOutlined } from '@ant-design/icons';
import { Box, Center, Spinner, Text, Link, Avatar, Heading } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { useGrant, useRound } from '../hooks';
import VoteSection, { clipAddress } from './VoteSection';

export function Proposal() {
  const { id, roundId } = useParams<{ id: string; roundId: string }>();
  const { grant, loading } = useGrant(id!);
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
      <Box
        flexWrap="wrap"
        flexDirection={{ base: 'column', md: 'row' }}
        gap="32px"
        display="flex"
        width="100%"
        maxWidth="936px"
      >
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
              {ensName || clipAddress(grant.proposer)}
            </Text>
          </Box>
          <Box flexDirection="column" gap="22px" display="flex" marginTop="34px">
            <Text fontSize="34px" fontWeight="bold">
              {grant.title}
            </Text>
            <Text fontSize="24px" fontWeight="bold">
              {grant.description}
            </Text>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <Heading as="h1" variant="md-h1">
                    {children}
                  </Heading>
                ),
                h2: ({ children }) => (
                  <Heading as="h2" variant="md-h2">
                    {children}
                  </Heading>
                ),
                h3: ({ children }) => (
                  <Heading as="h3" variant="md-h3">
                    {children}
                  </Heading>
                ),
                h4: ({ children }) => (
                  <Heading as="h4" variant="md-h4">
                    {children}
                  </Heading>
                ),
                h5: ({ children }) => (
                  <Heading as="h5" variant="md-h5">
                    {children}
                  </Heading>
                ),
                h6: ({ children }) => (
                  <Heading as="h6" variant="md-h6">
                    {children}
                  </Heading>
                ),
                p: ({ children }) => <Text variant="md-p">{children}</Text>,
                a: ({ children, href }) => (
                  <Link href={href} target="_blank" variant="md-a">
                    {children}
                  </Link>
                ),
              }}
            >
              {grant.full_text}
            </ReactMarkdown>
          </Box>
        </Box>
        <Box flex={1}>
          <VoteSection round={round} proposal={grant} />
        </Box>
      </Box>
    </Box>
  );
}
