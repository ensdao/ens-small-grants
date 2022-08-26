import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Anchor = styled(NavLink)(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: bold;

    transition: 0.15s all ease-in-out;

    &:hover {
      filter: brightness(1.1);
    }

    &[aria-current]:not([aria-current='false']) {
      color: ${theme.colors.accent};
    }
  `
);

export default Anchor;
