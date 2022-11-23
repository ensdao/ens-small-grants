import { useEffect, useState } from 'react';

export type SnapshotVotes = {
  proposal: {
    title: string;
    choices: string[];
  };
  choice: number[];
};

const QUERY = `
  query Votes($voter: String!) {
    votes(
      first: 100,
      skip: 0,
      where: {
        voter: $voter,
        space_in: ["small-grants.eth"]
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      proposal {
        id
        title
        choices
      }
      choice
    }
  }
`;

export function useSnapshotVotes(address: string | undefined): {
  votes: SnapshotVotes[] | null;
  isLoading: boolean;
} {
  const [votes, setVotes] = useState<SnapshotVotes[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const voter = address?.toLowerCase() || '';

  useEffect(() => {
    if (!voter) return;
    setIsLoading(true);

    fetch('https://hub.snapshot.org/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: QUERY, variables: { voter } }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => data.data.votes)
      .then(setVotes)
      .then(() => setIsLoading(false))
      .catch(() => null);
  }, [voter]);

  return { votes, isLoading };
}
