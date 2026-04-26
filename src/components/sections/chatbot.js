import React, { useEffect, useMemo, useRef, useState } from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import styled from 'styled-components';
import { email, socialMedia } from '@config';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'my',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'what',
  'where',
  'who',
  'with',
  'you',
]);

const SUGGESTIONS = [
  'What do you research?',
  'What are your main projects?',
  'What papers should I know?',
  'How can I contact you?',
];

const PROFILE_SUMMARY =
  'I am Shahzaib Khan, a hydrologist and earth data scientist working on satellite remote sensing, water resources monitoring, irrigation decision support, and geospatial analytics.';

const KNOWLEDGE = {
  education: [
    'PhD in Civil and Environmental Engineering at the University of Washington (in progress).',
    'MS in Civil and Environmental Engineering at the University of Washington.',
    'Background in geospatial and remote-sensing driven hydrology research.',
  ],
  background: [
    'PhD researcher at the University of Washington focused on data science for water systems.',
    'Core interests: satellite remote sensing, hydrology, water resources, and geospatial AI.',
    'I like turning environmental data into practical tools that help researchers and operators make better decisions.',
  ],
  research: [
    'Satellite-based monitoring of surface water, lakes, reservoirs, and wetlands.',
    'Irrigation optimization and decision support for water allocation.',
    'Hydrological modeling, uncertainty analysis, and scalable geospatial workflows.',
  ],
  projects: [
    {
      title: 'sD.R.I.P.S',
      summary:
        'A cloud-based irrigation optimization package that helps estimate water supply needs from satellite-informed crop water demand.',
    },
    {
      title: 'Optimal Gauge Network Design',
      summary:
        'A framework for placing the minimum number of gauges strategically to represent surface water volume change.',
    },
    {
      title: 'Surface Water Tracker in North-West Bangladesh',
      summary:
        'A Sentinel-1 based monitoring system for detecting surface water and estimating regional volume dynamics.',
    },
  ],
  publications: [
    {
      title: 'sD.R.I.P.S package',
      summary:
        'An open-source package for satellite-informed surface water irrigation optimization.',
    },
    {
      title: 'GRILSS',
      summary:
        'A reservoir sedimentation data curation effort focused on building a global dataset for decision support.',
    },
  ],
};

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: 'Hi! I am Shahzaib\'s AI. I can help with questions about my research, publications, projects, and collaboration.',
  },
];

const CHAT_API_URL =
  process.env.GATSBY_RAG_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8787/chat' : '/api/chat');

const StyledWidget = styled.div`
  position: fixed;
  right: 96px;
  bottom: 24px;
  z-index: 30;
  isolation: isolate;

  @media (max-width: 1080px) {
    right: 72px;
    bottom: 18px;
  }

  @media (max-width: 768px) {
    right: 10px;
    bottom: 10px;
  }
`;

const Backdrop = styled.button`
  position: fixed;
  inset: 0;
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  z-index: -1;
`;

const ChatShell = styled.div`
  width: clamp(320px, 34vw, 440px);
  max-height: min(640px, 76vh);
  margin-bottom: 10px;
  border: 1px solid var(--lightest-navy);
  border-radius: 22px;
  background: var(--dark-navy);
  box-shadow: 0 18px 40px -24px var(--navy-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: popIn 180ms ease-out;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 640px) {
    width: min(100%, calc(100vw - 16px));
    max-height: 78vh;
    margin-bottom: 8px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid var(--lightest-navy);
  background: var(--navy);

  .title {
    margin: 0;
    font-size: 12px;
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
  }

  button {
    ${({ theme }) => theme.mixins.smallButton};
    padding: 4px 10px;
    color: var(--lightest-slate);
  }
`;

const MessageList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 14px;
  min-height: 140px;
  max-height: 340px;
  flex: 1;
  overflow-y: auto;

  li + li {
    margin-top: 12px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 255, 218, 0.35);
    border-radius: 999px;
  }
