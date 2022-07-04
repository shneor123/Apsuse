import { bookService } from '../service/book-service.js';

import { BookFilter } from '../cmps/book-filter.jsx';
import { BookList } from '../../../apps/book/cmps/book-list.jsx';
import { BookAdd } from '../../book/cmps/book-add.jsx';

export class BookApp extends React.Component {
  state = {
    books: [],
    filterBy: null,
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    const { filterBy } = this.state;
    bookService.query(filterBy)
      .then((books) => {
        this.setState({ books });
      })
  };

  onSetFilter = (filterBy) => {
    this.setState({ filterBy },
      this.loadBooks);
  };

  render() {
    const { books } = this.state;

    if (!books) return <React.Fragment></React.Fragment>

    return (
      <section className="book-app">
        <h2>welcome to book</h2>
        <BookFilter onSetFilter={this.onSetFilter} />
        <BookAdd loadBooks={this.loadBooks} />
        <BookList books={books} />
      </section>
    );
  }
}