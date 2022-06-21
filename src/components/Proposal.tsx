import { ArrowLeftOutlined } from '@ant-design/icons';
import { Box, Center, Image, Spinner, Text, Link } from '@chakra-ui/react';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';
import { useEnsAvatar, useEnsName } from 'wagmi';

import boltSrc from '../assets/bolt.svg';
import { useGrant } from '../hooks';
import VoteSection from './VoteSection';

export function Proposal() {
  const { id } = useParams<{ id: string }>();
  const { grant, loading } = useGrant(id || '');
  const { data: ensName } = useEnsName({ address: grant?.proposer, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: grant?.proposer, chainId: 1 });

  if (loading || !grant) {
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
              <Image
                width={ensAvatar ? '40px' : '24px'}
                height={ensAvatar ? '40px' : '24px'}
                src={ensAvatar || boltSrc}
              />
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
            <Text fontSize="18px" fontWeight="400">
              {grant.full_text}
            </Text>
          </Box>
        </Box>
        <Box flex={1}>
          <VoteSection proposal={grant} />
        </Box>
      </Box>
    </Box>
  );
}
