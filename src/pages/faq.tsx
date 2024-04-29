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
          'ENS Small Grants allow the community to vote on projects to receive funding, sponsored by the Public Goods and Ecosystem Working Groups.',
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
        question: 'Understanding the Voting Process',
        answer:
          'In Rounds 1 through 9, voters participated using ENS Governance Tokens where 1 $ENS token = 1 vote. In Round 10, voting was following a Voter Card system. The $ENS governance token voting process has resumed for Round 12.',
      },
      {
        question: 'Are proposals submitted onchain?',
        answer:
          'No. The submissions are signed and stored in an offchain database, then later uploaded to Arweave. Voting takes place on Snapshot.',
      },
      {
        question: 'Are there other front ends to view or vote for small grants?',
        answer: 'Yes. Head over to [Snapshot](https://snapshot.org/#/small-grants.eth).',
      },
      {
        question: 'When is the next round?',
        answer:
          'The intention of both the Ecosystem and Public Goods Working Groups is to run one round per quarter. The exact dates will be announced on [discuss.ens.domains](https://discuss.ens.domains/).',
      },
    ],
  },
  {
    title: 'Submissions',
    content: [
      {
        question: 'What if I submitted to the wrong round?',
        answer:
          'Please get in touch with [gregskril.eth](https://twitter.com/gregskril). Administrators can move your proposal before voting is submitted to snapshot.',
      },
      {
        question: 'Is there a proposal template?',
        answer:
          'There is no required template. We encourage creativity. Consider the use of markdown to craft a well-organized proposal. [A short guide can be found here](https://www.markdownguide.org/basic-syntax/).',
      },
      {
        question: 'Can I submit more than one project?',
        answer: 'Yes, you can submit more than one project.',
      },
      {
        question: 'Can I submit the same project in multiple rounds?',
        answer:
          'Yes, you may submit the same project again in subsequent rounds, but not two rounds happening at the same time.',
      },
      {
        question: 'My submission was removed or relocated to a different Working Group Round.',
        answer:
          'Submissions may be removed if they do not fit eligibility, or relocated to their appropriate ‘Ecosystem’ or ‘Public Goods’ round. If you have concerns reach out to the respective [Working Group stewards](https://basics.ensdao.org/working-groups#ca018f3e6c944825b0e58985d060e29c).',
      },
    ],
  },
  {
    title: 'Find Out More',
    content: [
      {
        question: 'Where else can I participate?',
        answer:
          'Learn more about the Working Groups by visiting [basics.ensdao.org/working-groups](https://basics.ensdao.org/working-groups), and the ENS DAO Forum at [discuss.ens.domains](https://discuss.ens.domains/).',
      },
      {
        question: 'Is this website open source?',
        answer: 'Yes, you can [find the GitHub repo here](https://github.com/ensdao/ens-small-grants).',
      },
    ],
  },

  {
    title: 'Feedback',
    content: [
      {
        question: 'I’m having an issue. Who do I contact?',
        answer:
          'Please get in touch with [gregskril.eth](https://twitter.com/gregskril) or any [Working Group steward](https://basics.ensdao.org/working-groups#ca018f3e6c944825b0e58985d060e29c).',
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
