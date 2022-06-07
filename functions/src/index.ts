/// <reference types="@cloudflare/workers-types" />

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Path } from 'path-parser';

export class FundingRound {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (routes.rounds.test(url) && request.method === 'POST') {
      // setting up round
      const body: { id: string; name: string; description?: string } = await request.json();
      this.state.storage.put('metadata', {
        id: body.id,
        name: body.name,
        description: body.description,
      });

      return new Response(JSON.stringify({ id: body.id, name: body.name, description: body.description }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    } else if (routes.round.test(url) && request.method === 'GET') {
      const metadata = await this.state.storage.get('metadata');

      if (metadata) {
        return new Response(JSON.stringify(metadata), { status: 200, headers: { 'content-type': 'application/json' } });
      }
    }

    return new Response('', { status: 404 });
  }
}

const routes = {
  rounds: new Path('/rounds'),
  round: new Path('/rounds/:id'),
};

export type Env = {
  FUNDING_ROUNDS: DurableObjectNamespace;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (routes.rounds.test(url)) {
      if (request.method === 'GET') {
        // list rounds
      } else if (request.method === 'POST') {
        // create round
        const body: { id?: string } = await request.json();

        if (!body.id) {
          return new Response('an `id` must be specified', { status: 400 });
        }

        const id = env.FUNDING_ROUNDS.idFromName(body.id);
        const round = env.FUNDING_ROUNDS.get(id);

        return round.fetch(request);
      }
    } else if (routes.round.test(url)) {
      const { id: roundId } = routes.round.test(url);
      const id = env.FUNDING_ROUNDS.idFromName(roundId);
      const round = env.FUNDING_ROUNDS.get(id);

      return round.fetch(request);
    }

    return new Response('invalid route', { status: 404 });
  },
};
