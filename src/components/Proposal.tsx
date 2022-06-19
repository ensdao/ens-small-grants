import { ArrowLeftOutlined } from '@ant-design/icons';
import { Box, Center, Image, Spinner, Text, Link } from '@chakra-ui/react';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { useGrant } from '../hooks';

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
      <Box flexDirection="row" display="flex" width="100%" maxWidth="936px">
        <Box flex={2}>
          <Link as={ReactRouterLink} to="/">
            <ArrowLeftOutlined /> Back to all proposals
          </Link>
          <Box alignItems="center" gap="16px" display="flex" marginTop="32px">
            {ensAvatar && <Image width="60px" height="60px" borderRadius="60px" src={ensAvatar} />}
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
        <Box flex={1}></Box>
      </Box>
    </Box>
  );
}
