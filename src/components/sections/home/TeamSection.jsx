import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import styles from './TeamSection.module.css'

/**
 * Leadership section. Add an optional `image` URL to each person in
 * teamContent.members when approved portraits are available.
 * Until then, the preview's initials portraits remain visible.
 */
const TeamSection = ({ content }) => (
  <section id="team" className={styles.section} aria-labelledby="team-title">
    <div className="container">
      <div className={styles.head}>
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 id="team-title" className={styles.title}>{content.title}</h2>
        </Reveal>
        <Reveal delay={100} className={styles.intro}>
          <p>{content.intro}</p>
        </Reveal>
      </div>

      <Reveal as="ul" stagger className={styles.grid}>
        {content.members.map(({ name, initials, role, body, image }, index) => (
          <li key={name} className={styles.item}>
            <article className={styles.person}>
              <div className={styles.photo} data-variant={index}>
                {image ? (
                  <img
                    src={image}
                    alt={`Portrait of ${name}`}
                    className={styles.portrait}
                    width="800"
                    height="880"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <>
                    <span className={styles.initials} aria-hidden="true">{initials}</span>
                    <span className={styles.placeholder} aria-hidden="true">Photo</span>
                  </>
                )}
              </div>
              <div className={styles.personBody}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.role}>{role}</p>
                <p className={styles.description}>{body}</p>
              </div>
            </article>
          </li>
        ))}
      </Reveal>
    </div>
  </section>
)

export default TeamSection
