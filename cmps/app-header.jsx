
import { eventBusService } from '../services/event-bus.service.js'

const { NavLink, Link, withRouter } = ReactRouterDOM

class _AppHeader extends React.Component {
  state = {
    isShowMenu: false,
    filterText: '',
    nameApp: '',
  }

  ComponentDidMount() {
      this.getNameApp()
  }

  ComponentDidUpdate(prevProps, prevState) {
      if(prevProps.locatoin.pathname !== this.prop.location.pathname){
          this.getNameApp()
      }
  }

  getNameApp = () => {
    const path = this.props.location.pathname
    const removeAfterIdx = path.indexOf('app')
    this.setState({ nameApp: path.substring(1, removeAfterIdx) })
  }

  onToggleAppsMenu = () => {
    this.setState({ isShowMenu: !this.state.isShowMenu }, () => {
      if (!this.state.isShowMenu) this.setState({ filterText: '' })
    })
  }

  handleChange = ({ target }) => {
    const value = target.value
    this.setState({ filterText: value })
    eventBusService.emit('search', value)
  }

  render() {
    const { isShowMenu, filterText, nameApp } = this.state
    return (
      <header className='app-header'>
        <Link to='/' className='logo'>
          <h1>Appsus</h1>
        </Link>
        {/* {nameApp === 'bookapp' || nameApp === '/' ? (
          ''
        ) : (
          <div className='search-container'>
            <input
              ref='name'
              type='text'
              name='search'
              value={filterText}
              placeholder={`search ${nameApp}`}
              onChange={this.handleChange}
              autoComplete='off'
            />
          </div>
        )} */}
        <button>
          <img
            className='btn-apps'
            src='assets/img/apps-menu.svg'
            onClick={this.onToggleAppsMenu}
          />
        </button>
        {isShowMenu && (
          <nav className='main-nav'>
            <NavLink to='/keepapp' onClick={this.onToggleAppsMenu}>
              <div className='link-container'>
                <img src='assets/img/keep.jpg' />
                <span>Keep</span>
              </div>
            </NavLink>
            <NavLink to='/mailapp' onClick={this.onToggleAppsMenu}>
              <div className='link-container'>
                <img src='assets/img/mail.jpg' />
                <span>Mail</span>
              </div>
            </NavLink>
            <NavLink to='/bookapp' onClick={this.onToggleAppsMenu}>
              <div className='link-container'>
                <img src='assets/img/book.jpg' />
                <span>Books</span>
              </div>
            </NavLink>
          </nav>
        )}
      </header>
    )
  }
}

export const AppHeader = withRouter(_AppHeader)
