function showTxt(text, isLongTxtShown) {
  if(isLongTxtShown) return text;
}

export function LongTxt({ text, isLongTxtShown , onToggleTxt }) {
  return (
    <section className="long-txt">
      <h4>{showTxt(text, isLongTxtShown) + ' '}
      <a  onClick={onToggleTxt}>{isLongTxtShown ? ' Less...' : ' More...'}</a>
      </h4>
    </section>
  );
}