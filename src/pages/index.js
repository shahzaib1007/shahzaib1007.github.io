import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Layout,
  Hero,
  About,
  Research,
  Publication,
  Conference,
  Featured,
  Projects,
  Contact,
} from '@components'; // Adding Research component

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    const nextThemeIsDark = !isDarkTheme;
    setIsDarkTheme(nextThemeIsDark);

    const themeType = nextThemeIsDark ? 'dark' : 'light';

    // List of default variables to update
    const variables = [
      '--dark-navy',
      '--navy',
      '--light-navy',
      '--lightest-navy',
      '--navy-shadow',
      '--dark-slate',
      '--slate',
      '--light-slate',
      '--lightest-slate',
      '--white',
      '--green',
      '--black',
      '--logo-fill',
      '--logo-stroke',
    ];

    // Update variables to point to the respective theme type
    variables.forEach(variable => {
      const newValue = `var(${variable}-${themeType})`;
      document.documentElement.style.setProperty(variable, newValue);
    });
  };

  return (
    <Layout location={location} toggleTheme={toggleTheme}>
      <StyledMainContainer className="fillHeight">
        <Hero />
        <About />
        {/* <Jobs /> */}
        <Research />
        <Publication />
        <Conference />
        <Featured />
        <Projects />
        <Contact />
      </StyledMainContainer>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
