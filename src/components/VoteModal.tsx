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
import { useCallback, useState } from 'react';

import { Grant } from '../hooks';

export type VoteModalProps = {
  open: boolean;
  onClose: () => void;
  proposal: Grant;
  onVote: () => Promise<void>;
  votingPower: number;
};

function VoteModal({ open, onClose, proposal, onVote, votingPower }: VoteModalProps) {
  const [waiting, setWaiting] = useState(false);
  const votenumberFormat = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  const onPressAddVote = useCallback(async () => {
    try {
      setWaiting(true);
      await onVote();
    } finally {
      setWaiting(false);
    }
  }, [onVote]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Allocate your vote</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Flex flexDirection="column" gap="8px">
              <Text>
                Voting power: <span style={{ fontWeight: 600 }}>{votenumberFormat.format(votingPower)}</span>
              </Text>
              <Text>
                You are about to allocate{' '}
                <span style={{ fontWeight: 600 }}>{votenumberFormat.format(votingPower)}</span> votes for{' '}
                <span style={{ fontWeight: 600 }}>{proposal.title}</span>.
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Flex gap="8px">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>

              <Button isLoading={waiting} onClick={onPressAddVote}>
                Vote
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export default VoteModal;
