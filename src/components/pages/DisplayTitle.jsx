const homeLetters = [
  ['P', 'pixel white'], ['o', 'pixel pink'], ['r', 'agne white'], ['t', 'agne pink'],
  ['f', 'pixel white'], ['o', 'pixel pink'], ['l', 'agne white'], ['i', 'agne white'], ['o', 'pixel pink'],
];
const aboutLetters = [
  ['A', 'agne pink'], ['B', 'pixel white'], ['O', 'pixel pink'], ['U', 'agne pink'], ['T', 'agne white'],
  ['M', 'pixel pink'], ['E', 'agne white'],
];
const designLetters = [
  ['D', 'agne pink'], ['e', 'pixel white'], ['s', 'pixel pink'], ['i', 'agne white'], ['g', 'agne pink'], ['n', 'pixel white'],
];
const helloLines = [
  [['H', 'agne pink'], ['e', 'pixel white'], ['l', 'pixel white'], ['l', 'pixel white'], ['o', 'pixel white'], [',', 'agne pink']],
  [['I', 'agne pink'], ["'m", 'agne white'], ['R', 'pixel pink'], ['i', 'pixel pink'], ['v', 'pixel pink'], ['i', 'pixel pink'], ['Z', 'agne white'], ['h', 'pixel white'], ['a', 'pixel white'], ['n', 'pixel white'], ['g', 'agne pink'], ['.', 'agne pink']],
];

function Letters({ letters }) {
  return letters.map(([letter, classes], index) => <span className={`display-letter ${classes}`} key={`${letter}-${index}`}>{letter}</span>);
}

export default function DisplayTitle({ variant }) {
  if (variant === 'home') return <div className="display-title portfolio-word" aria-label="Portfolio"><Letters letters={homeLetters} /></div>;
  if (variant === 'about') return <div className="display-title about-word" aria-label="About me"><Letters letters={aboutLetters.slice(0, 5)} /><span className="title-gap" /><Letters letters={aboutLetters.slice(5)} /></div>;
  if (variant === 'design') return <div className="display-title design-word" aria-label="Design"><Letters letters={designLetters} /></div>;
  return <div className="display-title hello-word" aria-label="Hello, I'm Rivi Zhang.">{helloLines.map((line, index) => <span className="hello-line" key={index}><Letters letters={line} /></span>)}</div>;
}
