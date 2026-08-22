import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
// import { Typewriter } from 'react-simple-typewriter';

const PROFESSIONAL_TITLES = [
  'Hydrologist',
  'Earth Data Scientist',
  'Remote Sensing Engineer',
  'Algorithm Developer',
];

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-width: 480px) {
    justify-content: flex-start;
    min-height: auto;
    height: auto;
    padding: calc(var(--nav-height) + 24px) 0 80px;
  }

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: calc(var(--nav-height) + 24px);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
    min-height: 1.8em;

    .typewriter-word {
      color: var(--green);
    }

    .cursor {
      display: inline-block;
      margin-left: 2px;
      color: var(--green);
      animation: blink 1s steps(1) infinite;
    }
  }

  h2.big-heading,
  h3.big-heading {
    @media (max-width: 480px) {
      font-size: clamp(32px, 10vw, 40px);
      line-height: 1.08;
    }
  }

  h3.big-heading {
    @media (max-width: 480px) {
      min-height: 2.25em;
    }
  }

  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }

    50%,
    100% {
      opacity: 0;
    }
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;

    a {
      display: inline;
      text-decoration: none;

      &:after {
        display: none;
      }

      &:hover,
      &:focus-visible {
        text-decoration: underline;
        text-underline-offset: 0.2em;
      }
    }
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(PROFESSIONAL_TITLES[0]);
      return;
    }

    const currentTitle = PROFESSIONAL_TITLES[titleIndex];
    const isTypingComplete = displayText === currentTitle;
    const isDeletingComplete = displayText === '';

    let timeoutDelay = isDeleting ? 45 : 90;

    if (isTypingComplete && !isDeleting) {
      timeoutDelay = 1300;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && !isTypingComplete) {
        setDisplayText(currentTitle.slice(0, displayText.length + 1));
        return;
      }

      if (!isDeleting && isTypingComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && !isDeletingComplete) {
        setDisplayText(currentTitle.slice(0, displayText.length - 1));
        return;
      }

      setIsDeleting(false);
      setTitleIndex((titleIndex + 1) % PROFESSIONAL_TITLES.length);
    }, timeoutDelay);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, prefersReducedMotion, titleIndex]);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Shahzaib Khan.</h2>;
  const three = (
    <h3 className="big-heading">
      I am a <span className="typewriter-word">{displayText}</span>
      {!prefersReducedMotion && <span className="cursor">|</span>}
    </h3>
  );
  // const three = (
  //   <h3 className="big-heading">
  //     I am a{' '}
  //     <span style={{ color: 'var(--green)' }}>
  //       <Typewriter
  //         words={['Hydrologist.', 'Researcher.', 'Problem Solver.']}
  //         loop={true}
  //         typeSpeed={100}
  //         deleteSpeed={50}
  //         delaySpeed={1000}
  //         cursor
  //         cursorStyle="_"
  //       />
  //     </span>
  //   </h3>
  // );
  const four = (
    <>
      <p>
        I build <strong>satellite and model-driven decision-support systems</strong> for water,
        climate, agriculture, and environmental management, combining Earth observations, climate
        data, and geospatial modeling into scalable tools for real-world decision-making. My work
        focuses on operational water intelligence, uncertainty-aware modeling, and deployable
        systems that move science from research into use by stakeholders across multiple countries.
      </p>

      <p>
        I hold a Ph.D. in{' '}
        <strong>Civil & Environmental Engineering, with a minor in Data Science</strong>, from the
        University of Washington, where I conducted research in the{' '}
        <a href="https://saswe.net/" target="_blank" rel="noreferrer">
          SASWE Lab
        </a>
        . My doctoral work was recognized with the{' '}
        <span className="accent-highlight">
          <a
            href="https://www.ce.washington.edu/news/article/2026-06-05/honors-awards#:~:text=Shahzaib%20Khan%20(CEE%20Ph.D.%20'26)%20received%20the%20Ronald%20and%20Mary%20Nece%20Endowed%20Fellowship"
            target="_blank"
            rel="noreferrer">
            2026 Ronald and Mary Nece Endowed Fellowship
          </a>
        </span>
        , awarded annually to a{' '}
        <strong>top Ph.D. student in UW&apos;s Hydrology &amp; Hydrodynamics program</strong>
        based on dissertation, scholarship, and academic performance.
      </p>
    </>
  );
  // const five = (
  //   <a
  //     className="email-link"
  //     href="https://www.newline.co/courses/build-a-spotify-connected-app"
  //     target="_blank"
  //     rel="noreferrer">
  //     Check out my course!
  //   </a>
  // );

  const items = [one, two, three, four]; //, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
