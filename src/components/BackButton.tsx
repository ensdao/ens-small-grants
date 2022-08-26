import { ArrowCircleSVG, mq, Typography } from '@ensdomains/thorin';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Container = styled.div(
  () => css`
    width: 100%;
  `
);

const BackButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};

    color: ${theme.colors.purple};
    font-size: ${theme.fontSizes.extraLarge};

    svg {
      transform: rotate(180deg);
      width: ${theme.space['6']};
      height: ${theme.space['6']};
    }
  `
);

const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    padding: ${theme.space['4']};
    margin-top: ${theme.space['4']};

    & > *:not(a) {
      text-align: right;
      width: min-content;
      white-space: nowrap;
    }

    ${mq.md.min(css`
      padding: 0;
      margin-top: ${theme.space['8']};
    `)}
  `
);

const BackButton = ({
  title,
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'title'> & { title?: React.ReactNode }) => {
  return (
    <Container>
      <Wrapper>
        <Link {...props}>
          <BackButtonContainer>
            <ArrowCircleSVG />
            <Typography>Back</Typography>
          </BackButtonContainer>
        </Link>
        {title}
      </Wrapper>
    </Container>
  );
};

export default BackButton;
