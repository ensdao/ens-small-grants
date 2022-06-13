import { BigNumber } from 'https://cdn.skypack.dev/@ethersproject/bignumber?dts';
import { verifyTypedData } from 'https://cdn.skypack.dev/@ethersproject/wallet?dts';
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

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { method, ...body } = await req.json();

  if (method === 'create_round') {
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
  } else if (method === 'create_grant') {
    const { grantData, signature } = body;

    const recoveredAddress = verifyTypedData(domain, types, grantData, signature);

    if (recoveredAddress !== grantData.address) {
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

    const { data, error: grantError } = await supabaseClient.from('grants').insert([
      {
        round_id: grantData.roundId,
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

  return new Response('not found', { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
