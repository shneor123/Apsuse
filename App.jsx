import { Home } from './pages/home.jsx'

import { BookApp } from './apps/book/pages/book-app.jsx'
import { BookDetails } from './apps/book/pages/book-details.jsx'
import { KeepApp } from './apps/keep/pages/keep-app.jsx'
import { MailApp } from './apps/mail/pages/mail-app.jsx'

import { AppHeader } from './cmps/app-header.jsx'
import {UserMsg} from './cmps/user-msg.jsx'

const Router = ReactRouterDOM.HashRouter
const { Route, Switch } = ReactRouterDOM

export function App() {
  return (
    <Router>
      <section className='app'>
        <AppHeader />
        <main>
          <Switch>
            <Route component={BookDetails} path="/bookapp/:bookId" />
            <Route component={KeepApp} path='/keepapp' />
            <Route component={BookApp} path='/bookapp' />
            <Route component={MailApp} path='/mailapp' />
            <Route component={Home} path='/' />
          </Switch>
        </main>
        <UserMsg/>
      </section>
    </Router>
  )
}