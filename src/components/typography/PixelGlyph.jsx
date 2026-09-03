const GLYPHS = {
  o: ['01110', '11011', '10001', '11011', '01110'],
  i: ['00100', '00000', '00100', '00100', '00100'],
};

export default function PixelGlyph({ char = 'o', className = '' }) {
  const cells = GLYPHS[char] ?? GLYPHS.o;
  return (
    <span className={`pixel-glyph ${className}`} aria-hidden="true">
      {cells.join('').split('').map((cell, index) => (
        <i key={index} className={cell === '1' ? 'is-on' : ''} />
      ))}
    </span>
  );
}
