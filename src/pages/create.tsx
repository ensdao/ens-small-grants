import { Round } from '@/kysely/db';
import { Button, Dialog, FieldSet, Helper, Input, mq, Spinner, Textarea, Typography } from '@ensdomains/thorin';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled, { css } from 'styled-components';
import { useMutation } from 'wagmi';
import { useAccount } from 'wagmi';

import BackButton from '../components/BackButton';
import DisplayItem from '../components/DisplayItem';
import { Card, InnerModal, DisplayItems } from '../components/atoms';
import { useCreateGrant, useFetch } from '../hooks';
import { ProposalBody } from './proposals/[id]';

type FormInput = {
  title: string;
  shortDescription: string;
  fullText: string;
  twitter: string;
  payoutAddress: string;
};

const Container = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    gap: ${theme.space['4']};
    border-radius: ${theme.radii['3xLarge']};

    width: 100%;
    height: 100%;

    a {
      color: ${theme.colors.indigo};
      font-weight: bold;
    }

    fieldset legend {
      margin-top: ${theme.space['2']};
    }

    fieldset > div:last-child {
      gap: ${theme.space['8']};
    }
  `
);

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    color: ${theme.colors.textTertiary};
    text-align: right;
    flex-grow: 1;
    width: 100%;

    b {
      color: ${theme.colors.text};
      font-weight: bold;
      display: block;
    }

    ${mq.md.min(css`
      font-size: ${theme.space['9']};
      text-align: left;
      b {
        display: inline-block;
      }
    `)}
  `
);

const InputDescription = styled.div(
  ({ theme }) => css`
    line-height: 1.2;
    font-weight: ${theme.fontWeights.medium};
    color: ${theme.colors.textTertiary};
  `
);

