module.exports = {
  email: 'khan.shahzaib1007[AT]gmail.com',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/shahzaib1007',
    },
    // {
    //   name: 'Instagram',
    //   url: 'https://www.instagram.com/bchiang7',
    // },
    // {
    //   name: 'Twitter',
    //   url: 'https://twitter.com/bchiang7',
    // },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/shahzaib-k1007',
    },
    {
      name: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=eVEMjKQAAAAJ&hl=en&oi=ao',
    },
    {
      name: 'ORCID',
      url: 'https://orcid.org/0000-0002-0851-0385',
    },
    // {
    //   name: 'Codepen',
    //   url: 'https://codepen.io/bchiang7',
    // },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Research',
      url: '/#research',
    },
    {
      name: 'Publications',
      url: '/#jobs',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
    black: '#000000',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