`;

const MessageBubble = styled.div`
  width: fit-content;
  max-width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  white-space: pre-wrap;
  line-height: 1.45;
  font-size: 13px;
  color: ${({ role }) => (role === 'assistant' ? 'var(--lightest-slate)' : 'var(--dark-navy)')};
  background: ${({ role }) => (role === 'assistant' ? 'var(--light-navy)' : 'var(--green)')};
  border: 1px solid
    ${({ role }) => (role === 'assistant' ? 'var(--lightest-navy)' : 'rgba(2, 12, 27, 0.12)')};
  margin-left: ${({ role }) => (role === 'assistant' ? '0' : 'auto')};
  box-shadow: ${({ role }) =>
    role === 'assistant' ? 'none' : '0 8px 16px -14px rgba(100, 255, 218, 0.5)'};
`;

const SuggestionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 14px 12px;
`;

const SuggestionButton = styled.button`
  ${({ theme }) => theme.mixins.smallButton};
  font-size: var(--fz-xxs);
  padding: 6px 10px;
  border-color: var(--lightest-navy);
  color: var(--lightest-slate);

  &:hover,
  &:focus {
    background: var(--light-navy);
  }
`;

const ChatForm = styled.form`
  display: flex;
  gap: 10px;
  padding: 0 14px 14px;

  @media (max-width: 640px) {
    flex-direction: column;
  }

  input {
    flex: 1;
    border-radius: 10px;
    border: 1px solid var(--lightest-navy);
    background-color: var(--dark-navy);
    color: var(--lightest-slate);
    padding: 12px;
    font-size: var(--fz-sm);

    &:focus {
      outline: none;
      border-color: var(--green);
    }
  }

  button {
    ${({ theme }) => theme.mixins.bigButton};
    min-width: 110px;
    margin-top: 0;
  }

  @media (max-width: 640px) {
    button {
      width: 100%;
    }
  }
`;

const ToggleButton = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  width: 64px;
  height: 64px;
  padding: 0;
  position: relative;
  border: 0;
  background: transparent;
  box-shadow: none;
  transition: transform 0.2s ease;
  transform: translateZ(0);
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    border: 2px solid var(--cat-color);
    background: radial-gradient(circle, var(--cat-halo) 0%, transparent 62%), var(--dark-navy);
    box-shadow: 0 0 0 5px var(--cat-halo), 0 0 28px var(--cat-halo),
      0 12px 26px -18px var(--navy-shadow);
    pointer-events: none;
    transition: var(--transition);
  }

  &:hover,
  &:focus {
    transform: translateY(-1px) scale(1.02) translateZ(0);
    outline: none;
    box-shadow: none;
  }

  &:hover::before,
  &:focus::before {
    box-shadow: 0 0 0 6px var(--cat-halo-strong), 0 0 36px var(--cat-halo-strong),
      0 14px 28px -18px var(--navy-shadow);
  }
`;

const CatGlyph = styled.span`
  position: relative;
  z-index: 1;
  width: 60px;
  height: 56px;
  display: block;
  background: var(--cat-color);
  mask: var(--cat-mask-url) center / contain no-repeat;
  -webkit-mask: var(--cat-mask-url) center / contain no-repeat;
  filter: drop-shadow(0 2px 4px rgba(2, 12, 27, 0.18));
  transition: var(--transition);

  @media (max-width: 640px) {
    width: 54px;
    height: 50px;
  }
