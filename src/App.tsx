import { useState } from 'react'
import './App.css'

type Section = 'Dashboard' | 'Wirebond' | 'Die attach' | 'MCA' | 'Links'
type Task = { id: string; title: string; detail?: string; group: string }

const sections: Section[] = ['Dashboard', 'Wirebond', 'Die attach', 'MCA', 'Links']
const dailyTasks: Task[] = [
  { id: 'stand-alone', title: 'Stand Alone', group: 'DAILY CHECK' },
  { id: 'fuguai', title: 'FUGUAI', group: 'DAILY CHECK' },
  { id: '5s', title: '5S', group: 'DAILY CHECK' },
  { id: 'run-rate', title: 'Run Rate', group: 'DAILY CHECK' },
]
const processTasks: Record<'Wirebond' | 'Die attach' | 'MCA', Task[]> = {
  Wirebond: [
    { id: 'wb-docs', title: 'Confirm released wirebond recipe', detail: 'Match the recipe revision to the traveler', group: 'BEFORE RUN' },
    { id: 'wb-tooling', title: 'Inspect capillary and tooling', detail: 'Check condition and verify the correct tooling is installed', group: 'BEFORE RUN' },
    { id: 'wb-material', title: 'Verify wire and material traceability', detail: 'Confirm material identity and lot documentation', group: 'BEFORE RUN' },
    { id: 'wb-first-piece', title: 'Complete first-piece verification', detail: 'Follow the released inspection plan and record results', group: 'IN PROCESS' },
    { id: 'wb-logs', title: 'Review process and maintenance logs', detail: 'Document any interruptions or tooling changes', group: 'CLOSEOUT' },
  ],
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
  { name: 'SEMI Standards', description: 'Semiconductor industry standards and resources', url: 'https://www.semi.org/en/standards' },
  { name: 'IPC Standards', description: 'Electronics manufacturing standards', url: 'https://www.ipc.org/standards' },
  { name: 'NIST', description: 'Measurement science and technology resources', url: 'https://www.nist.gov/' },
]

