import styled from "styled-components"

export const Label = styled("label")`
  margin: 0.5em 0.5em;
  font-size: 2em;
  display: grid;
  grid-template-columns: 1em auto;
  color: ${p => p.theme.color};
  gap: 0.5em;

  & > input[type="radio"] {
    position: relative;
    top: 0.2em;
    appearance: none;
    margin: 0;
    font: inherit;
    width: 1em;
    height: 1em;
    border: none;
    display: grid;
    place-content: center;

    &:after {
      content:"";
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 1em;
      height: 1em;
      background-color: ${p => p.theme.uiBgColor};
      clip-path: polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 1em;
      height: 1em;
      border: none;
      background-color: ${p => p.theme.color};
      transition: 120ms transform ease-in-out;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
    }

    &:checked::before {
      transform: scale(1);
    }
  }
`