`;

const normalize = value => (value || '').toLowerCase();

const tokenize = value =>
  normalize(value)
    .match(/[a-z0-9]+/g)
    ?.filter(token => token.length > 2 && !STOP_WORDS.has(token)) || [];

const getCategoryFromPath = filePath => {
  if (!filePath) {
    return 'work';
  }

  const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');

  if (normalizedPath.includes('/content/publications/')) {
    return 'publication';
  }
  if (normalizedPath.includes('/content/projects/')) {
    return 'project';
  }
  if (normalizedPath.includes('/content/featured/')) {
    return 'tool';
  }
  if (normalizedPath.includes('/content/research/')) {
    return 'research';
  }
  if (normalizedPath.includes('/content/conferences/')) {
    return 'conference';
  }
  if (normalizedPath.includes('/content/jobs/')) {
    return 'experience';
  }

  return 'work';
};

const buildProfileAnswer = question => {
  const query = normalize(question);
  const github = socialMedia.find(item => normalize(item.name).includes('github'));
  const linkedin = socialMedia.find(item => normalize(item.name).includes('linkedin'));
  const scholar = socialMedia.find(item => normalize(item.name).includes('scholar'));
  const orcid = socialMedia.find(item => normalize(item.name).includes('orcid'));

  if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
    return `You can reach me at ${email.replace(
      '[AT]',
      '@',
    )} or through the Contact section on this page.`;
  }

  if (query.includes('github') && github) {
    return `You can find my code and repositories on GitHub: ${github.url}`;
  }

  if (query.includes('linkedin') && linkedin) {
    return `You can connect with me on LinkedIn: ${linkedin.url}`;
  }

  if ((query.includes('google scholar') || query.includes('scholar')) && scholar) {
    return `My Google Scholar profile is here: ${scholar.url}`;
  }

  if (query.includes('orcid') && orcid) {
    return `My ORCID record is available here: ${orcid.url}`;
  }

  if (
    query.includes('who are you') ||
    query.includes('about you') ||
    query.includes('introduce') ||
    query.includes('what do you do')
  ) {
    return PROFILE_SUMMARY;
  }

  return null;
};

const buildSentenceList = items => {
  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

const buildCategoryAnswer = question => {
  const query = normalize(question);

  if (
    query.includes('education') ||
    query.includes('study') ||
    query.includes('degree') ||
    query.includes('university') ||
    query.includes('phd') ||
    query.includes('ms')
  ) {
    return `My education background includes ${KNOWLEDGE.education[0]} Before that, I completed ${KNOWLEDGE.education[1]} and built my work around ${KNOWLEDGE.education[2]}`;
  }

  if (query.includes('research') || query.includes('expertise') || query.includes('work on')) {
    return `Great question. I mainly work on ${buildSentenceList(
      KNOWLEDGE.research.map(item => item.toLowerCase()),
    )}.`;
  }

  if (query.includes('project') || query.includes('tool') || query.includes('built')) {
    const featuredProjects = KNOWLEDGE.projects.slice(0, 3);
    return `Some of my key projects are ${buildSentenceList(
      featuredProjects.map(item => item.title),
    )}. If you want, I can go deeper into any one of them.`;
  }

  if (query.includes('paper') || query.includes('publication') || query.includes('publish')) {
    return `A good starting point is my work on ${buildSentenceList(
      KNOWLEDGE.publications.map(item => item.title),
    )}. I can also point you to specific links if you tell me which topic you care about most.`;
  }

  if (query.includes('about') || query.includes('background') || query.includes('who are you')) {
    return `${PROFILE_SUMMARY} I am currently a PhD researcher at the University of Washington, and my focus is building practical data-driven tools for water systems.`;
  }

  if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
    return `You can reach me at ${email.replace(
      '[AT]',
      '@',
    )}. If you want a quick route, use the Contact section on the homepage.`;
  }

  if (query.includes('github') || query.includes('code')) {
    const github = socialMedia.find(item => normalize(item.name).includes('github'));
    return github
      ? `My code and open-source work are here: ${github.url}`
      : 'I do not have a GitHub link listed right now.';
  }

  if (query.includes('linkedin')) {
    const linkedin = socialMedia.find(item => normalize(item.name).includes('linkedin'));
    return linkedin
      ? `You can connect with me on LinkedIn: ${linkedin.url}`
      : 'LinkedIn is not listed.';
  }

  if (query.includes('scholar')) {
    const scholar = socialMedia.find(item => normalize(item.name).includes('scholar'));
    return scholar ? `My Google Scholar profile: ${scholar.url}` : 'Google Scholar is not listed.';
  }

  if (query.includes('orcid')) {
    const orcid = socialMedia.find(item => normalize(item.name).includes('orcid'));
    return orcid ? `My ORCID: ${orcid.url}` : 'ORCID is not listed.';
  }

  return null;
};

const detectIntent = question => {
  const query = normalize(question);

  if (query.includes('project') || query.includes('tool') || query.includes('built')) {
    return 'project';
  }
  if (query.includes('paper') || query.includes('publication') || query.includes('publish')) {
    return 'publication';
  }
  if (query.includes('research') || query.includes('expertise') || query.includes('work on')) {
    return 'research';
  }

  return 'general';
};

const rankMatches = (question, docs) => {
  const tokens = tokenize(question);
  if (!tokens.length) {
    return [];
  }

  const intent = detectIntent(question);
  const query = normalize(question);

  return docs
    .map(doc => {
      const haystack = normalize(`${doc.title} ${doc.excerpt} ${doc.body}`);
      const titleHaystack = normalize(doc.title);

      let score = 0;
      tokens.forEach(token => {
        if (titleHaystack.includes(token)) {
          score += 3;
        }
        if (haystack.includes(token)) {
          score += 1;
        }
      });

      if (intent === 'project') {
        if (doc.category === 'project') {
          score += 5;
        }
        if (doc.category === 'tool') {
          score += 6;
        }
        if (doc.category === 'publication') {
          score -= 2;
        }
      }

      if (intent === 'publication') {
        if (doc.category === 'publication') {
          score += 6;
        }
        if (doc.category === 'project' || doc.category === 'tool') {
          score -= 1;
        }
      }

      if (intent === 'research' && doc.category === 'research') {
        score += 4;
      }

      if (
        (query.includes('best') || query.includes('top') || query.includes('main')) &&
        (doc.category === 'project' || doc.category === 'tool')
      ) {
        score += 2;
      }

      if (score === 0) {
        return null;
      }

      return { ...doc, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
};

const buildDocAnswer = matches => {
  if (!matches.length) {
    return 'I could not find a strong match for that yet, but I can help with research areas, projects, publications, resume, or contact details.';
  }

  const topMatch = matches[0];
  const topLink = topMatch.external || topMatch.github;
  const topSummary = topMatch.excerpt ? topMatch.excerpt.replace(/\s+/g, ' ').trim() : '';
  const secondMatch = matches[1];
  const secondLink = secondMatch ? secondMatch.external || secondMatch.github : null;

  if (
    topMatch.category === 'publication' &&
    secondMatch &&
    secondMatch.category !== 'publication'
  ) {
    return `I found something close, but it may not be the best fit for your question. A better match is ${
      secondMatch.title
    }${secondLink ? ` (${secondLink})` : ''}.`;
  }

  return `The closest match I found is ${topMatch.title}${
    topMatch.date ? ` (${topMatch.date})` : ''
  }. ${topSummary}${topLink ? ` You can check it here: ${topLink}.` : ''}${
    secondMatch
      ? ` Another related item is ${secondMatch.title}${secondLink ? ` (${secondLink})` : ''}.`
      : ''
  }`;
};

const Chatbot = () => {
  const messageEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const data = useStaticQuery(graphql`
    query ShahzaibAiQuery {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 200) {
        nodes {
          excerpt(pruneLength: 180)
          rawMarkdownBody
          fileAbsolutePath
          frontmatter {
            title
            date
            external
            github
          }
        }
      }
    }
  `);

  const docs = useMemo(
    () =>
      data.allMarkdownRemark.nodes
        .filter(node => node.frontmatter?.title)
        .map(node => ({
          title: node.frontmatter.title,
          date: node.frontmatter.date,
          excerpt: node.excerpt,
          body: node.rawMarkdownBody,
          external: node.frontmatter.external,
          github: node.frontmatter.github,
          sourcePath: node.fileAbsolutePath,
          category: getCategoryFromPath(node.fileAbsolutePath),
        })),
    [data],
  );

  const hasUserInteracted = messages.some(message => message.role === 'user');

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const askQuestion = async question => {
    if (!question.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    const userMessage = { role: 'user', text: question.trim() };

    // Add user message immediately
    setMessages(current => [...current, userMessage]);
    setInput('');

    try {
      // Try the RAG API for a grounded answer.
      const contextDocs = rankMatches(question, docs);

      // Prepare context from top-ranked documents
      const context =
        contextDocs && contextDocs.length > 0
          ? contextDocs.map(doc => ({
            title: doc.title,
            category: doc.category,
            date: doc.date,
            excerpt: doc.excerpt,
            bodySnippet: (doc.body || '').replace(/\s+/g, ' ').trim(),
            sourcePath: doc.sourcePath,
            link: doc.external || doc.github,
          }))
          : [];

      // Prepare conversation history
      const conversationHistory = messages
        .concat(userMessage)
        .filter(msg => msg.role === 'user')
        .slice(-4)
        .map(msg => ({
          role: msg.role,
          content: msg.text,
        }));

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          context,
          conversationHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.fallback && data.answer) {
          // Use the RAG-generated answer.
          const botMessage = { role: 'assistant', text: data.answer };
          setMessages(current => [...current, botMessage]);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error calling RAG API, falling back to local logic:', error);
    }

    // Fallback to local logic
    const contextDocs = rankMatches(question, docs);
    const categoryAnswer = buildCategoryAnswer(question);
    const profileAnswer = buildProfileAnswer(question);
    const answerText = profileAnswer || categoryAnswer || buildDocAnswer(contextDocs);
    const botMessage = { role: 'assistant', text: answerText };
    setMessages(current => [...current, botMessage]);
    setIsLoading(false);
  };

  const onSubmit = event => {
    event.preventDefault();
    askQuestion(input);
  };

  return (
    <StyledWidget>
      {isOpen && (
        <>
          <Backdrop type="button" aria-label="Close chat" onClick={() => setIsOpen(false)} />

          <ChatShell role="dialog" aria-label="Shahzaib's AI chat window" aria-modal="true">
            <ChatHeader>
              <p className="title">Shahzaib's AI</p>
              <button type="button" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </ChatHeader>

            <MessageList aria-live="polite">
              {messages.map((message, index) => (
                <li key={`${message.role}-${index}`}>
                  <MessageBubble role={message.role}>{message.text}</MessageBubble>
                </li>
              ))}
              <li ref={messageEndRef} />
            </MessageList>

            {!hasUserInteracted && (
              <SuggestionRow>
                {SUGGESTIONS.map(prompt => (
                  <SuggestionButton key={prompt} type="button" onClick={() => askQuestion(prompt)}>
                    {prompt}
                  </SuggestionButton>
                ))}
              </SuggestionRow>
            )}

            <ChatForm onSubmit={onSubmit}>
              <input
                type="text"
                value={input}
                placeholder={
                  hasUserInteracted
                    ? 'Type your question…'
                    : 'Ask about research, papers, tools, or collaboration'
                }
                onChange={event => setInput(event.target.value)}
                disabled={isLoading}
                aria-label="Ask ShahzaibAI a question"
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Thinking…' : 'Ask'}
              </button>
            </ChatForm>
          </ChatShell>
        </>
      )}

      <ToggleButton
        type="button"
        onClick={() => setIsOpen(current => !current)}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        style={{ '--cat-mask-url': `url("${withPrefix('/shahzaib-ai-cat.svg')}")` }}>
        <CatGlyph aria-hidden="true" />
      </ToggleButton>
    </StyledWidget>
  );
};

export default Chatbot;
