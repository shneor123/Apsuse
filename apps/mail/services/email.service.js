import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/storage.service.js'

export const emailService = {
  query,
  saveEmail,
  getEmailById,
  updateEmailToRead,
  getAmountEmailsByFilter,
  removeEmail,
  updateEmail,
}

const STORAGE_KEY = 'mailDB'
let gEmails = [
  {
    id: utilService.makeId(),
    subject: `Hello darkness my old friend`,
    body: `I've come to talk with you again
        Because a vision softly creeping
        Left its seeds while I was sleeping
        And the vision that was planted in my brain
        Still remains
        Within the sound of silence`,
    status: 'inbox',
    isStarred: false,
    isRead: false,
    sentAt: 1661928997,
    from: 'Disturbed@gmail.com',
    to: `user@appsus.com`,
  },
  {
    id: utilService.makeId(),
    subject: `Get down with the sickness`,
    body: `Drowning deep in my sea of loathing
        Broken your servant I kneel
        (Will you give in to me?)
        It seems what's left of my human side
        Is slowly changing in me
        (Will you give in to me?)`,
    status: 'inbox',
    isStarred: true,
    isRead: true,
    sentAt: 1614743079,
    from: 'Disturbed@gmail.com',
    to: `user@appsus.com`,
  },
  {
    id: utilService.makeId(),
    subject: 'Invitation Meme Gen',
    body: 'Hola, alondai1 invited you as a teammate on Meme Gen in Zeplin.',
    status: 'inbox',
    isRead: false,
    isStarred: true,
    sentAt: 1218195919,
    from: 'Alon@alon.com',
    to: 'user@appsus.com',
  },
  {
    id: utilService.makeId(),
    subject: 'REQUEST FOR ASSISTANCE-STRICTLY CONFIDENTIAL',
    body: `I am Dr. Bakare Tunde, the cousin of Nigerian Astronaut, Air Force Major Abacha Tunde. He was the first African in space when he made a secret flight to the Salyut 6 space station in 1979. He was on a later Soviet spaceflight, Soyuz T-16Z to the secret Soviet military space station Salyut 8T in 1989. He was stranded there in 1990 when the Soviet Union was dissolved. His other Soviet crew members returned to earth on the Soyuz T-16Z, but his place was taken up by return cargo. There have been occasional Progrez supply flights to keep him going since that time. He is in good humor, but wants to come home.
    In the 14-years since he has been on the station, he has accumulated flight pay and interest amounting to almost $ 15,000,000 American Dollars. This is held in a trust at the Lagos National Savings and Trust Association. If we can obtain access to this money, we can place a down payment with the Russian Space Authorities for a Soyuz return flight to bring him back to Earth. I am told this will cost $ 3,000,000 American Dollars. In order to access the his trust fund we need your assistance.
    Consequently, my colleagues and I are willing to transfer the total amount to your account or subsequent disbursement, since we as civil servants are prohibited by the Code of Conduct Bureau (Civil Service Laws) from opening and/ or operating foreign accounts in our names.
    Needless to say, the trust reposed on you at this juncture is enormous. In return, we have agreed to offer you 20 percent of the transferred sum, while 10 percent shall be set aside for incidental expenses (internal and external) between the parties in the course of the transaction. You will be mandated to remit the balance 70 percent to other accounts in due course.`,
    status: 'trash',
    isRead: false,
    isStarred: true,
    sentAt: 1218195919,
    from: 'NigerianAstronaut@someNigerianEmail.com',
    to: 'user@appsus.com',
  },
  {
    id: utilService.makeId(),
    subject: 'Meeting',
    body: 'Could you call me back?',
    status: 'draft',
    isRead: false,
    isStarred: true,
    sentAt: 1551133930594,
    from: 'user@appsus.com',
    to: 'koko@koko.com',
  },
]

const loggedUser = {
  email: 'user@appsus.com',
  fullname: 'Puki Ben David',
}

_createEmails()

function query(criteria = null, sort = null) {
  const emails = _loadEmailsFromStorage()
  const allUserEmails = _getAllUserEmails(emails)
  if (!criteria) return Promise.resolve(allUserEmails)
  const filteredEmails = _getFilteredEmails(allUserEmails, criteria)
  if (sort) {
    const mapSort = { byDate: 'sentAt', bySubject: 'subject' }
    filteredEmails.sort((e1, e2) =>
      e1[mapSort[sort.type]] < e2[mapSort[sort.type]]
        ? sort.order
        : sort.order * -1
    )
  }
  return Promise.resolve(filteredEmails)
}

