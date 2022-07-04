import { utilService } from "../../../services/util.service.js"

export function TxtNote({ note }) {

    const txt = utilService.capitalFirstLetter(note.info.txt)
    return <section className="txt-note note" >
        <h2>{note.info.title}</h2>
        <p>{txt}</p>
    </section>

}