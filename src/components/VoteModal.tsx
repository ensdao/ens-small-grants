import { Button, Dialog, Helper, Typography } from '@ensdomains/thorin';
import { useState } from 'react';
import styled, { css } from 'styled-components';

import { useSnapshotProposal } from '../hooks';
import { voteCountFormatter } from '../utils';
import DisplayItem from './DisplayItem';
import { InnerModal, DisplayItems } from './atoms';

export type VoteModalProps = {
  open: boolean;
  grantIds: number[];
  proposalId: string;
  address: string;
  onClose: () => void;
};

const Message = styled(Typography)(
  ({ theme }) => css`
    text-align: center;
    color: ${theme.colors.textSecondary};
    max-width: ${theme.space['112']};
  `
);

function VoteModal({ open, onClose, grantIds, proposalId, address }: VoteModalProps) {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { proposal: snapshotProposal, vote } = useSnapshotProposal(proposalId);

  const onPressAddVote = async () => {
    try {
      setWaiting(true);
      await vote(grantIds).catch(error_ => {
        if (error_.error_description) {
          setError(error_.error_description);
        }
      });
    } finally {
      setWaiting(false);
    }
  };

  return (
    <Dialog open={open} onDismiss={onClose} variant="blank">
      <Dialog.CloseButton onClick={onClose} />
      <Dialog.Heading title="Allocate your vote" />
      <InnerModal>
        {error && (
          <Helper alignment="horizontal" type="error">
            Snapshot error: {error}
          </Helper>
        )}
        <Message>
          You are about to vote for {grantIds.length > 1 ? 'these proposals' : 'this proposal'}, please confirm the
          details below.
        </Message>
        <DisplayItems>
          <DisplayItem label="Connected address" address value={address} />
          <DisplayItem
            label="Voting Power"
            value={`${voteCountFormatter.format(snapshotProposal?.votesAvailable ?? 0)} $ENS`}
          />
          <DisplayItem label={`Selected proposal${grantIds.length > 1 ? 's' : ''}`} value={grantIds.join(', ')} />
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
