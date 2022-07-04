import { emailService } from '../services/email.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'

export class EmailCompose extends React.Component {
  state = {
    email: {
      id: '',
      toUser: '',
      subject: '',
      body: '',
    },
  }

  inputRef = React.createRef()

  componentDidMount() {
    this.inputRef.current.focus()
    this.loadEmail()
  }

  loadEmail = () => {
    const { emailId , noteEmail } = this.props
    if (!emailId && !noteEmail) return
    else if(emailId) emailService.getEmailById(emailId).then((email) => {
      const setId = email.status === 'draft' ? email.id : ''
      this.setState({
        email: { toUser: email.from, subject: email.subject, body: email.body,
                  id: setId},
      })
    })
    else this.setState({
      email: {toUser: '', subject: noteEmail.subject, body: noteEmail.body, id: ''}
    })
  }

  handleChange = ({ target }) => {
    const field = target.name
    const value = target.value
    this.setState((prevState) => ({
      email: { ...prevState.email, [field]: value },
    }))
  }

  onSaveEmail = (ev, status) => {
    ev.preventDefault()
    const { email } = this.state
    emailService.saveEmail(email, status).then((email) => {
      const message = (email.status === 'draft') ? 'Saved email as draft' : 'Email sent'
      eventBusService.emit('user-msg', { txt: message, type: 'success' })
      this.props.loadEmails()
      this.props.onToggleCompose()
    })
  }

  render() {
    const { toUser, subject, body } = this.state.email

    return (
      <section className="email-compose">
        <form onSubmit={(ev) => this.onSaveEmail(ev, 'sent')}>
          <div className="email-compose-header" onClick={(ev) => this.onSaveEmail(ev,'draft')}>
            <i className="fas fa-times"></i>
          </div>
          <div className="form-to">
            <label htmlFor="to-user">To:</label>
            <input
              ref={this.inputRef}
              name="toUser"
              type="text"
              id="to-user"
              value={toUser ? toUser : ''}
              onChange={this.handleChange}
              autoComplete="off"
            />
          </div>
          <div className="form-subject">
            <label htmlFor="subject">Subject:</label>
            <input
              name="subject"
              type="text"
              id="subject"
              value={subject ? subject : ''}
              onChange={this.handleChange}
              autoComplete="off"
            />
          </div>
          <textarea
            name="body"
            rows="18"
            value={body ? body : ''}
            onChange={this.handleChange}
          />
          <div className="form-btns">
            <button type="submit" className="form-send-btn">Send</button>
            <button className="form-trash-btn" onClick={this.props.onToggleCompose}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </form>
      </section>
    )
  }
}
