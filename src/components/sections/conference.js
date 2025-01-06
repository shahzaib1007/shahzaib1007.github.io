import React, { useRef, useEffect, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
// import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
// import { Layout } from '@components';
// import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 30px auto;
  .center-page {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  }
  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-md);
        font-weight: 100;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .bold {
    font-weight: 700;
    // font-size: var(--fz-lg);
    color: var(--white);
  }
`;

const Conference = () => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/conferences/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              date
              title
              conference_type
            }
          }
        }
      }
    }
  `);
  const projects = data.allMarkdownRemark.edges;
  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [rowsToShow, setRowsToShow] = useState(7); // Default to showing 7 rows

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  const handleRowsChange = e => {
    setRowsToShow(Number(e.target.value));
  };

  const formatTitle = (title, conference_type) =>
    // Use replace to wrap "S. Khan" in bold and append conference_type with styling
    `${title.replace(/S\. Khan/g, '<span class="bold">S. Khan</span>')} 
    <span class="bold">${conference_type}</span>`;

  return (
    <StyledTableContainer ref={revealTable}>
      {/* <h2 ref={revealTitle} style={{ color: 'var(--white)' }}>Conferences and Talks</h2>  */}
      <div className="center-page">
        <h2 ref={revealTitle}>Conferences and Talks</h2>
      </div>
      <div className="controls">
        <label htmlFor="rows">Show rows: </label>
        <select id="rows" value={rowsToShow} onChange={handleRowsChange}>
          <option value={7}>7</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={projects.length}>All</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            {/* <th className="hide-on-mobile">Made at</th>
            <th className="hide-on-mobile">Built with</th> */}
            {/* <th>Links</th> */}
          </tr>
        </thead>
        <tbody>
          {projects.slice(0, rowsToShow).map(({ node }, i) => {
            const { title, conference_type } = node.frontmatter;

            return (
              <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                <td>{i + 1}</td>
                {/* <td className="overline year">{new Date(date).getFullYear()}</td> */}
                <td
                  className="title"
                  dangerouslySetInnerHTML={{ __html: formatTitle(title, conference_type) }}></td>
                {/* <td className="company hide-on-mobile">{company || '—'}</td>
                <td className="tech hide-on-mobile">
                  {tech?.map((item, i) => (
                    <span key={i}>
                      {item}
                      {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                    </span>
                  ))}
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </StyledTableContainer>
  );
};

Conference.propTypes = {};

export default Conference;
