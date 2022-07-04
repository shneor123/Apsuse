import { utilService } from '../../../services/util.service.js'
import { emailService } from '../services/email.service.js'

import { EmailExpandPreview } from '../cmps/email-expand-preview.jsx'
import { LongTxt } from '../../../cmps/long-txt.jsx'

export class EmailPreview extends React.Component {
  state = {
    isShowOptions: false,
    isExpandPreview: false,
  }

  onShowOptions = () => {
    this.setState({ isShowOptions: true })
  }

  onHideOptions = () => {
    this.setState({ isShowOptions: false })
  }

  getUserName = (emailAdress) => {
    const userName = emailAdress.substring(0, emailAdress.indexOf('@'))
    return utilService.capitalFirstLetter(userName)
  }

  onToggleExpandPriview = () => {
    this.setState({ isExpandPreview: !this.state.isExpandPreview })
    this.props.onSetReadEmail(this.props.email)
  }

  render() {
    const { email, onExpandEmail, onRemoveEmail, onReplyEmail, onToggleField } =
      this.props
    const { isShowOptions, isExpandPreview } = this.state

    return (
      <section className={`email-preview ${email.isRead ? 'read' : ''}`}>
        <tr
          className='email-preview-container'
          onMouseEnter={this.onShowOptions}
          onMouseLeave={this.onHideOptions}
          onClick={this.onToggleExpandPriview}
        >
          <div className='email-content'>
            <td className='starred-btn-cell'>
              <button
                onClick={(ev) => onToggleField(ev, email.id, 'isStarred')}
                className={`email-star ${email.isStarred}`}
                title={
                  email.isStarred ? 'Mark as unstarred' : 'Mark as starred'
                }
              >
                <i className='fas fa-star'></i>
              </button>
            </td>
            <td className='email-from-to'>
              <h3>
                {email.status === 'sent'
                  ? this.getUserName(email.to)
                  : this.getUserName(email.from)}
              </h3>
            </td>
            <td className='email-subject'>
              <span>{email.subject}</span>
            </td>
            <td className='email-body'>
              <LongTxt text={email.body} />
            </td>
          </div>
          {isShowOptions ? (
            <div className='options-btn'>
              {email.status === 'inbox' && (
                <button
                  onClick={(ev) => onReplyEmail(ev, email.id)}
                  title={'Reply'}
                >
                  <i className='fas fa-reply'></i>
                </button>
              )}
              <button
                onClick={(ev) => onRemoveEmail(ev, email.id)}
                title='Delete'
              >
                <i className='fas fa-trash-alt'></i>
              </button>
              <button
                onClick={(ev) => onToggleField(ev, email.id, 'isRead')}
                title={email.isRead ? 'Mark as unread' : 'Mark as read'}
              >
                <i
                  className={`fas fa-envelope${email.isRead ? '-open' : ''}`}
                ></i>
              </button>
              <button
                onClick={(ev) => onExpandEmail(ev, email.id)}
                title={'show more'}
              >
                <i className='fas fa-expand'></i>
              </button>
            </div>
          ) : (
            <span>{utilService.getTimeFromStamp(email.sentAt)}</span>
          )}
        </tr>
        {isExpandPreview && <EmailExpandPreview email={email} />}
      </section>
    )
  }
}