const DialogDescription = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.large};
    max-width: ${theme.space['96']};
    text-align: center;
  `
);

export default function CreateProposal() {
  const router = useRouter();
  const { round: _roundId } = router.query;
  const roundId = _roundId as string;
  const to = `/rounds/${roundId}`;

  const { address } = useAccount();
  const isFormDisabled = !address;
  const { data: round, error: roundError } = useFetch<Round>(roundId ? `/api/round/${roundId}` : undefined);
  const isLoading = !round && !roundError;

  const { handleSubmit, register, getFieldState, formState } = useForm<FormInput>({
    mode: 'onBlur',
  });

  const { createGrant } = useCreateGrant();

  const [isPreview, setIsPreview] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: '',
    shortDescription: '',
    fullText: '',
    twitter: '',
    payoutAddress: '',
  });

  const onSubmit: SubmitHandler<FormInput> = useCallback(data => {
    setDialogOpen(true);
    setDialogData(data);
  }, []);

  const onPreview: SubmitHandler<FormInput> = useCallback(data => {
    setDialogData(data);
    setIsPreview(true);
  }, []);

  const [publishError, setPublishError] = useState<string | undefined | null>(null);

  const {
    mutate: handlePublish,
    isLoading: mutationLoading,
    error,
  } = useMutation(
    async () => {
      await createGrant({
        roundId: Number.parseInt(roundId!),
        title: dialogData.title,
        description: dialogData.shortDescription,
        fullText: dialogData.fullText,
        twitter: dialogData.twitter,
        payoutAddress: dialogData.payoutAddress,
      })
        .then(async res => {
          if (!res.ok || res.status !== 201) {
            console.error(res);

            const resBody = (await res.json()) as { error?: string };
            setPublishError(resBody.error || `Error ${res.status}. ${res.statusText}`);
          } else {
            router.push({ pathname: to, query: { success: true } });
          }
        })
        .catch(error_ => {
          setPublishError(typeof error_?.message === 'string' ? error_?.message : 'Error signing message');
        });
    },
    {
      mutationKey: ['createGrant', roundId, dialogData],
    }
  );

  const _publishError = error as Error | undefined;
  if (_publishError) {
    setPublishError(typeof _publishError?.message === 'string' ? _publishError?.message : 'Error signing message');
  }

  const onCancel = () => {
    router.push(to);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!round) {
    return <p>Invalid round ID in the URL</p>;
  }

  // Redirect to round page if it is not accepting proposals
  const isPropRound = new Date(round.proposalStart) < new Date() && new Date(round.proposalEnd) > new Date();
  if (!isPropRound) {
    return <p>This round is not accepting proposals</p>;
  }

  const _description = dialogData.shortDescription;
  const formattedDescription = _description.length > 30 ? _description.slice(0, 30).trim() + '...' : _description;

  return (
    <>
      <Dialog open={dialogOpen} onDismiss={() => setDialogOpen(false)} variant="blank">
        <Dialog.Heading title="Confirm your proposal" />
        {publishError && <Helper type="error">{publishError.toString()}</Helper>}
        <InnerModal>
          <DialogDescription>
            Make sure everything is correct, proposal submissions are public and can&apos;t be undone.
          </DialogDescription>
          <DisplayItems>
            <DisplayItem label="Title" value={dialogData.title} />
            <DisplayItem label="Website" value={dialogData.twitter} />
            {dialogData.payoutAddress && <DisplayItem label="Payout Address" value={dialogData.payoutAddress} />}
            <DisplayItem label="TL;DR" value={formattedDescription} />
            <DisplayItem label="Description" value={`${dialogData.fullText.slice(0, 30).trim()}...`} />
          </DisplayItems>
        </InnerModal>
        <Dialog.Footer
          leading={
            <Button variant="secondary" onClick={() => setDialogOpen(false)} shadowless>
              Cancel
            </Button>
          }
          trailing={
            <Button shadowless disabled={mutationLoading} onClick={() => handlePublish()}>
              Publish
            </Button>
          }
        />
      </Dialog>

      <BackButton
        href={`/rounds/${roundId}`}
        title={
          <Title>
            <b>{round.title.split('Round')[0]}</b> Round {round.title.split('Round')[1]}
          </Title>
        }
      />

      <Container hasPadding={true}>
        {isFormDisabled && (
          <Helper alignment="horizontal" type="warning">
            You must connect your wallet to submit a proposal.
          </Helper>
        )}

        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <FieldSet legend="Submit a Proposal" disabled={isFormDisabled}>
            {(() => {
              if (isPreview) {
                return <ProposalBody fullText={dialogData.fullText} />;
              }

              return (
                <>
                  <Input
                    label="Title"
                    showDot
                    id="title"
                    description={<InputDescription>The title of your proposal</InputDescription>}
                    validated={getFieldState('title', formState).isDirty}
                    required
                    placeholder="ENS Spaceship"
                    {...register('title', {
                      required: true,
                      validate: value =>
                        value.length <= 50 ? undefined : 'Please keep your title under 50 characters',
                    })}
                    error={getFieldState('title', formState).error?.message}
                  />
                  <Input
                    label="Tagline"
                    showDot
                    id="shortDescription"
                    required
                    description={<InputDescription>Your project in 100 characters or less</InputDescription>}
                    placeholder="Taking ENS users to Mars and back"
                    validated={getFieldState('shortDescription', formState).isDirty}
                    {...register('shortDescription', {
                      required: true,
                      validate: value =>
                        value.length <= 100 ? undefined : 'Please keep your tagline under 100 characters',
                    })}
                    error={getFieldState('shortDescription', formState).error?.message}
                  />
                  <Input
                    label="Website"
                    showDot
                    id="twitter"
                    description={<InputDescription>Your project’s website or Twitter profile</InputDescription>}
                    validated={getFieldState('twitter', formState).isDirty}
                    required
                    placeholder="https://ens.domains/"
                    {...register('twitter', { required: true })}
                  />
                  <Input
                    label="Payout Address"
                    showDot
                    id="payoutAddress"
                    description={
                      <InputDescription>
                        The address or ENS name where the funds will be sent if you win. This will not be public.
                      </InputDescription>
                    }
                    validated={getFieldState('payoutAddress', formState).isDirty}
                    placeholder="ens.eth"
                    {...register('payoutAddress', { required: false })}
                  />
                  <Textarea
                    label="Description"
                    id="fullText"
                    required
                    showDot
                    placeholder={`## Why ENS needs a Spaceship\n\nWe need a spaceship to...`}
                    description={
                      <InputDescription>
                        This should be a full description of what you are proposing, with a minimum of at least 300
                        characters. You can use{' '}
                        <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer">
                          markdown for formatting
                        </a>{' '}
                        (extended syntax is supported).
                      </InputDescription>
                    }
                    validated={getFieldState('fullText', formState).isDirty}
                    {...register('fullText', {
                      required: true,
                      validate: value => (value.length >= 300 ? undefined : 'Please enter at least 300 characters'),
                    })}
                    error={getFieldState('fullText', formState).error?.message}
                  />
                </>
              );
            })()}

            <ButtonContainer>
              {isPreview ? (
                <Button
                  onClick={() => setIsPreview(false)}
                  disabled={!formState.isValid}
                  variant="secondary"
                  shadowless
                >
                  Back to Editing
                </Button>
              ) : (
                <Button onClick={handleSubmit(onPreview)} disabled={!formState.isValid} shadowless>
                  Preview
                </Button>
              )}

              <Button type="submit" disabled={isFormDisabled || !formState.isValid || !isPreview} shadowless>
                Publish
              </Button>
            </ButtonContainer>
          </FieldSet>
        </form>
      </Container>

      <div style={{ flexGrow: 1 }} />
    </>
  );
}
