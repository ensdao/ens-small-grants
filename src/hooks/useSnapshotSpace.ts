import { useEffect, useState } from 'react';

export type SnapshotProposals = {
  id: string;
  title: string;
  body: string;
};

export type SnapshotSpace = {
  id: string;
  name: string;
  admins: string[];
  proposals: SnapshotProposals[];
};

const QUERY = `
    query GetSnapshotSpace($spaceId: String!) {
      space(id: $spaceId) {
        id
        name
        admins
      }

      proposals(first: 20, where: { space_in: [$spaceId] }) {
        id
        title
        body
      }
    }
`;

export function useSnapshotSpace(spaceId: string) {
  const [space, setSpace] = useState<SnapshotSpace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('https://hub.snapshot.org/grapqhl', {
          method: 'POST',
          body: JSON.stringify({ query: QUERY, variables: { spaceId } }),
          headers: {
            'content-type': 'application/json',
          },
        });

        const body = await res.json();

        setSpace({ ...body.data.space, proposals: body.data.proposals });
      } finally {
        setLoading(false);
      }
    })();
  }, [spaceId]);

  return { space, loading };
}
