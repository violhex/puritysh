'use client';

import { ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import { createGlobalStyle } from 'styled-components';
import { styleReset } from 'react95';
import '@react95/icons/icons.css';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  body {
    font-family: 'ms_sans_serif';
    background: teal;
  }
`;

export default function React95ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
} 