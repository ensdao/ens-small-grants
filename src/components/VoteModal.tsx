import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { Grant } from '../hooks';

export type VoteModalProps = {
  open: boolean;
  onClose: () => void;
  proposal: Grant;
};

function VoteModal({ open, onClose, proposal }: VoteModalProps) {
  const { data } = useAccount();

  // TODO: replace with getting the voter via data.address
  const currentVoter = {
    voterAddr: data?.address,
    grantProposalId: 123,
    voteCountForGrantProposal: 0, // this will be > 0 if they voted for this proposal
    votingPower: 123,
    remainingVotingPower: 123, // this will be 0 if they voted on another proposal
  };

  const onPressAddVote = useCallback(() => {
    // TODO: Fill in
  }, []);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Allocate your vote</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Flex flexDirection="column" gap="8px">
              <Text>
                Voting power: <span style={{ fontWeight: 600 }}>{currentVoter.votingPower}</span>
              </Text>
              <Text>
                You are about to allocate <span style={{ fontWeight: 600 }}>{currentVoter.votingPower}</span> votes for{' '}
                <span style={{ fontWeight: 600 }}>{proposal.title}</span>.
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Flex gap="8px">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>

              <Button onClick={onPressAddVote}>Allocate votes</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export default VoteModal;
