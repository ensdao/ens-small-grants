import { mq, Heading, Typography } from '@ensdomains/thorin';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import styled, { css } from 'styled-components';

import OpenGraphElements from '../components/OpenGraphElements';
import { cardStyles } from '../components/atoms';

const PageTitle = styled(Heading)(
  ({ theme }) => css`
    padding-top: ${theme.space['8']};

    ${mq.md.max(css`
      padding-bottom: ${theme.space['4']};
    `)}
  `
);

const FaqsWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;

    & > div {
      display: flex;
      flex-direction: column;
      gap: ${theme.space['4']};
      margin-bottom: ${theme.space['8']};
    }

    h2 {
      font-size: ${theme.fontSizes['headingThree']};
    }
  `
);

const StyledFaq = styled.details(
  cardStyles,
  ({ theme }) => css`
    padding: 0;

    summary {
      padding: ${theme.space['4']};
      &:hover {
        cursor: pointer;
      }
    }
  `
);

const Question = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    font-weight: ${theme.fontWeights.bold};
    padding-left: ${theme.space['1']};
  `
);
const Answer = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    padding: ${theme.space['4']};
    padding-top: 0;
    line-height: 1.4;

    p:not(:last-child) {
      margin-bottom: ${theme.space['3']};
    }

    a {
      color: ${theme.colors.blue};

      &:hover {
        text-decoration: underline;
      }
    }
  `
);

type Content = {
  title: string;
  content: {
    question: string;
    answer: string | JSX.Element;
  }[];
};

const content: Content[] = [
  {
    title: 'Introduction',
    content: [
      {
        question: 'What are ENS Small Grants?',
        answer:
          'ENS Small Grants allow $ENS holders to vote on projects to receive funding. Sponsored by the Public Goods and Ecosystem working group, these recurring small grants award 1Ξ to your favorite projects.',
      },
      {
        question: 'What is eligible for Public Goods?',
        answer: (
          <>
            <p>
              Projects eligible for the Public Goods small grants rounds have a broader scope that benefits the entire
              Ethereum or Web3 space.
            </p>
            <p>
              Applicable projects should not be ENS-specific but may include ENS functionality. An example is ethers.js,
              a developer library that has utility throughout Web3, not only for those building with ENS.
            </p>
          </>
        ),
      },
      {
        question: 'What is eligible for Ecosystem?',
        answer: (
          <>
            <p>
              Projects eligible for the Ecosystem small grants rounds are those that build on or improve the ENS
              Ecosystem.
            </p>
            <p>
              Applicable projects are meaningfully building, creating content, or improving the ENS ecosystem. An
              example is ENSfairy.xyz, an ENS name-gifting tool that adds explicit functionality to the ENS ecosystem.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: 'How It Works',
    content: [
      {
        question: 'Is this off-chain or on-chain?',
        answer:
          'The submissions are signed with your wallet, and voting takes place off-chain using snapshot. Your voting weight is determined by the amount of ENS you hold or are delegated on-chain.',
      },
      {
        question: 'When does voting close?',
        answer:
          'The end of the voting period is displayed on each round’s page. This generally is the last day of the month at 11:59 GMT',
      },
      {
        question: 'What voting strategy is used?',
        answer:
          'Small grants use an approval voting strategy. One ENS is one vote. We also implement an ERC-20 with override that allows you to vote even if you have delegated your votes.',
      },
      {
        question: 'Will there be additional rounds?',
        answer:
          'Additional rounds may be added in the future. The goal of small grants is to be an interactive and creative process. We hope to add rounds and scale the funding amounts in the future.',
      },
    ],
  },
  {
    title: 'Submissions',
    content: [
      {
        question: 'What if I submitted to the wrong round?',
        answer:
          'Please get in touch with [coltron.eth](https://twitter.com/Coltron_eth). Administrators can move your proposal before voting is submitted to snapshot.',
      },
      {
        question: 'Is there a proposal template?',
        answer:
          'There is no required template. We encourage creativity. Consider the use of markdown to craft a well-organized proposal. [A short guide can be found here](https://www.markdownguide.org/basic-syntax/).',
      },
      {
        question: 'How do I receive winnings?',
        answer: 'Your winnings will be paid to the address that submitted the small grant proposal.',
      },
      {
        question: 'Can I submit more than one project?',
        answer: 'Yes, you can submit more than one project.',
      },
      {
        question: 'Can I submit the same project next month?',
        answer: 'Yes, you may submit the same project again in a subsequent round.',
      },
    ],
  },
  {
    title: 'Feedback',
    content: [
      {
        question: 'I’m having an issue. Who do I contact?',
        answer:
          'Please get in touch with [coltron.eth](https://twitter.com/Coltron_eth), [gregskril.eth](https://twitter.com/gregskril) or a DAO steward.',
      },
    ],
  },
];

export default function Faq() {
  return (
    <>
      <OpenGraphElements title="Frequently Asked Questions - ENS Small Grants" />

      <PageTitle level="2">Frequent Asked Questions</PageTitle>

      <FaqsWrapper>
        {content.map((section, index) => (
          <div key={index}>
            <Heading as="h2" key={index}>
              {section.title}
            </Heading>
            {section.content.map((faq, _index) => (
              <StyledFaq key={_index}>
                <summary>
                  <Question as="span">{faq.question}</Question>
                </summary>
                <Answer as="div">
                  {typeof faq.answer === 'string' ? (
                    <ReactMarkdown
                      components={{
                        a: ({ children, href }) => (
                          <a href={href} target="_blank" rel="noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {faq.answer}
                    </ReactMarkdown>
                  ) : (
                    faq.answer
                  )}
                </Answer>
              </StyledFaq>
            ))}
          </div>
        ))}
      </FaqsWrapper>
    </>
  );
}