function dateKey() {
  const now = new Date()
  return `tech-essentials-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function App() {
  const [today] = useState(() => new Date())
  const [activeSection, setActiveSection] = useState<Section>('Dashboard')
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(dateKey()) ?? '[]') as string[]
    } catch {
      return []
    }
  })
  const done = dailyTasks.filter((task) => completed.includes(task.id)).length
  const progress = Math.round((done / dailyTasks.length) * 100)
  const tasks = activeSection === 'Dashboard' ? dailyTasks : activeSection === 'Links' ? [] : processTasks[activeSection]
  const sectionTitle = activeSection === 'Dashboard' ? 'Daily checklist' : activeSection === 'Links' ? 'Reference links' : `${activeSection} checklist`
  const sectionDescription = activeSection === 'Dashboard'
    ? 'A clear start, a steady shift, a clean handover.'
    : activeSection === 'Links'
      ? 'A few trusted places to find standards and technical references.'
      : `A quick readiness check for your ${activeSection.toLowerCase()} workflow.`

  function toggleTask(id: string) {
    const next = completed.includes(id) ? completed.filter((taskId) => taskId !== id) : [...completed, id]
    setCompleted(next)
    localStorage.setItem(dateKey(), JSON.stringify(next))
  }

  function clearCompleted() {
    const taskIds = tasks.map((task) => task.id)
    const next = completed.filter((id) => !taskIds.includes(id))
    setCompleted(next)
    localStorage.setItem(dateKey(), JSON.stringify(next))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" type="button" onClick={() => setActiveSection('Dashboard')} aria-label="Tech Essentials home">
          <span className="brand-mark">T<span>.</span></span><span className="brand-name">tech<span>essentials</span></span>
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
        <section className="welcome-band">
          <div className="welcome-copy"><div className="eyebrow"><span className="eyebrow-line" /> YOUR SHIFT, IN FOCUS</div><h1>Make today<br /><span>count.</span></h1><p>Everything you need to stay ready, precise, and on track.</p></div>
          <div className="progress-panel"><div className="progress-ring" style={{ '--progress': `${progress}%` } as React.CSSProperties}><div className="progress-inner"><strong>{progress}<small>%</small></strong><span>COMPLETE</span></div></div><div className="progress-caption"><strong>{done} of {dailyTasks.length}</strong><span>daily checks done</span></div><div className="progress-ornament" aria-hidden="true">{String(done).padStart(2, '0')}<i> / </i>{String(dailyTasks.length).padStart(2, '0')}</div></div>
          <div className="band-stamp" aria-hidden="true"><span>TE</span><small>FIELD<br />NOTES</small></div>
        </section>

        <div className="content-wrap">
          <div className="section-heading"><div><div className="section-kicker">TODAY'S WORKSPACE</div><h2>{sectionTitle}</h2><p>{sectionDescription}</p></div>{activeSection !== 'Links' && <button className="text-action" type="button" onClick={clearCompleted} disabled={!tasks.some((task) => completed.includes(task.id))}><span aria-hidden="true">↺</span> Reset checks</button>}</div>
          {activeSection === 'Links' ? <div className="resource-list">{resources.map((resource, index) => <a className="resource-row" href={resource.url} key={resource.name} target="_blank" rel="noreferrer"><span className="resource-number">0{index + 1}</span><span className="resource-copy"><strong>{resource.name}</strong><small>{resource.description}</small></span><span className="external-arrow" aria-label="Opens in a new tab">↗</span></a>)}</div> : <div className="workspace-grid">
            <section className="checklist" aria-label={sectionTitle}>
              <div className="checklist-meta"><span>{activeSection === 'Dashboard' ? 'SHIFT ROUTINE' : `${activeSection.toUpperCase()} READINESS`}</span><span>{String(tasks.length).padStart(2, '0')} ITEMS</span></div>
              {tasks.map((task, index) => <label className={`task-row ${completed.includes(task.id) ? 'is-complete' : ''}`} key={task.id}><input type="checkbox" checked={completed.includes(task.id)} onChange={() => toggleTask(task.id)} /><span className="custom-check" aria-hidden="true"><span>✓</span></span><span className="task-number">{String(index + 1).padStart(2, '0')}</span><span className="task-copy"><span className="task-group">{task.group}</span><strong>{task.title}</strong>{task.detail && <small>{task.detail}</small>}</span><span className="task-tick" aria-hidden="true">↗</span></label>)}
              <div className="checklist-foot"><span><i className="live-dot" /> SAVED AUTOMATICALLY</span><span>{done}/{dailyTasks.length} COMPLETE TODAY</span></div>
            </section>
            <aside className="side-notes"><div className="note-heading"><span>SHIFT NOTE</span><span className="note-star">✳</span></div><h3>Good work<br />starts with<br /><em>good habits.</em></h3><div className="note-rule" /><p>Always follow the current released work instructions and your site's safety procedures.</p><div className="note-bottom"><span>TECH ESSENTIALS</span><span>01 — 05</span></div></aside>
          </div>}
          {activeSection === 'Dashboard' && <section className="process-strip" aria-label="Process checklists"><div className="process-strip-title"><span>QUICK ACCESS</span><span>PROCESS CHECKLISTS</span></div><div className="process-links">{(['Wirebond', 'Die attach', 'MCA'] as const).map((section, index) => { const count = processTasks[section].filter((task) => completed.includes(task.id)).length; return <button type="button" className="process-link" key={section} onClick={() => setActiveSection(section)}><span className="process-code">0{index + 1}</span><span className="process-link-copy"><strong>{section}</strong><small>{count}/{processTasks[section].length} checks complete</small></span><span className="process-arrow">↗</span></button> })}</div></section>}
          <footer className="page-footer"><span>KEEP IT CLEAR. KEEP IT MOVING.</span><span>TECH ESSENTIALS <b>·</b> {today.getFullYear()}</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
