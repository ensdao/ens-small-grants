import { Box, FormControl, FormLabel, FormErrorMessage, Input, Textarea, Button, Flex } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCreateGrant } from '../hooks';

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
  const { createGrant } = useCreateGrant();
  const navigate = useNavigate();

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
      <Box flexDirection="column" gap="42px" display="flex" width="100%" maxWidth="936px">
        <FormControl isInvalid={!!errors.title} isRequired={true}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...register('title', { required: true })} />
          {errors.title && <FormErrorMessage>Title is required</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.shortDescription} isRequired={true}>
          <FormLabel htmlFor="shortDescription">Short Description</FormLabel>
          <Input id="shortDescription" {...register('shortDescription', { required: true })} />
          {errors.shortDescription && <FormErrorMessage>Short Description is required.</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.fullText} isRequired={true}>
          <FormLabel htmlFor="fullText">Full Proposal Text</FormLabel>
          <Textarea id="fullText" {...register('fullText', { required: true })} />
          {errors.fullText && <FormErrorMessage>Full Proposal Text is required</FormErrorMessage>}
        </FormControl>
        <Flex justifyContent="flex-end" gap="12px">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Publish</Button>
        </Flex>
      </Box>
    </Box>
  );
}
