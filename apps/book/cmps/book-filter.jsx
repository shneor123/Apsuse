
export class BookFilter extends React.Component {
  state = {
    filterBy: {
      title: '',
      minPrice: '',
      maxPrice: '',
    },
  };

  onSubmitFilter = (ev) => {
    ev.preventDefault();
    this.props.onSetFilter(this.state.filterBy);
    this.cleanForm();
  };

  handleChange = ({ target }) => {
    const field = target.name;
    const value = (target.type === 'number') ? +target.value : target.value;
    this.setState((prevState) => ({ filterBy: { ...prevState.filterBy, [field]: value } }), () => {
      this.props.onSetFilter(this.state.filterBy)
    })
  }

  cleanForm = () => {
    this.setState({ filterBy: { title: '', minPrice: '', maxPrice: '' } })
  }

  render() {
    const {filterBy: { title, minPrice, maxPrice }} = this.state;

    return (
      <form className="book-filter" onSubmit={this.onSubmitFilter}>
        <label htmlFor="by-title">By Title:
          <input type="text" id="by-title" name="title" value={title} onChange={this.handleChange} />
        </label>
        <label htmlFor="by-min-price">Min price:
          <input type="number" id="by-min-price" name="minPrice" value={minPrice} min="0" onChange={this.handleChange} />
        </label>
        <label htmlFor="by-max-price">Max price:
          <input type="number" id="by-max-price" name="maxPrice" value={maxPrice} min="0" onChange={this.handleChange} />
        </label>
        <button>Filter</button>
      </form>
    )
  }
}