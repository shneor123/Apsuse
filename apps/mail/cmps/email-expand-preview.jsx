export function EmailExpandPreview({ email }) {
    const label = (email.status === 'inbox' || email.status === 'trash') ? `To: ${email.to} ` : `From: ${email.from} `

    return(
        <section className="email-expand-preview">
            <p>{label}</p>
            <p>Subject: {email.subject}</p>
            <p>{email.body}</p>
        </section>
    )
}