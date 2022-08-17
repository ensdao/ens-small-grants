import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Flex,
  FormHelperText,
  Link,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { useCreateGrant } from '../hooks';

const MAX_WIDTH = '1200px';

type FormInput = {
  title: string;
  shortDescription: string;
  fullText: string;
};

// TEMP
const roundId = 1;

export function CreateProposal() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInput>();
  const { data: account } = useAccount();
  const { createGrant } = useCreateGrant();
  const navigate = useNavigate();

  const isFormDisabled = !account;

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async data => {
      await createGrant({
        roundId,
        title: data.title,
        description: data.shortDescription,
        fullText: data.fullText,
      });

      navigate('/');
    },
    [createGrant, navigate]
  );

  const onCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Box alignItems="center" flexDirection="column" display="flex">
      <Box flexDirection="column" gap="42px" display="flex" width="100%" maxWidth={MAX_WIDTH}>
        {!account && (
          <Alert borderRadius="12px" status="warning">
            <AlertIcon />
            You must connect your wallet to submit a proposal.
          </Alert>
        )}

        <FormControl isDisabled={isFormDisabled} isInvalid={!!errors.title} isRequired={true}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...register('title', { required: true })} />
          {errors.title && <FormErrorMessage>Title is required</FormErrorMessage>}
        </FormControl>
        <FormControl isDisabled={isFormDisabled} isInvalid={!!errors.shortDescription} isRequired={true}>
          <FormLabel htmlFor="shortDescription">Short Description</FormLabel>
          <Input id="shortDescription" {...register('shortDescription', { required: true })} />
          {errors.shortDescription && <FormErrorMessage>Short Description is required.</FormErrorMessage>}
        </FormControl>
        <FormControl isDisabled={isFormDisabled} isInvalid={!!errors.fullText} isRequired={true}>
          <FormLabel htmlFor="fullText">Full Proposal Text</FormLabel>
          <FormHelperText>
            You can use{' '}
            <Link href="https://www.markdownguide.org/basic-syntax/" target="_blank">
              markdown syntax
            </Link>{' '}
            to format your proposal
          </FormHelperText>
          <Textarea id="fullText" {...register('fullText', { required: true, minLength: 300 })} />
          {errors.fullText && (
            <FormErrorMessage>
              {errors.fullText?.type === 'minLength'
                ? 'Full Proposal Text must be at least 300 characters'
                : 'Full Proposal Text is required'}
            </FormErrorMessage>
          )}
        </FormControl>
        <Flex justifyContent="flex-end" gap="12px">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button disabled={isFormDisabled} onClick={handleSubmit(onSubmit)}>
            Publish
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
