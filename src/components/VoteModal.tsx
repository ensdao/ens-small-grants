import { Button, Dialog, Helper, Typography, lightTheme } from '@ensdomains/thorin';
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

const CustomHelper = styled(Helper)(
  ({ theme }) => css`
    color: ${theme.colors.green};
    background-color: rgba(73, 179, 147, 0.075);
    border-color: ${theme.colors.green};

    svg {
      color: ${theme.colors.green};
    }
  `
);

function VoteModal({ open, onClose, grantIds, proposalId, address }: VoteModalProps) {
  const [waiting, setWaiting] = useState(false);
  const [voted, setVoted] = useState<boolean>(false);
  const [error, setError] = useState<React.ReactNode | string | null>(null);
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
        // eslint-disable-next-line no-console
        console.error(error_);

        if (error_.error_description) {
          setError(`Snapshot error: ${error_.error_description}`);
        } else if (error_?.message?.includes('user rejected signing')) {
          setError('Rejected the signature');
        } else {
          setError(
            <div>
              <span>Unknown error. </span>
              <a
                href={`https://snapshot.org/#/small-grants.eth/proposal/${proposalId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: lightTheme.colors.accent,
                  fontWeight: '500',
                }}
              >
                Vote on Snapshot directly
              </a>
            </div>
          );
        }
      });

    setWaiting(false);
  };

  function handleDismiss() {
    onClose();
    setVoted(false);
    setError(null);
  }

  const votingPower = snapshotProposal?.votesAvailable ?? 0;

  return (
    <Dialog open={open} onDismiss={handleDismiss} variant="blank">
      <Dialog.CloseButton onClick={handleDismiss} />
      <Dialog.Heading title="Allocate your vote" />
      <InnerModal>
        {voted ? (
          <CustomHelper alignment="horizontal" type="info">
            Your vote was submitted successfully!
          </CustomHelper>
        ) : error ? (
          <Helper alignment="horizontal" type="error">
            {error}
          </Helper>
        ) : null}

        {voted ? (
          <Helper type="warning" style={{ minWidth: '100%' }}>
            <Typography weight="semiBold">The vote count may take a few minutes to update.</Typography>
            <Typography>Voting again will override your previous vote.</Typography>
          </Helper>
        ) : null}

        {!voted && !error && (
          <Message>
            You are about to vote for {grantIds.length > 1 ? 'these proposals' : 'this proposal'}, please confirm the
            details below.
          </Message>
        )}

        <DisplayItems>
          <DisplayItem label="Connected address" address value={address} />
          <DisplayItem label="Voting Power" value={`${voteCountFormatter.format(votingPower)}`} />
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
            <Button shadowless disabled={waiting || votingPower === 0} onClick={onPressAddVote} loading={waiting}>
              Vote
            </Button>
          )
        }
      />
    </Dialog>
  );
}

export default VoteModal;
