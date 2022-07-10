import { BigNumber } from 'https://cdn.skypack.dev/@ethersproject/bignumber?dts';
import { verifyTypedData } from 'https://cdn.skypack.dev/@ethersproject/wallet?dts';
import Arweave from 'https://cdn.skypack.dev/arweave@1.11.4?dts';
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

import { corsHeaders } from '../_shared/corsHeaders.ts';
import { supabaseClient } from '../_shared/supabaseClient.ts';

const domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 1,
};

const types = {
  Grant: [
    { name: 'address', type: 'address' },
    { name: 'roundId', type: 'uint256' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'fullText', type: 'string' },
  ],
};
const snapshotTypes = {
  CreateSnapshotRequest: [{ name: 'roundId', type: 'uint256' }],
};

// temporary, hardcoded "admins" for web2 service
const adminAddresses = new Set(['0x9B6568d72A6f6269049Fac3998d1fadf1E6263cc'].map(x => x.toLowerCase()));

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { method, ...body } = await req.json();

  switch (method) {
    case 'create_round': {
      const { data, error } = await supabaseClient.from('rounds').insert([
        {
          title: body.title,
          description: body.description,
          creator: body.creator,
          allocation_token_amount: body.allocationTokenAmount,
          allocation_token_address: body.allocationTokenAddress,
          max_winner_count: body.maxWinnerCount,
          proposal_start: BigNumber.from(body.proposalStart).toNumber(),
          proposal_end: BigNumber.from(body.proposalEnd).toNumber(),
          voting_start: BigNumber.from(body.votingStart).toNumber(),
          voting_end: BigNumber.from(body.votingEnd).toNumber(),
        },
      ]);

      if (error) {
        return new Response(JSON.stringify(error), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    case 'create_grant': {
      const { grantData, signature } = body;

      const recoveredAddress = verifyTypedData(domain, types, grantData, signature);

      const address = recoveredAddress.toLowerCase();

      if (address !== grantData.address) {
        return new Response(JSON.stringify({ message: 'invalid signature ' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: rounds, error } = await supabaseClient.from('rounds').select().eq('id', grantData.roundId);

      if (error) {
        return new Response(JSON.stringify(error), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (rounds.length !== 1) {
        return new Response(JSON.stringify({ message: 'could not find round' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await supabaseClient.from('grants').update({ deleted: true }).eq('proposer', address);

      const { data, error: grantError } = await supabaseClient.from('grants').insert([
        {
          round_id: grantData.roundId,
          proposer: address,
          title: grantData.title,
          description: grantData.description,
          full_text: grantData.fullText,
        },
      ]);

      if (grantError) {
        return new Response(JSON.stringify(grantError), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    case 'create_snapshot': {
      const { data, signature } = body;

      const recoveredAddress = verifyTypedData(domain, snapshotTypes, data, signature);

      if (!adminAddresses.has(recoveredAddress.toLowerCase())) {
        return new Response('not authorized', { status: 401, headers: { ...corsHeaders } });
      }

      const { data: grants, error } = await supabaseClient.from('grants').select().eq('round_id', data.roundId);

      if (error) {
        return new Response(JSON.stringify(error), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const grantsData = grants.map(grant => ({
        proposer: grant.proposer,
        title: grant.title,
        description: grant.description,
        fullText: grant.full_text,
      }));

      const arweaveKeyData = Deno.env.get('ARWEAVE_KEY');

      if (!arweaveKeyData) {
        return new Response('no arweave key set', { status: 400, headers: { ...corsHeaders } });
      }

      const arweaveKey = JSON.parse(atob(arweaveKeyData));

      const transaction = await arweave.createTransaction({ data: JSON.stringify(grantsData) }, arweaveKey);
      transaction.addTag('Content-Type', 'application/json');
      transaction.addTag('App-Name', 'ENS-Small-Grants-v1');

      await arweave.transactions.sign(transaction, arweaveKey);

      const uploader = await arweave.transactions.getUploader(transaction);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
      }

      return new Response(JSON.stringify({ arweaveId: transaction.id }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    default: {
      return new Response('not found', {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
});
