import React, { useState, useEffect } from 'react';
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
} from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State to manage theme, false for light default

  const updateThemeVariables = themeType => {
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

    variables.forEach(variable => {
      const newValue = `var(${variable}-${themeType})`;
      document.documentElement.style.setProperty(variable, newValue);
    });
  };

  const toggleTheme = () => {
    const nextThemeIsDark = !isDarkTheme;
    setIsDarkTheme(nextThemeIsDark);
    updateThemeVariables(nextThemeIsDark ? 'dark' : 'light');
  };

  // Set default theme on first render
  useEffect(() => {
    updateThemeVariables(isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <Layout location={location} toggleTheme={toggleTheme}>
      <StyledMainContainer className="fillHeight">
        <Hero />
        <About />
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
