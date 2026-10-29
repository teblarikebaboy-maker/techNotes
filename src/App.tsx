import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Section = 'Dashboard' | 'Wirebond' | 'Die attach' | 'MCA'
type Task = { id: string; title: string; detail?: string; group: string }

const sections: Section[] = ['Dashboard', 'Wirebond', 'Die attach', 'MCA']
const dailyTasks: Task[] = [
  { id: 'stand-alone', title: 'Stand Alone', group: 'DAILY CHECK' },
  { id: 'fuguai', title: 'FUGUAI', group: 'DAILY CHECK' },
  { id: 'enercon', title: 'Enercon', group: 'DAILY CHECK' },
  { id: '5s', title: '5S', group: 'DAILY CHECK' },
  { id: 'run-rate', title: 'Run Rate', group: 'DAILY CHECK' },
]
const processTasks: Record<'Die attach' | 'MCA', Task[]> = {
  'Die attach': [
    { id: 'da-docs', title: 'Confirm released die attach instructions', detail: 'Match the process revision to the traveler', group: 'BEFORE RUN' },
    { id: 'da-material', title: 'Verify die, substrate, and material identity', detail: 'Check lot traceability and material status', group: 'BEFORE RUN' },
    { id: 'da-equipment', title: 'Check placement tooling and equipment status', detail: 'Confirm approved tooling is installed and equipment is cleared', group: 'BEFORE RUN' },
    { id: 'da-first-piece', title: 'Complete first-piece inspection', detail: 'Use the released acceptance criteria and record results', group: 'IN PROCESS' },
    { id: 'da-records', title: 'Update lot records and handover notes', detail: 'Capture exceptions, holds, and remaining actions', group: 'CLOSEOUT' },
  ],
  MCA: [
    { id: 'mca-docs', title: 'Review the current MCA work instruction', detail: 'Confirm revision and lot-specific requirements', group: 'BEFORE RUN' },
    { id: 'mca-material', title: 'Verify materials and lot identification', detail: 'Check traceability against the active traveler', group: 'BEFORE RUN' },
    { id: 'mca-equipment', title: 'Confirm equipment and fixture readiness', detail: 'Check status, calibration, and approved configuration', group: 'BEFORE RUN' },
    { id: 'mca-quality', title: 'Complete required in-process checks', detail: 'Record results using the released inspection plan', group: 'IN PROCESS' },
    { id: 'mca-closeout', title: 'Close out records and communicate open items', detail: 'Update lot status and shift handover', group: 'CLOSEOUT' },
  ],
}
const resources = [
  { name: 'OPCENTER', description: 'Semiconductor industry standards and resources', url: 'https://ampicamaprod.allegro.msad/CamstarPortal/default.htm#/login' },
  { name: 'FUGUAI', description: 'Electronics manufacturing standards', url: 'https://apps.powerapps.com/play/e/default-64a381f3-c476-46f3-be30-99406d2ef129/a/60fa7854-6e19-46cf-a12e-af5ac2b009fa?tenantId=64a381f3-c476-46f3-be30-99406d2ef129&hint=c46e0620-a7f1-421b-9697-9dd1bd62a6dc&sourcetime=1773211250806' },
  { name: 'DAILY OUTPUT', description: 'Measurement science and technology resources', url: 'http://ampimfgssrs/Reports_PROD/report/Reports/Camstar/Production/Interactive/Operations_Related_Reports/PROD_DAILY_PROCESSED_QTY_v2' },
  { name: '5S', description: 'Zone 30 BLDG2 Checklist of 5S Practices', url: 'https://allegromicro.sharepoint.com/sites/AMPIIntranet/SitePages/5s-Dashboard.aspx?web=1' },
  { name: 'WBCC', description: 'OPENS WIREBOND CC APP', url: 'https://ampiign/data/perspective/client/WirebondCC/' },
  { name: 'DACC', description: 'OPENS DIE ATTACH CC APP', url: 'https://ampiign/data/perspective/client/DieAttachCC/' },
  { name: 'WB/DA Cleaning', description: 'OPENS DIE ATTACH CC APP', url: 'http://ampissrs/Reports_PROD/report/Reports/Camstar/Production/Subscriptions/MaintenanceReport/PROD_DAILY_MAINTENANCE_SCHEDULE' },
]
const wirebondTasksStorageKey = 'tech-essentials-wirebond-custom-tasks'
const wirebondNotesStorageKey = 'tech-essentials-wirebond-important-notes'

