import { Button, Dialog, Typography } from '@ensdomains/thorin';
import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import type { Grant } from '../types';
import { voteCountFormatter } from '../utils';
import DisplayItem from './DisplayItem';
import { InnerModal, DisplayItems } from './atoms';

export type VoteModalProps = {
  open: boolean;
  proposal: Grant;
  votingPower: number;
  address: string;
  onVote: () => Promise<void>;
  onClose: () => void;
};

const Message = styled(Typography)(
  ({ theme }) => css`
    text-align: center;
    color: ${theme.colors.textSecondary};
    max-width: ${theme.space['112']};
  `
);

function VoteModal({ open, onClose, proposal, onVote, address, votingPower }: VoteModalProps) {
  const [waiting, setWaiting] = useState(false);

  const onPressAddVote = useCallback(async () => {
    try {
      setWaiting(true);
      await onVote();
    } finally {
      setWaiting(false);
    }
  }, [onVote]);

  return (
    <Dialog open={open} onDismiss={onClose} variant="blank">
      <Dialog.CloseButton onClick={onClose} />
      <Dialog.Heading title="Allocate your vote" />
      <InnerModal>
        <Message>You are about to vote for this proposal, please confirm the details below.</Message>
        <DisplayItems>
          <DisplayItem label="Connected address" address value={address} />
          <DisplayItem label="Voting Power" value={`${voteCountFormatter.format(votingPower)} $ENS`} />
          <DisplayItem label="Selected proposal" value={proposal.title} />
        </DisplayItems>
      </InnerModal>
      <Dialog.Footer
        leading={
          <Button onClick={onClose} variant="secondary" shadowless>
            Cancel
          </Button>
        }
        trailing={
          <Button shadowless disabled={waiting} onClick={onPressAddVote}>
            Vote
          </Button>
        }
      />
    </Dialog>
  );
}

export default VoteModal;
