import { emailService } from '../services/email.service.js'

const { withRouter } = ReactRouterDOM

class _EmailDetails extends React.Component {
  state = {
    email: null,
  }

  ComponentDidMount() {
    this.loadEmail()
  }

  loadEmail = () => {
    const { emailId } = this.props
    emailService.getEmailById(emailId).then((email) => this.setState({ email }))
  }

  goBack = () => {
    this.props.history.push('/mailapp')
  }

  render() {
    const { email } = this.state
    if (!email) return <React.Fragment></React.Fragment>

    const { onReplyEmail, onRemoveEmail, onToggleField, onExportEmailToNote } =
      this.props
    const isReceieved =
      email.status === 'sent' || email.status === 'draft' ? true : false

    return (
      <section className='email-details'>
        <div className='email-details-tools'>
          <button onClick={this.goBack} title={'Go back'}>
            <i className='fas fa-arrow-left'></i>
          </button>
          <div className='tools-btns'>
            {email.status === 'inbox' && (
              <button onClick={() => onReplyEmail()} title={'Reply'}>
                <i className='fas fa-reply'></i>
              </button>
            )}
            <button onClick={()=>onRemoveEmail(null, email.id)} title={'Delete'}><i className="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </section>
    )
  }
}

export const EmailDetails = withRouter(_EmailDetails)
