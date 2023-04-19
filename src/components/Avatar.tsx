import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 100rem;
  overflow: hidden;
  line-height: 0;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
`;

export function Avatar({ src, label }: { src?: string | undefined; label: string }) {
  return (
    <Wrapper>
      <Image
        src={src === undefined ? '/av-default.png' : src}
        alt={label}
        decoding="async"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.src = '/av-default.png';
        }}
      />
    </Wrapper>
  );
}
