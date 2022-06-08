import { Box } from '@chakra-ui/react';

export type ProgressBarProps = {
  progressNumber?: number;
  totalNumber: number;
  markers?: { title?: string; subtitle?: string; percent?: number }[];
};

function ProgressBar({ progressNumber = 0, totalNumber }: ProgressBarProps) {
  const progressPercent = (progressNumber * 100) / totalNumber;

  // TODO: add markers!

  return (
    <Box position="relative" width="100%">
      <Box width="100%" height="14px" background="white" />
      <Box
        position="absolute"
        top={0}
        width={`${progressPercent}%`}
        height="14px"
        background="linear-gradient(90deg, #8E6FFF 0%, #B87AFF 100%)"
        bgGradient="linear(to-r, #8E6FFF, #B87AFF)"
      />
    </Box>
  );
}

export default ProgressBar;
