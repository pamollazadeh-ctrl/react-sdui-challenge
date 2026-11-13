import { DynamicFormLoader } from '@/features/dynamic-form'
import styles from './App.module.css'

/** Id of the form this page shows. A router param would replace it in a multi-form app. */
const FORM_ID = 'car'

export function App() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <DynamicFormLoader
          key={FORM_ID}
          formId={FORM_ID}
          renderTitle={(title) => <h1 className={styles.title}>{title}</h1>}
        />
      </section>
    </main>
  )
}
