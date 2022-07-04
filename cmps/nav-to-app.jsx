const { Link } = ReactRouterDOM

export function NavToApp({ app }) {
  return (
    <section className={`nav-to-app ${app.name}`}>
      <img src={`assets/img/${app.name}.jpg`} />
      <h2>{app.name}</h2>
      <p>{app.details}</p>
      <Link to={`/${app.name}app`}>Go!</Link>
    </section>
  )
}
