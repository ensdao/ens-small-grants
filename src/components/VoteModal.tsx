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
  const [voted, setVoted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { proposal: snapshotProposal, vote } = useSnapshotProposal(proposalId);

  // If any of the grandIds are NaN for some reason, set the error message
  if (grantIds.some(id => Number.isNaN(id))) {
    setError('Invalid grant IDs. Refresh the page to try again.');
  }

  const onPressAddVote = async () => {
    setWaiting(true);
    await vote(grantIds)
      .then(() => {
        setVoted(true);
      })
      .catch(error_ => {
        if (error_.error_description) {
          setError(`Snapshot error: ${error_.error_description}`);
        } else {
          setError('Unknown error. Refresh the page and try again.');
        }
      });

    setWaiting(false);
  };

  function handleDismiss() {
    onClose();
    setVoted(false);
    setError(null);
  }

  return (
    <Dialog open={open} onDismiss={handleDismiss} variant="blank">
      <Dialog.CloseButton onClick={handleDismiss} />
      <Dialog.Heading title="Allocate your vote" />
      <InnerModal>
        {voted ? (
          <Helper alignment="horizontal" type="info">
            Your vote was submitted successfully!
          </Helper>
        ) : error ? (
          <Helper alignment="horizontal" type="error">
            {error}
          </Helper>
        ) : null}
        <Message>
          {voted ? (
            <>
              <Typography>
                <b>The vote count may take a few minutes to update.</b>
              </Typography>
              <Typography>Voting again will override your previous vote.</Typography>
            </>
          ) : (
            `You are about to vote for ${grantIds.length > 1 ? 'these proposals' : 'this proposal'}, please confirm the
          details below.`
          )}
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
          <Button onClick={handleDismiss} variant="secondary" shadowless>
            {voted ? 'Close' : 'Cancel'}
          </Button>
        }
        trailing={
          !voted && (
            <Button shadowless disabled={waiting} onClick={onPressAddVote} loading={waiting}>
              Vote
            </Button>
          )
        }
      />
    </Dialog>
  );
}

export default VoteModal;
