const hero_header = 'Learn better with Uni';
const paragraph =
  'Achieve the highest results in studying using the most powerful flashcards application and do not worry about forgetting with flexible spaced repetition';
const btnText = 'Register for free';

const features_header = 'Features';
const features = [
  {
    subheader: 'Spaced repetition',
    description:
      'According to many studies people forget up to 80% of information they learn. \n' +
      '\n' +
      'Different techniques of spaced repetition will help you to consolidate your memories.',
  },
  {
    subheader: 'High flexibility',
    description:
      'Various types of information require different representation to ease learning. \n' +
      '\n' +
      'You can create your own flashcards and integrate images and sounds inside them.',
  },
  {
    subheader: 'Full control',
    description:
      'It is really important to stick to a systematic approach when  learning.\n' +
      '\n' +
      'Uni will organize your study process to help you minimize learning time.',
  },
  {
    subheader: 'Major focus',
    description:
      'Focus more on learning problematical stuff rather than just repeating.\n' +
      '\n' +
      'Uni highlights weaknesses in your memories and lets you deal with them.',
  },
];

const testimonialsHeader = 'Testimonials';
const testimonials = [
  {
    image: 'man',
    review:
      'This application really helps me to deal with huge amount of information which I get at my university. I could not imagine what I would do without it.',
    name: 'Simon Leuner',
  },
  {
    image: 'woman',
    review:
      'Uni helped me to get rid of fear that I forget important information. Now I can track progress of every piece of my knowledge with easily. What a great tool!',
    name: 'Eva Ruber',
  },
  {
    image: 'man-2',
    review: 'Wow! I am really happy to use this application everyday. 12 out of 10.',
    name: 'Egor Veselov',
  },
];
const pricingHeader = 'Pricing';
const prices = [
  {
    header: 'basic',
    features: ['Unlimited flashcards', 'Study organization', 'Error tracking', 'Knowledge review'],
    btnText: 'Register for free',
  },
  {
    header: 'special',
    features: ['Same as Basic', 'Integration with LMS', 'Help with migration'],
    btnText: 'Contact us',
  },
];

const appData = {
  hero: {
    header: hero_header,
    paragraph,
    btnText,
  },
  features: {
    header: features_header,
    features,
  },
  pricing: {
    testimonialsHeader,
    testimonials,
    pricingHeader,
    prices,
  },
};

export default appData;
