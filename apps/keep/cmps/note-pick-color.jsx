

export function PickNoteColor({ noteId, onChangeBgc }) {

    const colors = ['#faf0e6', '#bbd0d0', '#87cefa', '#ffb6c1', '#fafad2', '#e0ffff', '#add8e6']

    return <section className="color-container">
        <section className="color-menu">
            {colors.map(color => {
                return <div key={color} className="color-input"
                    style={{ backgroundColor: color }}
                    onClick={() => onChangeBgc(noteId, color)}>

                </div>
            })}
        </section>
    </section>
}