import { bookService } from "../service/book-service.js";
import { eventBusService } from "../../../services/event-bus.service.js";


export class BookAdd extends React.Component {
  state = {
    txt: '',
    optBooks: []
  };

  handleChange = ({ target }) => {
    this.setState({ txt: target.value });
  };

  onShowOptionalBooks = (ev) => {
      ev.preventDefault();
      const { txt } = this.state;
      if(!txt) return;
      bookService.showOptionalBooks(txt).then(optBooks => {
          if(!optBooks) return 
          this.setState({ optBooks })
      });
  }

  onAddBook = (book) => {
      bookService.addBook(book).then(() => {
        eventBusService.emit('user-msg', { txt: 'Add book to the list!', type: 'success' })
        this.setState({ txt: '', optBooks: [] })
        this.props.loadBooks()
      })
  }

  render() {
    const { txt , optBooks } = this.state;
    return (
      <section className="book-add">
      <hr />
        <form className="book-add-form" onSubmit={this.onShowOptionalBooks}>
          <label htmlFor="by-txt"></label>
          <input
            placeholder="Search for a book"
            name="txt"
            type="text"
            id="by-txt"
            value={txt}
            onChange={this.handleChange}
          />
          <button>Add book</button>
        </form>
        { optBooks.length > 0 && <ul className="opt-books-container">
            {optBooks.map((book,idx) => (
                <li className="opt-book" key={idx}>{book.volumeInfo.title}
                <button onClick={() => this.onAddBook(book)}> + </button></li>
            ))}
        </ul> }
      </section>
    );
  }
}