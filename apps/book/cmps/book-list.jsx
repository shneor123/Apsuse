import { BookPreview } from './book-perivew.jsx'


export function BookList({ books }) {
    return (
        <section className="book-list">
            {books.map(book =>
                <BookPreview key={book.id} book={book} />)}
        </section>
    )
}