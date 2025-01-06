import { css } from 'styled-components';

const variables = css`
  :root {
    /* Dark Theme Variables */
    --dark-navy-dark: #020c1b;
    --navy-dark: #0a192f;
    --light-navy-dark: #112240;
    --lightest-navy-dark: #233554;
    --navy-shadow-dark: rgba(2, 12, 27, 0.7);
    --dark-slate-dark: #495670;
    --slate-dark: #8892b0;
    --light-slate-dark: #a8b2d1;
    --lightest-slate-dark: #ccd6f6;
    --white-dark: #e6f1ff;
    --green-dark: #64ffda;
    --black-dark: #000000;
    --logo-fill-dark: #000000; /* Logo fill color for dark theme */
    --logo-stroke-dark: #64ffda; /* Logo stroke color for dark theme */

    /* Light Theme Variables */
    --dark-navy-light: #ffffff;
    --navy-light: rgb(119, 120, 129);
    --light-navy-light: rgb(28, 30, 36);
    --lightest-navy-light: #dcdcdc;
    --navy-shadow-light: rgba(0, 0, 0, 0.1);
    --dark-slate-light: #8892b0;
    --slate-light: #495670;
    --light-slate-light: #8a817c;
    --lightest-slate-light: #000000;
    --white-light: #000000;
    --green-light: rgb(75, 76, 81);
    --black-light: #ffffff;
    --logo-fill-light: #ffffff; /* Logo fill color for light theme */
    --logo-stroke-light: #000000; /* Logo stroke color for light theme */

    /* Default Variables (Initially Dark Theme) */
    --dark-navy: var(--dark-navy-dark);
    --navy: var(--navy-dark);
    --light-navy: var(--light-navy-dark);
    --lightest-navy: var(--lightest-navy-dark);
    --navy-shadow: var(--navy-shadow-dark);
    --dark-slate: var(--dark-slate-dark);
    --slate: var(--slate-dark);
    --light-slate: var(--light-slate-dark);
    --lightest-slate: var(--lightest-slate-dark);
    --white: var(--white-dark);
    --green: var(--green-dark);
    --black: var(--black-dark);
    --logo-fill: var(--logo-fill-dark);
    --logo-stroke: var(--logo-stroke-dark);

    /* Other Variables */
    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
