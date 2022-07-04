import { NavToApp } from '../cmps/nav-to-app.jsx'

export class Home extends React.Component {
  state = {
      apps: {
          book: {
              name: 'book',
              details: 'Bookshop'
          },
          keep: {
              name: 'keep',
              details: `capture what on your mind`
          },
          mail: {
              name:'mail',
              details:'Email'
          },
      },
  }

  render() {
      const {book, keep, mail} = this.state.apps
    return (
      <section className="home">
          <img className="home-image hero" src="assets/img/desk-image.webp"/>
        <div className="nav-apps">
          <NavToApp className="first-child" app={book} />
          <NavToApp app={keep} />
          <NavToApp app={mail} />
        </div>
      </section>
    )
  }
}
