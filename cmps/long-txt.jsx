function showTxt(text) {
  if (text.length < 100) return text
  else return text.substr(0, 67) + ' ...'
}

export function LongTxt({ text }) {
  return (
    <section className="long-txt">
      <span>
        {showTxt(text)}
      </span>
    </section>
  )
}