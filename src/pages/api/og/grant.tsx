import { Grant } from '@/kysely/db';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const fontMedium = fetch(new URL('../../../assets/fonts/Satoshi-Medium.otf', import.meta.url)).then(res =>
  res.arrayBuffer()
);

const fontBold = fetch(new URL('../../../assets/fonts/Satoshi-Bold.otf', import.meta.url)).then(res =>
  res.arrayBuffer()
);

const fontBlack = fetch(new URL('../../../assets/fonts/Satoshi-Black.otf', import.meta.url)).then(res =>
  res.arrayBuffer()
);

const baseUrl = 'https://ensgrants.xyz';

export default async function handler(request: NextRequest) {
  const fontMediumData = await fontMedium;
  const fontBoldData = await fontBold;
  const fontBlackData = await fontBlack;

  try {
    const { searchParams } = new URL(request.url);
    let _id = searchParams.get('id') as string | undefined | null;

    if (!_id) {
      return new Response('Missing id', {
        status: 400,
      });
    }

    try {
      Number(_id);
    } catch (error) {
      return new Response('Invalid id', {
        status: 400,
      });
    }

    const id = Number(_id);
    const grant = await fetch(baseUrl + '/api/grant/' + id)
      .then(res => res.json())
      .then(json => {
        return json as Grant;
      })
      .catch(err => {
        console.error(err);
        return null;
      });

    if (!grant) {
      return new Response('Grant not found', {
        status: 404,
      });
    }

    const ens = await fetch(`https://api.ensideas.com/ens/resolve/${grant.proposer}`)
      .then(res => res.json())
      .then(json => {
        return json as {
          address: string | null;
          name: string;
          displayName: string;
          avatar: string | null;
        };
      })
      .catch(() => null);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Satoshi',
            width: '100%',
            height: '100%',
            maxWidth: '1200px',
            backgroundColor: '#F4F2F6',
            color: '#262626',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              position: 'absolute',
              top: '3rem',
              left: '3rem',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={baseUrl + '/logo.svg'} alt="logo" width={144} />
            <span
              style={{
                fontSize: '2.25rem',
                marginTop: '-0.3125rem',
                fontFamily: 'Satoshi-Bold',
              }}
            >
              Grants
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              position: 'absolute',
              flexDirection: 'column',
              lineHeight: 1.1,
              bottom: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 3rem 2.5rem 3rem',
              }}
            >
              <h1
                style={{
                  fontFamily: 'Satoshi-Black',
                  fontSize: grant.title.length < 13 ? '6rem' : grant.title.length > 20 ? '4rem' : '5rem',
                  margin: 0,
                  marginBottom: '1.25rem',
                }}
              >
                {grant.title}
              </h1>

              <h2
                style={{
                  fontFamily: 'Satoshi',
                  fontSize: '2.5rem',
                  maxWidth: '100%',
                  margin: '0',
                  opacity: 0.4,
                }}
              >
                {grant.description}
              </h2>
            </div>

            {ens?.displayName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100vw',
                  padding: '0.8125rem 3rem 1rem 3rem',
                  background: 'white',
                  boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.025)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ens?.avatar || baseUrl + '/av-default.png'}
                  alt=""
                  width={42}
                  style={{ borderRadius: '10rem' }}
                />
                <span style={{ fontSize: '1.5rem' }}>{ens?.displayName}</span>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Satoshi',
            data: fontMediumData,
            style: 'normal',
          },
          {
            name: 'Satoshi-Bold',
            data: fontBoldData,
            style: 'normal',
          },
          {
            name: 'Satoshi-Black',
            data: fontBlackData,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
