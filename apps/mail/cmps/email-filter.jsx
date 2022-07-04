export class EmailFilter extends React.Component {
  state = {
    filterBy: {
      isRead: undefined,
      isStarred: undefined,
    },
  }

  handleChange = ({ target }) => {
    const field = target.name
    const value = target.value
    const mapValue = { true: true, false: false, undefined: undefined }
    this.setState(
      (prevState) => ({
        filterBy: { ...prevState.filterBy, [field]: mapValue[value] },
      }),
      () => {
        this.props.onSetCriteria(this.state.filterBy)
      }
    )
  }
  render() {
    return (
      <section className='email-filter-sort'>
        <select name='isRead' onChange={this.handleChange}>
          <option value='undefined'>Read / Unread</option>
          <option value='true'>Read</option>
          <option value='false'>Unread</option>
        </select>
        <select name='isStarred' onChange={this.handleChange}>
          <option value='undefined'>Starred / Unstarred</option>
          <option value='true'>Starred</option>
          <option value='false'>Unstarred</option>
        </select>
        <button
          className='sort-date-btn'
          onClick={this.props.onSetSort}
          name={'byDate'}
        >
          Sort by date
        </button>
        <button
          className='sort-subject-btn'
          onClick={this.props.onSetSort}
          name={'bySubject'}
        >
          Sort by subject
        </button>
      </section>
    )
  }
}
