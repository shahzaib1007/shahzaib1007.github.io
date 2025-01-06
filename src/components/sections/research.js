import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledResearchSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;
    margin-top: 15px; // padding between tab and para
    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
  margin-top: -100px;
  margin-left: auto;
  .vision-text {
    margin-bottom: 10px;
    margin-top: -30px;

    .video-link {
      color: var(--green);
      cursor: pointer;
      text-decoration: underline;

      &:hover {
        color: var(--green-light);
      }
    }
  }

  .video-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    background: var(--dark-navy);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    border-radius: var(--border-radius);
    z-index: 1000;
    overflow: hidden;

    video {
      width: 100%;
      border-radius: var(--border-radius);
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--black);
      color: var(--white);
      border: none;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: var(--border-radius);
      font-size: var(--fz-md);
      z-index: 1001;

      &:hover {
        background: var(--green);
        color: var(--dark-navy);
      }
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  flex-wrap: wrap; /* Allows tabs to wrap on smaller screens */
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }
  @media (max-width: 600px) {
    .inner {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
    }

    .inner::-webkit-scrollbar {
      display: none; /* Hide scrollbars for better UX */
    }
  }
  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Research = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef(null);
  const handleVideoToggle = () => {
    if (isVideoVisible && videoRef.current) {
      // Pause and reset video when closing
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoVisible(!isVideoVisible);
  };

  const handleCloseClick = e => {
    e.stopPropagation(); // Prevent event propagation from the button
    handleVideoToggle();
  };
  const data = useStaticQuery(graphql`
    query {
      research: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/research/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
            }
            html
          }
        }
      }
    }
  `);

  const researchData = data.research.edges;

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledResearchSection id="research" ref={revealContainer}>
      <h2 className="numbered-heading">My Vision</h2>
      <p className="vision-text">
        Imagine a world where water cycle data is democratized, providing every
        individual—regardless of background, nationality, or status—with equitable access to
        actionable insights about water resources. This information empowers people to make informed
        decisions, manage resources sustainably, and contribute to a balanced future for generations
        and nature. Equity-based access to water resources isn’t just essential for individual
        well-being; it is critical for a nation's prosperity and sustainability. Water, as a
        resource, has the power to unite or divide, and its fair management is key to preventing
        conflict and fostering harmony (
        <span
          className="video-link"
          role="button"
          tabIndex="0"
          onClick={handleVideoToggle}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleVideoToggle();
            }
          }}>
          see this video
        </span>
        ). This is the vision I tirelessly pursue, striving step by step to turn it into reality.
      </p>
      {isVideoVisible && (
        <div className="video-container">
          <button className="close-button" onClick={handleCloseClick}>
            Close
          </button>
          <iframe
            width="100%"
            height="450"
            src="https://www.youtube.com/embed/2BZslnorTEs?rel=0"
            title="YouTube Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        </div>
      )}

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Research tabs" onKeyDown={e => onKeyDown(e)}>
          {researchData &&
            researchData.map(({ node }, i) => {
              const { company } = node.frontmatter;
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  ref={el => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}>
                  <span>{company}</span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {researchData &&
            researchData.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, url, company, range } = frontmatter;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link">
                          {company}
                        </a>
                      </span>
                    </h3>

                    <p className="range">{range}</p>

                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledResearchSection>
  );
};

export default Research;
