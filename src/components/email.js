import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { email } from '@config';
import { Side } from '@components';

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  a {
    margin: 20px auto;
    padding: 10px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: var(--fz-lg);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;

    &:hover,
    &:focus {
      transform: translateY(-3px);
    }
  }
`;

const Email = ({ isHome }) => {
  const emailBody =
    'Hi there,\n\nI\'m glad you stopped by! To prevent bots from spamming my inbox, I\'ve added \'[AT]\' to my email address. Please replace \'[AT]\' with \'@\' when contacting me.\n\nLooking forward to hearing from you!';
  const mailtoLink = `mailto:${email}?body=${encodeURIComponent(emailBody)}`;

  return (
    <Side isHome={isHome} orientation="right">
      <StyledLinkWrapper>
        <a href={mailtoLink}>{email}</a>
      </StyledLinkWrapper>
    </Side>
  );
};

Email.propTypes = {
  isHome: PropTypes.bool,
};

export default Email;
