

export function ImgNote({ note }) {

    return (
        <section className="img-note note">
            <h2>{note.info.title}</h2>
            <img src={note.info.url} />
        </section>
    )

}