function saveEmail(emailToSave, status) {
  return emailToSave.id
    ? _updateEmail(emailToSave)
    : _addEmail(emailToSave, status)
}

function getEmailById(emailId) {
  let emails = _loadEmailsFromStorage()
  const email = emails.find((email) => email.id === emailId)
  return Promise.resolve(email)
}

function updateEmailToRead(emailId) {
  let emails = _loadEmailsFromStorage()
  const email = emails.find((email) => email.id === emailId)
  email['isRead'] = true
  _saveEmailsToStorage(emails)
  return Promise.resolve(email)
}

function getAmountEmailsByFilter(field, value, isRead = undefined) {
  const emails = _loadEmailsFromStorage()
  const userEmails = _getAllUserEmails(emails)
  const amountEmail = userEmails.filter((email) => {
    const isReadFilter = isRead === undefined || email.isRead === isRead
    return email[field] === value && isReadFilter
  }).length
  return amountEmail
}

function removeEmail(emailId) {
  let emails = _loadEmailsFromStorage()
  const email = emails.find((email) => email.id === emailId)
  if (email.status === 'draft' || email.status === 'trash')
    emails = emails.filter((email) => email.id !== emailId)
  else email.status = 'trash'
  _saveEmailsToStorage(emails)
  return Promise.resolve(email)
}

function updateEmail(emailId, field){
  let emails = _loadEmailsFromStorage()
  const email = emails.find((email) => email.id === emailId)
  const value = email[field]
  email[field] = !value
  _saveEmailsToStorage(emails)
  return Promise.resolve(email)
}

function _createEmails() {
  let emails = _loadEmailsFromStorage()
  if (!emails || !emails.length) {
    emails = gEmails
  }
  _saveEmailsToStorage(emails)
}

function _createEmail(emailToSave, status = 'sent', id = utilService.makeId()) {
  return {
    id,
    subject: emailToSave.subject,
    body: emailToSave.body,
    status,
    isRead: false,
    isStarred: false,
    sentAt: Date.now(),
    from: loggedUser.email,
    to: emailToSave.toUser,
  }
}

function _addEmail(emailToSave, status) {
  let emails = _loadEmailsFromStorage()
  let email = _createEmail(emailToSave, status)
  emails = [email, ...emails]
  _saveEmailsToStorage(emails)
  return Promise.resolve(email)
}

function _updateEmail(emailToSave) {
  const emails = _loadEmailsFromStorage()
  const emailIdx = emails.findIndex((email) => email.id === emailToSave.id)
  emails[emailIdx] = _createEmail(emailToSave, 'sent', emailToSave.id)
  _saveEmailsToStorage(emails)
  return Promise.resolve()
}

function _getAllUserEmails(emails) {
  return emails.filter((email) => {
    return email.from === loggedUser.email || email.to === loggedUser.email
  })
}

function _getUserEmails(emails, type) {
  return emails.filter((email) => {
    return email[type] === loggedUser.email
  })
}

function _getCorrectEmails(emails, criteria) {
  let { status, txt, isRead, isStarred } = criteria
  status = status === 'all' ? '' : status
  const filter = emails.filter((email) => {
    const isReadFilter =
      isRead === undefined || email.isRead === criteria.isRead
    const isStarredFilter =
      isStarred === undefined || email.isStarred === criteria.isStarred
    return (
      email.status.includes(status) &&
      email.subject.toUpperCase().includes(txt.toUpperCase()) &&
      isReadFilter &&
      isStarredFilter
    )
  })
  return filter
}

function _getFilteredEmails(emails, criteria) {
  let { status } = criteria
  const toUserEmails = _getUserEmails(emails, 'to')
  const fromUserEmails = _getUserEmails(emails, 'from')
  if (status === 'trash') return _getCorrectEmails(emails, criteria)
  else if (status === 'inbox') return _getCorrectEmails(toUserEmails, criteria)
  else if (status === 'sent' || status === 'draft')
    return _getCorrectEmails(fromUserEmails, criteria)
  else return _getCorrectEmails(emails, criteria)
}

function _loadEmailsFromStorage() {
  return storageService.loadFromStorage(STORAGE_KEY)
}

function _saveEmailsToStorage(emails) {
  storageService.saveToStorage(STORAGE_KEY, emails)
}
