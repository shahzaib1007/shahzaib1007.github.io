import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
// import { Typewriter } from 'react-simple-typewriter';

const PROFESSIONAL_TITLES = [
  'Earth Data Scientist',
  'Hydrologist',
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
        I build satellite-driven systems for water, climate, agriculture, and environmental
        decision-making. My work focuses on designing scalable pipelines that integrate satellite
        and climate data, developing geospatial systems used by stakeholders across multiple
        countries, and delivering uncertainty-aware solutions built for real-world deployment. I am
        currently pursuing my PhD at the{' '}
        <a href="https://saswe.net/" target="_blank" rel="noreferrer">
          SASWE Labs
        </a>{' '}
        at the University of Washington, Seattle, where my goal is to turn Earth observation
        research into deployable systems for operational water and environmental management.
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
