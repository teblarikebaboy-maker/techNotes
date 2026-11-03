import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Section = 'Dashboard' | 'Wirebond' | 'Die attach' | 'MCA'
type Task = { id: string; title: string; detail?: string; group: string }
type HsjReference = { device: string; dieX: string; dieY: string; rubberTip: string; daCcName: string; note?: string }
type DaReferenceCard = { family: string; color: 'cyan' | 'gold' | 'yellow' | 'lavender' | 'magenta' | 'white' | 'gray' | 'lime' | 'peach'; references: HsjReference[] }

const sections: Section[] = ['Dashboard', 'Wirebond', 'Die attach', 'MCA']
const dailyTasks: Task[] = [
  { id: 'stand-alone', title: 'Stand Alone', group: 'DAILY CHECK' },
  { id: 'fuguai', title: 'FUGUAI', group: 'DAILY CHECK' },
  { id: '5s', title: '5S', group: 'DAILY CHECK' },
  { id: 'run-rate', title: 'Run Rate', group: 'DAILY CHECK' },
  { id: 'ENERCON', title: 'ENERCON', group: 'DAILY CHECK' },
  { id: 'non-pm-checklist', title: 'NON-PM Checklist', detail: 'Review today’s scheduled non-PM maintenance checks', group: 'DAILY CHECK' },
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
const hsjReferences: HsjReference[] = [
  { device: '1667', dieX: '62.2', dieY: '129.1', rubberTip: 'R3-74E', daCcName: 'PA0A8HSJ' },
  { device: '1826', dieX: '72', dieY: '125.2', rubberTip: 'R3-75E', daCcName: 'PA0CFHSJ' },
  { device: '1468', dieX: '46.5', dieY: '104.3', rubberTip: 'R3-73E', daCcName: 'PA07DHSJ' },
  { device: '7667', dieX: '62.2', dieY: '129.1', rubberTip: 'R3-74E', daCcName: 'PA159HSJ' },
  { device: '916671', dieX: '62.2', dieY: '129.1', rubberTip: 'R3-74E', daCcName: 'PA197HSG' },
  { device: '1617', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA08AHSJ' },
  { device: '1627', dieX: '61', dieY: '124.4', rubberTip: 'R3-74E', daCcName: 'PA08FHSJ' },
  { device: '7516', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA14EHSJ' },
]
const daReferenceCards: DaReferenceCard[] = [
  { family: 'HSJ', color: 'cyan', references: hsjReferences },
  { family: 'HSH', color: 'cyan', references: [
    { device: '1684', dieX: '56.3', dieY: '113.4', rubberTip: 'R3-125E', daCcName: 'PA0B7HSH' },
    { device: '1692', dieX: '65', dieY: '150.8', rubberTip: 'R3-75E', daCcName: 'PA0BEHSH' },
    { device: '1685', dieX: '56.3', dieY: '113.4', rubberTip: 'R3-125E', daCcName: 'PA0B8HSH' },
    { device: '7552', dieX: '83.1', dieY: '164.2', rubberTip: 'R3-130E', daCcName: 'PA156HSH' },
    { device: '7542', dieX: '62.2', dieY: '106.7', rubberTip: 'R3-74E', daCcName: 'PA150HSH' },
    { device: '1682', dieX: '51.97', dieY: '80.71', rubberTip: 'R3-124E', daCcName: 'PA0B3HSH' },
    { device: '1681', dieX: '62.2', dieY: '93.7', rubberTip: 'R3-32E', daCcName: 'PA0AFHSH' },
    { device: '7551', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA154HSH' },
    { device: '916921', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA476HSH' },
  ] },
  { family: 'HSG', color: 'cyan', references: [
    { device: '1667', dieX: '62.2', dieY: '129.1', rubberTip: 'R3-74E', daCcName: 'PA0A7HSG' },
    { device: '7516', dieX: '63.4', dieY: '124.4', rubberTip: 'R3-74E', daCcName: 'PA14DHSG' },
    { device: '916671', dieX: '62.2', dieY: '129.1', rubberTip: 'R3-74E', daCcName: 'PA197HSG' },
    { device: '9146', dieX: '63.8', dieY: '137.7', rubberTip: 'R3-74E', daCcName: 'PA193HSG' },
    { device: '1605', dieX: '65', dieY: '150.8', rubberTip: 'R3-75E', daCcName: 'PA082HSG' },
    { device: '1617', dieX: '60.2', dieY: '120.9', rubberTip: 'R3-74E', daCcName: 'PA089HSG' },
    { device: '7194', dieX: '65', dieY: '159.8', rubberTip: 'R3-75E', daCcName: 'PA10FHSG' },
    { device: '1627', dieX: '61', dieY: '124.4', rubberTip: 'R3-74E', daCcName: 'PA08EHSG' },
    { device: '971941', dieX: '65', dieY: '159.8', rubberTip: 'R3-75E', daCcName: 'PA1ABHSG' },
    { device: '175011', dieX: '150', dieY: '65', rubberTip: 'R3-75E', daCcName: 'PA0CAHSG' },
    { device: '1468', dieX: '46.5', dieY: '104.3', rubberTip: 'R3-73E', daCcName: 'PA07CHSG' },
    { device: '916831', dieX: '65', dieY: '105.5', rubberTip: 'R3-125E', daCcName: 'PA470HSG' },
    { device: '1691', dieX: '63.3', dieY: '149.5', rubberTip: 'R3-75E', daCcName: 'PA0BBHSG' },
    { device: '1601', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA081HSG' },
    { device: '1655', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA09BHSG' },
    { device: '7693', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA15FHSG' },
    { device: '7697', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA162HSG' },
    { device: '9180', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA1A1HSG' },
    { device: '1681', dieX: '60', dieY: '92', rubberTip: 'R3-32E', daCcName: 'PA0AEHSG' },
    { device: '9023', dieX: '79.5', dieY: '59.1', rubberTip: 'R3-32E', daCcName: '' },
    { device: '175021', dieX: '150.4', dieY: '65', rubberTip: 'R3-75E', daCcName: '' },
  ] },
  { family: 'TSL', color: 'gold', references: [
    { device: '1678', dieX: '81.5', dieY: '121.7', rubberTip: 'HTR3-108', daCcName: 'PA0ADTSL' },
    { device: '163012', dieX: '94.5', dieY: '76.8', rubberTip: 'HTR3-0175-0219', daCcName: 'PA093PSL' },
    { device: '901792', dieX: '69.7', dieY: '121.7', rubberTip: 'HTR3-108', daCcName: 'PA460TSL' },
  ] },
  { family: 'TKH', color: 'lavender', references: [
    { device: '901801', dieX: '69.7', dieY: '121.7', rubberTip: 'HTR3-108', daCcName: 'PA16ETKH' },
    { device: '1696', dieX: '63', dieY: '120.1', rubberTip: 'HTR3-108', daCcName: 'PA0C7TKH' },
    { device: '9195', dieX: '79.5', dieY: '137.8', rubberTip: 'HTR3-75', daCcName: 'PA1A7TKH' },
  ] },
  { family: 'PSL', color: 'magenta', references: [
    { device: '9179', dieX: '69.7', dieY: '121.7', rubberTip: 'HTR3-108', daCcName: 'PA1A0TSL' },
    { device: '1677', dieX: '81.5', dieY: '121.7', rubberTip: 'HTR3-108', daCcName: 'PA0ACPSL' },
    { device: '163011', dieX: '94.5', dieY: '76.8', rubberTip: 'HTR3-0175-0219', daCcName: 'PA093PSL' },
    { device: '163012', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA093PSL' },
    { device: '901791', dieX: '69.7', dieY: '121.7', rubberTip: 'HTR3-108 / HTR3-74', daCcName: 'PA16DPSL', note: 'needle chuck orientation +' },
    { device: '163021', dieX: '94.5', dieY: '76.8', rubberTip: 'HTR3-0175-0219', daCcName: '' },
    { device: '163001', dieX: '94.5', dieY: '76.8', rubberTip: 'HTR3-0175-0219', daCcName: '' },
  ] },
  { family: 'PSM', color: 'yellow', references: [
    { device: '169011', dieX: '97.6', dieY: '88.6', rubberTip: 'HTR3-0175-0219', daCcName: 'PA491PSM' },
    { device: '163511', dieX: '88.2', dieY: '88.6', rubberTip: 'HTR1A-050-080', daCcName: 'PA494PSM' },
    { device: '169012', dieX: '73.3', dieY: '95.3', rubberTip: 'HTR3-0175-0219', daCcName: 'PA495PSM' },
  ] },
  { family: 'TSM', color: 'yellow', references: [
    { device: '1668', dieX: '61', dieY: '122', rubberTip: 'HTR3-0175-0219', daCcName: 'PA468TSM' },
    { device: '173511', dieX: '', dieY: '', rubberTip: '', daCcName: 'PA482TSM' },
  ] },
  { family: 'PSL', color: 'gold', references: [
    { device: '163012', dieX: '94.5', dieY: '76.8', rubberTip: 'HTR3-0175-0219', daCcName: 'PA093PSL' },
  ] },
  { family: 'EUD', color: 'white', references: [
    { device: '919231', dieX: '79.5', dieY: '59.1', rubberTip: 'R3-32E', daCcName: 'PA1A4EUD' },
    { device: '9033', dieX: '122', dieY: '61.8', rubberTip: 'R3-74E', daCcName: 'PA170EUD' },
    { device: '9023', dieX: '79.5', dieY: '59.1', rubberTip: 'R3-32E', daCcName: 'PA16FEUD' },
    { device: '919332', dieX: '122', dieY: '61.8', rubberTip: 'R3-74E', daCcName: 'PA1A6EUD' },
    { device: '919333', dieX: '122', dieY: '61.8', rubberTip: 'R3-74E', daCcName: 'PA456EUD' },
    { device: '919331', dieX: '122', dieY: '61.8', rubberTip: 'R3-74E', daCcName: '' },
  ] },
  { family: 'TSE', color: 'gray', references: [
    { device: '9174', dieX: '65', dieY: '118.9', rubberTip: 'R3-74E', daCcName: 'PA19FTSE' },
    { device: '9173', dieX: '65', dieY: '118.9', rubberTip: 'R3-74E', daCcName: 'PA19ETSE' },
    { device: '1341', dieX: '65', dieY: '159.8', rubberTip: 'R3-75E', daCcName: 'PA065TSE' },
    { device: '7474', dieX: '65', dieY: '118.9', rubberTip: 'R3-74E', daCcName: 'PA13ATSE' },
    { device: '9172', dieX: '65', dieY: '118.9', rubberTip: 'R3-74E', daCcName: 'PA19DTSE' },
    { device: '9108', dieX: '45.3', dieY: '50.4', rubberTip: 'R3-02E', daCcName: 'PA178TSE' },
    { device: '1340', dieX: '64.6', dieY: '152.4', rubberTip: 'R3-75E', daCcName: 'PA065TSE' },
    { device: '8336', dieX: '57.5', dieY: '57.5', rubberTip: 'RE-03E', daCcName: '' },
    { device: '1875', dieX: '65', dieY: '118.9', rubberTip: 'R3-74E', daCcName: '' },
  ] },
  { family: 'TSN', color: 'yellow', references: [
    { device: '195101', dieX: '66.9', dieY: '126', rubberTip: 'HTR3-108', daCcName: 'PA0DETSN' },
    { device: '192001', dieX: '50.8', dieY: '91.7', rubberTip: '', daCcName: 'PA0DBTSN' },
    { device: '7699', dieX: '62.2', dieY: '135.4', rubberTip: 'HTR3-108', daCcName: 'PA164TSN' },
    { device: '195801', dieX: '75.8', dieY: '97.4', rubberTip: 'HTR3-0175-0219', daCcName: 'PA462TSN' },
    { device: '193021', dieX: '67.7', dieY: '128', rubberTip: 'HTR3-108', daCcName: '' },
    { device: '194801', dieX: '75.8', dieY: '101.8', rubberTip: 'HTR3-0175-0219', daCcName: 'PA463TSN' },
    { device: '916041', dieX: '82.2', dieY: '92.9', rubberTip: 'HTR3-0175-0219', daCcName: 'PA472TSN' },
    { device: '194501', dieX: '53.9', dieY: '103.1', rubberTip: 'HTR1A-050-080', daCcName: 'PA0DDTSN' },
  ] },
  { family: 'TSP', color: 'gold', references: [
    { device: '9143', dieX: '75.6', dieY: '142.5', rubberTip: 'HTR3-75', daCcName: 'PA192TSP' },
    { device: '9144', dieX: '75.6', dieY: '142.5', rubberTip: 'HTR3-75', daCcName: '' },
  ] },
  { family: 'TSL', color: 'lime', references: [
    { device: '901792', dieX: '69.7', dieY: '121.7', rubberTip: 'HTR3-108', daCcName: 'PA459PSL', note: 'needle chuck orientation +' },
    { device: '9', dieX: '0', dieY: '0', rubberTip: '0', daCcName: '0' },
  ] },
  { family: 'TSN', color: 'peach', references: [
    { device: '7684', dieX: '58.3', dieY: '102.8', rubberTip: 'HTR1A-050-080', daCcName: 'PA15BTSN' },
    { device: '195502', dieX: '64.7', dieY: '125', rubberTip: 'HTR3-108', daCcName: 'PA490TSN' },
    { device: '195501', dieX: '67.7', dieY: '128', rubberTip: 'HTR3-108', daCcName: 'PA0DFTSN' },
  ] },
]
const resources = [
  { name: 'OPCENTER', description: 'Semiconductor industry standards and resources', url: 'https://ampicamaprod.allegro.msad/CamstarPortal/default.htm#/login' },
  { name: 'FUGUAI', description: 'Electronics manufacturing standards', url: 'https://apps.powerapps.com/play/e/default-64a381f3-c476-46f3-be30-99406d2ef129/a/60fa7854-6e19-46cf-a12e-af5ac2b009fa?tenantId=64a381f3-c476-46f3-be30-99406d2ef129&hint=c46e0620-a7f1-421b-9697-9dd1bd62a6dc&sourcetime=1773211250806' },
  { name: 'DAILY OUTPUT', description: 'Measurement science and technology resources', url: 'http://ampimfgssrs/Reports_PROD/report/Reports/Camstar/Production/Interactive/Operations_Related_Reports/PROD_DAILY_PROCESSED_QTY_v2' },
  { name: '5S', description: 'Zone 30 BLDG2 Checklist of 5S Practices', url: 'https://allegromicro.sharepoint.com/sites/AMPIIntranet/SitePages/5s-Dashboard.aspx?web=1' },
  { name: 'WBCC', description: 'OPENS WIREBOND CC APP', url: 'https://ampiign/data/perspective/client/WirebondCC/' },
  { name: 'DACC', description: 'OPENS DIE ATTACH CC APP', url: 'https://ampiign/data/perspective/client/DieAttachCC/' },
  { name: 'NON-PM Checklist', description: 'Daily non-PM maintenance schedule', url: 'http://ampissrs/Reports_PROD/report/Reports/Camstar/Production/Subscriptions/MaintenanceReport/PROD_DAILY_MAINTENANCE_SCHEDULE' },
]
const wirebondTasksStorageKey = 'tech-essentials-wirebond-custom-tasks'
const wirebondNotesStorageKey = 'tech-essentials-wirebond-important-notes'
const folderDatabaseName = 'tech-essentials-settings'
const folderObjectStoreName = 'settings'
const databaseFolderSettingKey = 'database-folder'
type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: (options?: { mode?: 'read' }) => Promise<FileSystemDirectoryHandle>
}

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

function openFolderDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(folderDatabaseName, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(folderObjectStoreName)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open folder settings storage.'))
  })
}

async function loadDatabaseFolder() {
  const database = await openFolderDatabase()
  return new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
    const request = database.transaction(folderObjectStoreName, 'readonly')
      .objectStore(folderObjectStoreName)
      .get(databaseFolderSettingKey)
    request.onsuccess = () => {
      database.close()
      resolve((request.result as FileSystemDirectoryHandle | undefined) ?? null)
    }
    request.onerror = () => {
      database.close()
      reject(request.error ?? new Error('Could not load the saved folder.'))
    }
  })
}

async function saveDatabaseFolder(folder: FileSystemDirectoryHandle) {
  const database = await openFolderDatabase()
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(folderObjectStoreName, 'readwrite')
    transaction.objectStore(folderObjectStoreName).put(folder, databaseFolderSettingKey)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error ?? new Error('Could not save the selected folder.'))
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error ?? new Error('Saving the selected folder was cancelled.'))
    }
  })
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
  const [databaseFolderName, setDatabaseFolderName] = useState('')
  const [folderMessage, setFolderMessage] = useState('')

  useEffect(() => {
    loadDatabaseFolder()
      .then((folder) => {
        if (folder) setDatabaseFolderName(folder.name)
      })
      .catch(() => setFolderMessage('Could not load the saved folder selection.'))
  }, [])

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

  const tasks = activeSection === 'Dashboard'
    ? dailyTasks
    : activeSection === 'Wirebond'
      ? []
      : processTasks[activeSection]
  const sectionDone = tasks.filter((task) => completed.includes(task.id)).length
  const sectionTitle = activeSection === 'Dashboard' ? 'Daily checklist' : activeSection === 'Wirebond' ? 'WPT POC' : activeSection === 'Die attach' ? 'Die attach reference' : `${activeSection} checklist`
  const sectionDescription = activeSection === 'Dashboard'
    ? 'A clear start, a steady shift, a clean handover.'
    : activeSection === 'Wirebond'
      ? 'Add sentences and copy them when needed.'
      : activeSection === 'Die attach'
        ? 'Color-coded device and rubber tip references.'
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

  function removeWirebondTask(task: Task) {
    if (!window.confirm(`Are you sure you want to remove “${task.title}”?`)) return

    const next = customWirebondTasks.filter((item) => item.id !== task.id)
    try {
      localStorage.setItem(wirebondTasksStorageKey, JSON.stringify(next))
      setCustomWirebondTasks(next)
      setTaskMessage(`Removed “${task.title}”.`)
    } catch {
      setTaskMessage('Could not remove this item. Please try again.')
    }
  }

  function removeImportantNote(note: Task) {
    if (!window.confirm(`Are you sure you want to remove “${note.title}”?`)) return

    const next = importantNotes.filter((item) => item.id !== note.id)
    try {
      localStorage.setItem(wirebondNotesStorageKey, JSON.stringify(next))
      setImportantNotes(next)
      setNoteMessage(`Removed “${note.title}”.`)
    } catch {
      setNoteMessage('Could not remove this note. Please try again.')
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

  async function chooseDatabaseFolder() {
    const pickerWindow = window as DirectoryPickerWindow
    if (!pickerWindow.showDirectoryPicker) {
      setFolderMessage('Folder selection is not supported in this browser.')
      return
    }

    try {
      const folder = await pickerWindow.showDirectoryPicker({ mode: 'read' })
      await saveDatabaseFolder(folder)
      setDatabaseFolderName(folder.name)
      setFolderMessage('Folder selection remembered in this browser.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setFolderMessage('Could not remember this folder. Please try again.')
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
        <div className="content-wrap">
          {activeSection !== 'Wirebond' && <div className="section-heading"><div><div className="section-kicker">TODAY'S WORKSPACE</div><h2>{sectionTitle}</h2><p>{sectionDescription}</p></div>{activeSection !== 'Die attach' && <button className="text-action" type="button" onClick={clearCompleted} disabled={!tasks.some((task) => completed.includes(task.id))}><span aria-hidden="true">↺</span> Reset checks</button>}</div>}
          {activeSection === 'Wirebond' ? <div className="wirebond-cards">
            <section className="wirebond-poc" aria-label="WPT POC sentences">
            <header className="wirebond-card-heading"><div><div className="section-kicker">TODAY'S WORKSPACE</div><h2>WPT POC</h2><p>Add sentences and copy them when needed.</p></div><div className="wirebond-header-actions"><span className="wirebond-card-count">{String(customWirebondTasks.length).padStart(2, '0')} SENTENCES</span><button className="choose-folder" type="button" onClick={() => void chooseDatabaseFolder()}>Choose database folder</button></div></header>
            <p className="folder-selection" aria-live="polite">{databaseFolderName ? `Selected folder: ${databaseFolderName}` : 'No database folder selected.'} {folderMessage}</p>
            <form className="add-task-form" onSubmit={addWirebondTask}><label className="sr-only" htmlFor="wirebond-task">Add a sentence</label><input id="wirebond-task" value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Enter a sentence" /><button type="submit" disabled={!newTaskTitle.trim()}>Add</button></form>
            <p className="task-message" aria-live="polite">{taskMessage}</p>
            {customWirebondTasks.length > 0 ? <ul className="wirebond-sentence-list">{customWirebondTasks.map((task) => <li className="wirebond-sentence" key={task.id}><span>{task.title}</span><span className="sentence-actions"><button className="copy-task" type="button" onClick={() => void copyWirebondTask(task)} aria-label={`Copy ${task.title}`}><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="13" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v11A1.5 1.5 0 0 0 5.5 18H8" /></svg></button><button className="remove-task" type="button" onClick={() => removeWirebondTask(task)} aria-label={`Remove ${task.title}`}>×</button></span></li>)}</ul> : <p className="wirebond-empty">Your added sentences will appear here.</p>}
            </section>
            <section className="wirebond-poc important-notes" aria-label="Important notes">
              <header className="wirebond-card-heading"><div><div className="section-kicker">REFERENCE</div><h2>Important Notes</h2><p>Keep key reminders close at hand.</p></div><span className="wirebond-card-count">{String(importantNotes.length).padStart(2, '0')} NOTES</span></header>
              <form className="add-task-form" onSubmit={addImportantNote}><label className="sr-only" htmlFor="important-note">Add an important note</label><input id="important-note" value={newNoteTitle} onChange={(event) => setNewNoteTitle(event.target.value)} placeholder="Enter an important note" /><button type="submit" disabled={!newNoteTitle.trim()}>Add</button></form>
              <p className="task-message" aria-live="polite">{noteMessage}</p>
              {importantNotes.length > 0 ? <ul className="wirebond-sentence-list">{importantNotes.map((note) => <li className="wirebond-sentence" key={note.id}><span>{note.title}</span><span className="sentence-actions"><button className="copy-task" type="button" onClick={() => void copyImportantNote(note)} aria-label={`Copy ${note.title}`}><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="13" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v11A1.5 1.5 0 0 0 5.5 18H8" /></svg></button><button className="remove-task" type="button" onClick={() => removeImportantNote(note)} aria-label={`Remove ${note.title}`}>×</button></span></li>)}</ul> : <p className="wirebond-empty">Your important notes will appear here.</p>}
            </section>
          </div> : activeSection === 'Die attach' ? null : <div className="workspace-grid">
            <section className="checklist" aria-label={sectionTitle}>
              <div className="checklist-meta"><span>{activeSection === 'Dashboard' ? 'SHIFT ROUTINE' : `${activeSection.toUpperCase()} READINESS`}</span><span>{String(tasks.length).padStart(2, '0')} ITEMS</span></div>
              {tasks.map((task, index) => <label className={`task-row ${completed.includes(task.id) ? 'is-complete' : ''}`} key={task.id}><input type="checkbox" checked={completed.includes(task.id)} onChange={() => toggleTask(task.id)} /><span className="custom-check" aria-hidden="true"><span>✓</span></span><span className="task-number">{String(index + 1).padStart(2, '0')}</span><span className="task-copy"><span className="task-group">{task.group}</span><strong>{task.title}</strong>{task.detail && <small>{task.detail}</small>}</span><span className="task-tick" aria-hidden="true">↗</span></label>)}
              <div className="checklist-foot"><span><i className="live-dot" /> SAVED AUTOMATICALLY</span><span>{sectionDone}/{tasks.length} COMPLETE{activeSection === 'Dashboard' ? ' TODAY' : ''}</span></div>
            </section>
            {activeSection === 'Dashboard' ? <aside className="dashboard-references" aria-label="Reference links"><div className="reference-heading"><div className="section-kicker">QUICK LOOKUP</div><h3>Reference links</h3></div>{resources.map((resource) => <a className="dashboard-reference" href={resource.url} key={resource.name} target="_blank" rel="noreferrer"><span className="dashboard-reference-copy"><strong>{resource.name}</strong><small>{resource.description}</small></span><span className="external-arrow" aria-label="Opens in a new tab">↗</span></a>)}</aside> : <aside className="side-notes"><div className="note-heading"><span>SHIFT NOTE</span><span className="note-star">✳</span></div><h3>Good work<br />starts with<br /><em>good habits.</em></h3><div className="note-rule" /><p>Always follow the current released work instructions and your site's safety procedures.</p><div className="note-bottom"><span>TECH ESSENTIALS</span><span>01 — 05</span></div></aside>}
          </div>}
          {activeSection === 'Die attach' && <section className="da-reference-board" aria-label="Die attach device reference tables">
          {daReferenceCards.map((card, cardIndex) => {
            const cardTone = card.family === 'PSM' ? 'yellow' : card.family === 'TSM' ? 'gold' : card.color
            return (
              <article className={`da-reference-card da-reference-card--${cardTone}`} key={`${card.family}-${card.color}-${cardIndex}`}>
            <header className="da-reference-heading"><h3>{card.family}</h3></header>
            <table className="da-reference-table">
              <colgroup><col className="hsj-device-column" /><col className="hsj-die-column" /><col className="hsj-die-column" /><col className="hsj-rubber-column" /><col className="hsj-name-column" /></colgroup>
              <thead>
                <tr><th rowSpan={2} scope="col">DEVICE</th><th colSpan={2} scope="colgroup">DIE SIZE</th><th scope="col">RUBBER</th><th rowSpan={2} scope="col">DA CC NAME</th></tr>
                <tr><th scope="col">X</th><th scope="col">Y</th><th scope="col">TIP</th></tr>
              </thead>
              <tbody>
                {card.references.map((reference, rowIndex) => <tr key={`${reference.device}-${rowIndex}`}>
                  <th scope="row"><span className="da-reference-device">{reference.device}{reference.note && <span className="da-reference-note">{reference.note}<span aria-hidden="true"></span></span>}</span></th>
                  <td>{reference.dieX}</td>
                  <td>{reference.dieY}</td>
                  <td>{reference.rubberTip}</td>
                  <td>{reference.daCcName}</td>
                </tr>)}
              </tbody>
            </table>
          </article>
          )
        })}
          </section>}
          <footer className="page-footer"><span>KEEP IT CLEAR. KEEP IT MOVING.</span><span>TECH ESSENTIALS <b>·</b> {today.getFullYear()}</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
