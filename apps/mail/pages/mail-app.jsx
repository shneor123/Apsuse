import { eventBusService } from '../../../services/event-bus.service.js'
import { utilService } from '../../../services/util.service.js'
import { EmailCompose } from '../cmps/email-compose.jsx'
import { emailService } from '../services/email.service.js'

import { EmailDetails } from '../cmps/email-details.jsx'
import { EmailList } from '../cmps/email-list.jsx'
import { EmailFolderList } from '../cmps/email-folder-list.jsx'
import { EmailFilter } from '../cmps/email-filter.jsx'

export class MailApp extends React.Component {
  state = {
    emails: [],
    criteria: {
      status: 'inbox',
      txt: '',
      isRead: undefined,
      isStarred: undefined,
    },
    isShowCompose: false,
    sort: {
      type: 'byDate',
      order: 1,
    },
    noteEmail: {
      subject: '',
      body: '',
    },
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    this.loadEmails()
    this.removeEventBus()
    this.searchParams()
  }

  componentWillUnmount() {
    this.removeEventBus()
  }

  removeEventBus = () => {
    eventBusService.on('search', (txt) => this.debouncedFunc({ txt }))
  }

  searchParams = () => {
    const query = new URLSearchParams(this.props.location.search)
    const subject = query.get('subject')
    const body = query.get('body')
    this.setState({ noteEmail: { subject, body } })
    if (subject || body) {
      this.setState({ isShowCompose: true })
    }
  }

  debouncedFunc = utilService.debounce(this.onSetCriteria, 10)

  loadEmails = () => {
    const { criteria, sort } = this.state
    emailService.query(criteria, sort).then((emails) => {
      this.setState({ emails })
      this.props.history.push('/mailapp')
    })
  }

  onToggleCompose = () => {
    this.setState({ isShowCompose: !this.state.isShowCompose })
  }

  onExpandEmail = (ev, emailId) => {
    if (ev) ev.stopPropagation()
    this.props.history.push(this.props.location.pathname + '/' + emailId)
  }

  onReplyEmail = (ev, emailId) => {
    if (ev) ev.stopPropagation()
    this.onExpandEmail(ev, emailId)
    this.setState({ isShowCompose: true })
  }

  onRemoveEmail = (ev, emailId) => {
    if (ev) ev.stopPropagation()
    emailService.removeEmail(emailId).then((email) => {
      this.loadEmails()
      eventBusService.emit('user-msg', {
        txt: 'The mail moved to trash',
        type: '',
      })
      this.props.history.push('/mailapp')
    })
  }

  onToggleField = (ev, emailId, field) => {
    if (ev) ev.stopPropagation()
    emailService.updateEmail(emailId, field).then((email) => {
      const message = this.getUserMessage(field, email[field])
      eventBusService.emit('user-msg', { txt: message, type: 'success' })
      this.loadEmails()
    })
  }

  onExportEmailToNote = (email) => {
    this.props.history.push(`/keepapp?title=${email.subject}&txt=${email.body}`)
  }

  onSetReadEmail = (email) => {
    emailService.updateEmailToRead(email.id).then((email) => {
      eventBusService.emit('user-msg', { txt: 'Mark as read', type: 'success' })
      this.loadEmails()
    })
  }

  onSetSort = ({ target }) => {
    const sortBy = target.name
    const sort = { type: sortBy, order: 1 }
    this.setState((prevState) => {
      if (prevState.sort.type === sortBy) sort.order = prevState.sort.order * -1
      return { sort }
    }, this.loadEmails)
  }

  onSetCriteria = (newCriteria) => {
    this.setState(
      (prevState) => ({ criteria: { ...prevState.criteria, ...newCriteria } }),
      this.loadEmails
    )
  }

  getUserMessage = (field, value) => {
    if(field === 'isRead') return `Mark as ${value === true ? 'read' : 'unread'}`
    else return `Mark as ${value === true ? 'starred' : 'unstarred'}`
  }

  render() {
    const { emails, criteria, isShowCompose, noteEmail } = this.state
    const { emailId } = this.props.match.params
    return (
      <section className='mail-app'>
        <aside className='aside-container'>
          <button className='compose-btn' onClick={this.onToggleCompose}>
            <img src='./assets/img/compose-plus.png' />
          </button>
          {isShowCompose && (
            <EmailCompose
              onToggleCompose={this.onToggleCompose}
              loadEmails={this.loadEmails}
              emailId={emailId}
              noteEmail={noteEmail}
            />
          )}
          <EmailFolderList
            onSetCriteria={this.onSetCriteria}
            activeStatus={criteria.status}
          />
        </aside>
        <div className='email-container'>
          <EmailFilter onSetCriteria={this.onSetCriteria} onSetSort={this.onSetSort} />
          {!emailId ? (
            <EmailList
              emails={emails}
              loadEmails={this.loadEmails}
              onExpandEmail={this.onExpandEmail}
              onRemoveEmail={this.onRemoveEmail}
              onReplyEmail={this.onReplyEmail}
              onToggleField={this.onToggleField}
              onSetReadEmail={this.onSetReadEmail}
            />
          ) : (
            <EmailDetails
              emailId={emailId}
              onReplyEmail={this.onReplyEmail}
              onRemoveEmail={this.onRemoveEmail}
              onToggleField={this.onToggleField}
              onExportEmailToNote={this.onExportEmailToNote}
            />
          )}
        </div>
      </section>
    )
  }
}
