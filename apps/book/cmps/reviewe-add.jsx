import { bookService } from '../service/book-service.js'
import { eventBusService } from "../../../services/event-bus.service.js"



import { StarRating } from './start-tating.jsx';

export class ReviewAdd extends React.Component {
    state = {
        review: {
            fullName: 'Books Reader',
            rating: 0,
            date: new Date().toISOString().slice(0, 10),
            txt: '',
        },
    };

    inputRef = React.createRef();

    componentDidMount() {
        this.inputRef.current.focus();
    }

    onSaveReview = (ev) => {
        ev.preventDefault();
        const { review } = this.state;
        const { bookId } = this.props;
        bookService.saveReview(bookId, review).then(() => {
            eventBusService.emit('user-msg', { txt: 'The review was successfully added', type: 'success' })
            this.props.loadBook()
        });
        this.props.onToggleReviewModal();
    };

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState((prevState) => ({
            review: { ...prevState.review, [field]: value },
        }));
    };

    render() {
        const { fullName, date, txt } = this.state.review;

        return (
            <section className="review-add">
                <div className="review-modal">
                    <h1>Add review</h1>
                    <button className="btn-toggle-modal" onClick={() => this.props.onToggleReviewModal()}> ×</button>
                    <form onSubmit={this.onSaveReview} className="review-form">
                        <label htmlFor="by-fullname">Full name:</label>
                        <input ef={this.inputRef} placeholder="Enter full name" name="fullName" type="text" id="by-fullname" value={fullName} onChange={this.handleChange} autoComplete="off" />
                        <StarRating handleChange={this.handleChange} />
                        <label htmlFor="by-date">Date:</label>
                        <input type="date" id="by-date" name="date" value={date} onChange={this.handleChange} />
                        <textarea name="txt" cols="30" rows="10" value={txt} onChange={this.handleChange}>
                        </textarea>
                        <button>Add review</button>
                    </form>
                </div>
            </section>
        );
    }
}