function dateKey(date: Date) {
  return `tech-essentials-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function currentDate() {
  return new Date()
}

function loadCompleted(date: Date) {
  try {
    return JSON.parse(localStorage.getItem(dateKey(date)) ?? '[]') as string[]
  } catch {
    return []
  }
}

function loadCustomWirebondTasks() {
  return loadSavedSentences(wirebondTasksStorageKey, 'wb-custom-')
}

function loadSavedSentences(storageKey: string, idPrefix: string) {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(saved)) return []
    return saved.filter((task): task is Task =>
      typeof task === 'object'
      && task !== null
      && 'id' in task
      && typeof task.id === 'string'
      && 'title' in task
      && typeof task.title === 'string'
      && 'group' in task
      && typeof task.group === 'string'
      && task.id.startsWith(idPrefix),
    )
  } catch {
    return []
  }
}

function App() {
  const [today, setToday] = useState(() => new Date())
  const [activeSection, setActiveSection] = useState<Section>('Dashboard')
  const [completed, setCompleted] = useState<string[]>(() => loadCompleted(new Date()))
  const [customWirebondTasks, setCustomWirebondTasks] = useState<Task[]>(loadCustomWirebondTasks)
  const [importantNotes, setImportantNotes] = useState<Task[]>(() => loadSavedSentences(wirebondNotesStorageKey, 'wb-note-'))
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [taskMessage, setTaskMessage] = useState('')
  const [noteMessage, setNoteMessage] = useState('')

  useEffect(() => {
    function refreshDate() {
      const now = new Date()
      if (dateKey(now) !== dateKey(today)) {
        setToday(now)
        setCompleted(loadCompleted(now))
      }
    }

    const timer = window.setInterval(refreshDate, 60_000)
    window.addEventListener('focus', refreshDate)
    document.addEventListener('visibilitychange', refreshDate)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refreshDate)
      document.removeEventListener('visibilitychange', refreshDate)
    }
  }, [today])

  const done = dailyTasks.filter((task) => completed.includes(task.id)).length
  const progress = Math.round((done / dailyTasks.length) * 100)
  const tasks = activeSection === 'Dashboard'
    ? dailyTasks
    : activeSection === 'Wirebond'
      ? []
      : processTasks[activeSection]
  const sectionDone = tasks.filter((task) => completed.includes(task.id)).length
  const sectionTitle = activeSection === 'Dashboard' ? 'Daily checklist' : activeSection === 'Wirebond' ? 'WPT POC' : `${activeSection} checklist`
  const sectionDescription = activeSection === 'Dashboard'
    ? 'A clear start, a steady shift, a clean handover.'
    : activeSection === 'Wirebond'
      ? 'Add sentences and copy them when needed.'
      : `A quick readiness check for your ${activeSection.toLowerCase()} workflow.`

  function toggleTask(id: string) {
    const now = currentDate()
    const currentCompleted = dateKey(now) === dateKey(today) ? completed : loadCompleted(now)
    const next = currentCompleted.includes(id) ? currentCompleted.filter((taskId) => taskId !== id) : [...currentCompleted, id]
    setToday(now)
    setCompleted(next)
    localStorage.setItem(dateKey(now), JSON.stringify(next))
  }

  function clearCompleted() {
    const now = currentDate()
    const currentCompleted = dateKey(now) === dateKey(today) ? completed : loadCompleted(now)
    const taskIds = tasks.map((task) => task.id)
    const next = currentCompleted.filter((id) => !taskIds.includes(id))
    setToday(now)
    setCompleted(next)
    localStorage.setItem(dateKey(now), JSON.stringify(next))
  }

  function addWirebondTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTaskTitle.trim()
    if (!title) return

    const next = [...customWirebondTasks, { id: `wb-custom-${crypto.randomUUID()}`, title, group: 'ADDED CHECK' }]
    try {
      localStorage.setItem(wirebondTasksStorageKey, JSON.stringify(next))
      setCustomWirebondTasks(next)
      setNewTaskTitle('')
      setTaskMessage('Checklist item added.')
    } catch {
      setTaskMessage('Could not save this checklist item. Please try again.')
    }
  }

  function addImportantNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newNoteTitle.trim()
    if (!title) return

    const next = [...importantNotes, { id: `wb-note-${crypto.randomUUID()}`, title, group: 'IMPORTANT NOTE' }]
    try {
      localStorage.setItem(wirebondNotesStorageKey, JSON.stringify(next))
      setImportantNotes(next)
      setNewNoteTitle('')
      setNoteMessage('Important note added.')
    } catch {
      setNoteMessage('Could not save this note. Please try again.')
    }
  }

  async function copyWirebondTask(task: Task) {
    try {
      await navigator.clipboard.writeText(task.detail ? `${task.title}\n${task.detail}` : task.title)
      setTaskMessage(`Copied “${task.title}”.`)
    } catch {
      setTaskMessage('Could not copy this item. Check clipboard permissions and try again.')
    }
  }

  async function copyImportantNote(note: Task) {
    try {
      await navigator.clipboard.writeText(note.title)
      setNoteMessage(`Copied “${note.title}”.`)
    } catch {
      setNoteMessage('Could not copy this note. Check clipboard permissions and try again.')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" type="button" onClick={() => setActiveSection('Dashboard')} aria-label="Tech Essentials home">
          <span className="brand-mark">T<span>.</span></span><span className="brand-name"><span>TECH</span><span>ESSENTIALS</span></span>
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {sections.map((section, index) => <button className={`nav-item ${activeSection === section ? 'is-active' : ''}`} key={section} onClick={() => setActiveSection(section)} type="button"><span className="nav-index">{String(index + 1).padStart(2, '0')}</span><span>{section}</span>{activeSection === section && <span className="nav-indicator" />}</button>)}
        </nav>
        <div className="sidebar-bottom"><span className="live-dot" /><span>SHIFT TOOLKIT</span><span className="sidebar-version">v1.0</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>TECH ESSENTIALS</span><span className="crumb-slash">/</span>{activeSection.toUpperCase()}</div>
          <div className="today-label"><span className="calendar-mark" aria-hidden="true">▦</span>{today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </header>
        {activeSection !== 'Dashboard' && <section className="welcome-band">
          <div className="welcome-copy"><div className="eyebrow"><span className="eyebrow-line" /> YOUR SHIFT, IN FOCUS</div><h1>Make today <span>count.</span></h1><p>Everything you need to stay ready, precise, and on track.</p></div>
          <div className="progress-panel"><div className="progress-ring" style={{ '--progress': `${progress}%` } as React.CSSProperties}><div className="progress-inner"><strong>{progress}<small>%</small></strong><span>COMPLETE</span></div></div><div className="progress-caption"><strong>{done} of {dailyTasks.length}</strong><span>daily checks done</span></div><div className="progress-ornament" aria-hidden="true">{String(done).padStart(2, '0')}<i> / </i>{String(dailyTasks.length).padStart(2, '0')}</div></div>
          <div className="band-stamp" aria-hidden="true"><span>TE</span><small>FIELD<br />NOTES</small></div>
        </section>}

        <div className="content-wrap">
          {activeSection !== 'Wirebond' && <div className="section-heading"><div><div className="section-kicker">TODAY'S WORKSPACE</div><h2>{sectionTitle}</h2><p>{sectionDescription}</p></div><button className="text-action" type="button" onClick={clearCompleted} disabled={!tasks.some((task) => completed.includes(task.id))}><span aria-hidden="true">↺</span> Reset checks</button></div>}
          {activeSection === 'Wirebond' ? <div className="wirebond-cards">
            <section className="wirebond-poc" aria-label="WPT POC sentences">
            <header className="wirebond-card-heading"><div><div className="section-kicker">TODAY'S WORKSPACE</div><h2>WPT POC</h2><p>Add sentences and copy them when needed.</p></div><span className="wirebond-card-count">{String(customWirebondTasks.length).padStart(2, '0')} SENTENCES</span></header>
            <form className="add-task-form" onSubmit={addWirebondTask}><label className="sr-only" htmlFor="wirebond-task">Add a sentence</label><input id="wirebond-task" value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Enter a sentence" /><button type="submit" disabled={!newTaskTitle.trim()}>Add</button></form>
            <p className="task-message" aria-live="polite">{taskMessage}</p>
            {customWirebondTasks.length > 0 ? <ul className="wirebond-sentence-list">{customWirebondTasks.map((task) => <li className="wirebond-sentence" key={task.id}><span>{task.title}</span><button className="copy-task" type="button" onClick={() => void copyWirebondTask(task)} aria-label={`Copy ${task.title}`}>Copy</button></li>)}</ul> : <p className="wirebond-empty">Your added sentences will appear here.</p>}
            </section>
            <section className="wirebond-poc important-notes" aria-label="Important notes">
              <header className="wirebond-card-heading"><div><div className="section-kicker">REFERENCE</div><h2>Important Notes</h2><p>Keep key reminders close at hand.</p></div><span className="wirebond-card-count">{String(importantNotes.length).padStart(2, '0')} NOTES</span></header>
              <form className="add-task-form" onSubmit={addImportantNote}><label className="sr-only" htmlFor="important-note">Add an important note</label><input id="important-note" value={newNoteTitle} onChange={(event) => setNewNoteTitle(event.target.value)} placeholder="Enter an important note" /><button type="submit" disabled={!newNoteTitle.trim()}>Add</button></form>
              <p className="task-message" aria-live="polite">{noteMessage}</p>
              {importantNotes.length > 0 ? <ul className="wirebond-sentence-list">{importantNotes.map((note) => <li className="wirebond-sentence" key={note.id}><span>{note.title}</span><button className="copy-task" type="button" onClick={() => void copyImportantNote(note)} aria-label={`Copy ${note.title}`}>Copy</button></li>)}</ul> : <p className="wirebond-empty">Your important notes will appear here.</p>}
            </section>
          </div> : <div className="workspace-grid">
            <section className="checklist" aria-label={sectionTitle}>
              <div className="checklist-meta"><span>{activeSection === 'Dashboard' ? 'SHIFT ROUTINE' : `${activeSection.toUpperCase()} READINESS`}</span><span>{String(tasks.length).padStart(2, '0')} ITEMS</span></div>
              {tasks.map((task, index) => <label className={`task-row ${completed.includes(task.id) ? 'is-complete' : ''}`} key={task.id}><input type="checkbox" checked={completed.includes(task.id)} onChange={() => toggleTask(task.id)} /><span className="custom-check" aria-hidden="true"><span>✓</span></span><span className="task-number">{String(index + 1).padStart(2, '0')}</span><span className="task-copy"><span className="task-group">{task.group}</span><strong>{task.title}</strong>{task.detail && <small>{task.detail}</small>}</span><span className="task-tick" aria-hidden="true">↗</span></label>)}
              <div className="checklist-foot"><span><i className="live-dot" /> SAVED AUTOMATICALLY</span><span>{sectionDone}/{tasks.length} COMPLETE{activeSection === 'Dashboard' ? ' TODAY' : ''}</span></div>
            </section>
            {activeSection === 'Dashboard' ? <aside className="dashboard-references" aria-label="Reference links"><div className="reference-heading"><div className="section-kicker">QUICK LOOKUP</div><h3>Reference links</h3></div>{resources.map((resource) => <a className="dashboard-reference" href={resource.url} key={resource.name} target="_blank" rel="noreferrer"><span className="dashboard-reference-copy"><strong>{resource.name}</strong><small>{resource.description}</small></span><span className="external-arrow" aria-label="Opens in a new tab">↗</span></a>)}</aside> : <aside className="side-notes"><div className="note-heading"><span>SHIFT NOTE</span><span className="note-star">✳</span></div><h3>Good work<br />starts with<br /><em>good habits.</em></h3><div className="note-rule" /><p>Always follow the current released work instructions and your site's safety procedures.</p><div className="note-bottom"><span>TECH ESSENTIALS</span><span>01 — 05</span></div></aside>}
          </div>}
          <footer className="page-footer"><span>KEEP IT CLEAR. KEEP IT MOVING.</span><span>TECH ESSENTIALS <b>·</b> {today.getFullYear()}</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
