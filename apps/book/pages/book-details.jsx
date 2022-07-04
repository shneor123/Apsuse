import { utilService } from '../../../services/util.service.js';
import { bookService } from '../service/book-service.js';
import { eventBusService } from '../../../services/event-bus.service.js';

import { LongTxt } from '../cmps/long-txt.jsx';
import { Loader } from '../../../cmps/loader.jsx';

const { Link } = ReactRouterDOM

export class BookDetails extends React.Component {
  state = {
    book: null,
    isLongTxtShown: false,
    isShowReviewModal: false,
  };

  componentDidMount() {
    this.loadBook();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.match.params.bookId !== this.props.match.params.bookId) {
      this.loadBook();
    }
  }

  loadBook = () => {
    const { bookId } = this.props.match.params;
    bookService.getBookById(bookId).then((book) => {
      if (!book) return this.props.history.push('/bookapp');
      this.setState({ book });
    });
  };

  getBookAge = (bookYear) => {
    if (new Date().getFullYear() - bookYear > 10) return 'Veteran';
    else return 'New!';
  };

  getReadingDuration = (countPages) => {
    if (countPages > 500) return 'Long reading';
    else if (countPages > 200) return 'Decent Reading';
    else return 'Light Reading';
  };

  onToggleTxt = () => {
    this.setState({ isLongTxtShown: !this.state.isLongTxtShown });
  };

  capitalFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  onGoBack = () => {
    this.props.history.push('/bookapp');
  };

  onRemoveBook = () => {
    const { id } = this.state.book;
    bookService.removeBook(id).then(() => {
      eventBusService.emit('user-msg', { txt: 'Book is removed!', type: 'danger'})
      this.onGoBack()
    });
  };

  onRemoveReview = (reviewId) => {
    const bookId = this.state.book.id;
    bookService.removeReview(bookId, reviewId).then(this.loadBook);
  };

  onToggleReviewModal = () => {
    this.setState({ isShowReviewModal: !this.state.isShowReviewModal });
  };

  showStars = (countStar) => {
     return (
      [...Array(5)].map((star, idx) => ( 
        <span key={idx} className={"star " + (idx < countStar ? "on" : "off")}>&#9733;</span>
      ))
    )
  }

  render() {
    if (!this.state.book) return <Loader />;

    const { isLongTxtShown, isShowReviewModal } = this.state;
    const { id, thumbnail, title, subtitle, pageCount, publishedDate,
      description, authors, categories, language, reviews } = this.state.book;
    const { currencyCode, amount, isOnSale } = this.state.book.listPrice;
    const className = amount > 150 ? 'red' : amount < 20 ? 'green' : '';

    return (
      <section>
        <div className="book-details">
          <div className="img-container">
            <img src={thumbnail} />

          </div>
          <div className="details-container">
            <h2>{this.capitalFirstLetter(title)}</h2>
            <h3>{subtitle}</h3>
            <h3 className="gray">{authors.join(', ')}</h3>
            <button onClick={this.onGoBack}>Go back</button>
            <button onClick={this.onRemoveBook}>Remove book</button>
            <div className="pagination-container">
              <Link className="pagination-btn" to={`/bookapp/${bookService.getNextBookId(id, -1)}`}>&larr; Previous Book</Link>
              <Link className="pagination-btn" to={`/bookapp/${bookService.getNextBookId(id, 1)}`}>Next Book &rarr;</Link>
            </div>
            <hr />
            <h4>Categories: {categories.join(', ')}</h4>
            <h4>Language: {language.toUpperCase()}</h4>
            <h4 className={className}>
            {isOnSale && (<img className='sale-img' src='../assets/img/sale.jpeg' />)}
              Price: {utilService.getCurrencySign(currencyCode) + ' '}
              {amount}
            </h4>
            <h4>
              Page count: {pageCount} , Reading duration:
              {' ' + this.getReadingDuration(pageCount)}
            </h4>
            <h4>
              Published Year: {publishedDate} , this book is:
              {' ' + this.getBookAge(publishedDate)}
            </h4>
            <LongTxt
              key={id}
              text={description}
              isLongTxtShown={isLongTxtShown}
              onToggleTxt={this.onToggleTxt}
            />
            <button onClick={this.onToggleReviewModal}>Add review</button>
          </div>
        </div>
      </section>
    );
  }
}