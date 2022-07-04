import { utilService } from '../../../services/util.service.js';

const { Link } = ReactRouterDOM;


export function BookPreview({ book }) {
  const{listPrice} =book
  return (
    <Link to={`/bookapp/${book.id}`} className="book-preview">
      <article >
        <div className="image-container">
          <img src={book.thumbnail} />
        </div>
        <h4>
        {listPrice.isOnSale && (<img className='sale-img' src='../assets/img/sale.jpeg' />)}
          Price:{' '}
          {utilService.getCurrencySign(book.listPrice.currencyCode) + ' '}
          {book.listPrice.amount}
        </h4>
      </article>
    </Link>
  );
}