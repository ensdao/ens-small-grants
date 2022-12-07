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

export default function BackButton({
  title,
  text,
  reverse,
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'title'> & {
  title?: React.ReactNode;
  text?: string;
  reverse?: boolean;
}) {
  return (
    <Container>
      <Wrapper
        style={{
          flexDirection: reverse ? 'row-reverse' : 'row',
        }}
      >
        <Link {...props}>
          <BackButtonContainer
            style={{
              flexDirection: reverse ? 'row-reverse' : 'row',
            }}
          >
            <ArrowCircleSVG
              style={{
                transform: reverse ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            />
            <Typography>{text || 'Back'}</Typography>
          </BackButtonContainer>
        </Link>
        {title}
      </Wrapper>
    </Container>
  );
}

export const BackButtonWithSpacing = styled(BackButton)(
  ({ theme }) => css`
    margin-top: ${theme.space['4']};

    ${mq.md.min(css`
      margin-top: 0;
    `)}
  `
);
