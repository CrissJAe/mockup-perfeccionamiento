import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const ROLES = [
  {
    id: 'academico',
    label: 'Académico/a',
    user: 'Cristopher Jiménez',
    desc: 'Inicia solicitudes y consulta estado',
    views: ['nueva-solicitud', 'seguimiento', 'documentos'],
  },
  {
    id: 'dda',
    label: 'Director/a Dpto. (DDA)',
    user: 'Roberto Alcaíno',
    desc: 'Revisa y visa solicitudes de su departamento',
    views: ['bandeja-dda', 'seguimiento', 'documentos'],
  },
  {
    id: 'decano',
    label: 'Decano/a',
    user: 'Carmen Vidal',
    desc: 'Segunda visación antes del Comité CPA',
    views: ['bandeja-decanato', 'seguimiento', 'documentos'],
  },
  {
    id: 'scpa',
    label: 'Secretario/a CPA (SCPA)',
    user: 'Valeria Beratto',
    desc: 'Gestiona tabla del Comité y expedientes',
    views: ['bandeja-cpa', 'seguimiento', 'documentos', 'reportes'],
  },
  {
    id: 'vrae',
    label: 'Vicerrectoría (VRAE)',
    user: 'Marcelo Farías',
    desc: 'Consulta ejecutiva de reportes e indicadores',
    views: ['reportes', 'seguimiento'],
  },
]

const ALL_VIEWS = [
  { id: 'nueva-solicitud',  label: 'Nueva Solicitud' },
  { id: 'seguimiento',      label: 'Seguimiento' },
  { id: 'documentos',       label: 'Documentos' },
  { id: 'bandeja-dda',      label: 'Bandeja DDA' },
  { id: 'bandeja-decanato', label: 'Bandeja Decanato' },
  { id: 'bandeja-cpa',      label: 'Bandeja CPA' },
  { id: 'reportes',         label: 'Reportes' },
]

const etapas = [
  { n:1, label:'Solicitud enviada',   sub:'28/04/2026', state:'done' },
  { n:2, label:'Revisión DDA',        sub:'Aprobada',   state:'done' },
  { n:3, label:'Visación Decanato',   sub:'Aprobada',   state:'done' },
  { n:4, label:'Revisión Comité CPA', sub:'En curso',   state:'current' },
  { n:5, label:'Acta y beneficios',   sub:'Pendiente',  state:'pending' },
  { n:6, label:'SIAPER',              sub:'Pendiente',  state:'pending' },
  { n:7, label:'Resolución final',    sub:'Pendiente',  state:'pending' },
]
const etapasObs = [
  { n:1, label:'Solicitud enviada',     sub:'18/04/2026', state:'done' },
  { n:2, label:'Revisión DDA',          sub:'Observada',  state:'observed' },
  { n:3, label:'Corrección solicitada', sub:'Pendiente',  state:'pending' },
  { n:4, label:'Visación Decanato',     sub:'Pendiente',  state:'pending' },
  { n:5, label:'Comité CPA',            sub:'Pendiente',  state:'pending' },
  { n:6, label:'SIAPER',                sub:'Pendiente',  state:'pending' },
  { n:7, label:'Resolución final',      sub:'Pendiente',  state:'pending' },
]

function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>
}

function Panel({ title, children, className = '' }) {
  return (
    <div className={`panel ${className}`}>
      {title && <div className="panel-title">{title}</div>}
      {children}
    </div>
  )
}

function PageHead({ title, actions }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      <div className="page-head-actions">{actions}</div>
    </div>
  )
}

function FlowTrack({ steps }) {
  return (
    <div className="flow-track">
      {steps.map((s, i) => (
        <div key={s.n} className="flow-node-wrap">
          <div className={`flow-node ${s.state}`}>{s.state === 'done' ? '✓' : s.n}</div>
          {i < steps.length - 1 && <div className={`flow-line ${s.state === 'done' ? 'done' : ''}`} />}
          <div className="flow-caption"><strong>{s.label}</strong><span>{s.sub}</span></div>
        </div>
      ))}
    </div>
  )
}

function NoAccess({ view }) {
  return (
    <div className="no-access">
      <span className="lock-icon">🔒</span>
      <h2>Acceso restringido</h2>
      <p>Tu rol no tiene permiso para acceder a <strong>{view}</strong>. Cambia de rol en la barra superior para continuar.</p>
    </div>
  )
}

function Topbar({ role }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-icon">UBB</div>
        <span>Universidad del Bío-Bío</span>
      </div>
      <div className="topbar-actions">
        <button className="tb-chip w">WERKEN</button>
        <button className="tb-chip g">CORREO</button>
        <button className="tb-chip o">PERFIL EGRESO</button>
        <div className="tb-user">
          <span className="avatar">{role.user[0]}</span>
          <span>Bienvenid@, {role.user.split(' ')[0].toUpperCase()}</span>
        </div>
      </div>
    </header>
  )
}

function RoleBar({ roleId, setRoleId }) {
  return (
    <div className="role-bar">
      <strong>Simular rol:</strong>
      <div className="role-tabs">
        {ROLES.map(r => (
          <button
            key={r.id}
            className={`role-tab ${roleId === r.id ? 'active' : ''}`}
            onClick={() => setRoleId(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
      <span className="role-desc">— {ROLES.find(r => r.id === roleId)?.desc}</span>
    </div>
  )
}

function Sidebar({ view, setView, allowedViews }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input placeholder="Busca en este sitio..." />
      </div>
      <button className="sbi"><span className="sbi-dot" /><span className="sbi-label">Inicio</span></button>
      <div>
        <button className="sbi active">
          <span className="sbi-dot" />
          <span className="sbi-label">Perfeccionamiento Académico</span>
          <span className="sbi-arrow">▾</span>
        </button>
        <div className="submenu">
          {ALL_VIEWS.map(v => {
            const allowed = allowedViews.includes(v.id)
            return (
              <button
                key={v.id}
                className={`sbc ${view === v.id ? 'active' : ''} ${!allowed ? 'locked' : ''}`}
                onClick={() => setView(v.id)}
                title={!allowed ? 'Sin acceso para este rol' : ''}
              >
                {!allowed ? '🔒 ' : ''}{v.label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

function FileRow({ label }) {
  const [file, setFile] = useState(null)
  const ref = useRef()
  return (
    <div className="file-row">
      <span className="file-label">{label}</span>
      <span className="file-ext">PDF</span>
      {file
        ? <><span className="file-name">📄 {file.name}</span><button className="btn-remove" onClick={() => setFile(null)}>Quitar</button></>
        : <><button className="btn sec sml" onClick={() => ref.current.click()}>Seleccionar archivo</button>
            <input ref={ref} type="file" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])} /></>
      }
    </div>
  )
}

function NuevaSolicitud() {
  return (
    <div className="page">
      <PageHead
        title="Nueva Solicitud de Perfeccionamiento"
        actions={<><button className="btn sec">Guardar borrador</button><button className="btn pri">Enviar solicitud</button></>}
      />
      <Panel title="Antecedentes del académico/a">
        <div className="form-grid cols3">
          <label><span>Apellido Paterno</span><input defaultValue="Jiménez" /></label>
          <label><span>Apellido Materno</span><input defaultValue="Aedo" /></label>
          <label><span>Nombres</span><input defaultValue="Cristopher Andrés" /></label>
          <label><span>Facultad</span><input defaultValue="Ciencias Empresariales" /></label>
          <label><span>Departamento</span><input defaultValue="Sistemas de Información" /></label>
          <label><span>Año ingreso UBB</span><input defaultValue="2015" /></label>
          <label><span>Tipo de Jornada</span><select><option>Completa</option><option>Media Jornada</option></select></label>
          <label className="col2"><span>Email institucional</span><input defaultValue="cristopher.jimenez@ubiobio.cl" /></label>
        </div>
      </Panel>
      <Panel title="Antecedentes del perfeccionamiento">
        <div className="form-grid cols3">
          <label><span>Tipo de perfeccionamiento</span>
            <select><option>Postgrado</option><option>Curso</option><option>Diplomado</option><option>Pasantía</option><option>Otro</option></select>
          </label>
          <label><span>Grado al que postula</span><input placeholder="Doctor/a" /></label>
          <label><span>Nombre del programa</span><input placeholder="Doctorado en Educación" /></label>
          <label className="col2"><span>Institución de destino</span><input placeholder="Institución" /></label>
          <label><span>País</span><input placeholder="País" /></label>
          <label><span>Fecha de inicio</span><input placeholder="dd/mm/aaaa" /></label>
          <label><span>Fecha de término</span><input placeholder="dd/mm/aaaa" /></label>
          <label><span>Fecha de salida UBB</span><input placeholder="dd/mm/aaaa" /></label>
          <label className="col2"><span>Financiamiento externo</span><input placeholder="Beca o convenio (si aplica)" /></label>
        </div>
      </Panel>
      <Panel title="Beneficios solicitados a la Universidad del Bío-Bío">
        <div className="benefits-grid">
          {['Mantención Total de Remuneraciones','Liberación de Jornada','Beca UBB','Pasajes','Matrículas y Aranceles','Seguro de Salud','Reemplazo Docente'].map(b => (
            <label key={b} className="benefit-row"><input type="checkbox" /> {b}</label>
          ))}
        </div>
      </Panel>
      <Panel title="Razones que motivan la petición de patrocinio">
        <textarea className="form-grid" style={{width:'100%',resize:'vertical',padding:'10px',border:'1px solid #c3ced8',height:'100px'}} placeholder="Ingrese la fundamentación académica y estratégica de su solicitud..." />
      </Panel>
      <Panel title="Adjuntar documentos requeridos">
        <p className="upload-hint">
          Adjunte los documentos requeridos según el Reglamento.
        </p>
        <div className="upload-list">
          {['Constancia de aceptación','Antecedentes del programa','Beca o financiamiento externo','Carta patrocinio Director/a Departamento','Carta patrocinio Decano/a Facultad'].map((d, i) => (
            <FileRow key={i} label={d} />
          ))}
        </div>
      </Panel>
    </div>
  )
}

function Seguimiento({ roleId }) {
  const canSeeAll = roleId !== 'academico'
  return (
    <div className="page">
      <PageHead title="Seguimiento de Resolución" actions={<button className="btn sec">Imprimir</button>} />
      {canSeeAll && (
        <Panel className="filter-panel">
          <label><span>Folio</span><input placeholder="PA-2026-..." /></label>
          <label><span>Unidad</span><select><option>Todas</option></select></label>
          <label><span>Estado</span><select><option>Todos</option><option>Pendiente</option><option>Observada</option></select></label>
          <button className="btn pri">Buscar</button>
        </Panel>
      )}
      <Panel title={canSeeAll ? 'Solicitud PA-2026-014 — Cristopher Jiménez' : 'Mi solicitud — PA-2026-014'}>
        <FlowTrack steps={etapas} />
      </Panel>
      <div className="two-col">
        <Panel title="Detalle solicitud N° 14">
          <div className="detail-grid">
            <div><span>Folio</span><strong>PA-2026-014</strong></div>
            <div><span>Estado</span><Badge type="blue">En Comité CPA</Badge></div>
            <div><span>Programa</span><strong>Doctorado en Educación</strong></div>
            <div><span>Institución</span><strong>Univ. de Granada, España</strong></div>
            <div><span>Período</span><strong>Ago 2026 – Jul 2030</strong></div>
            <div><span>Beneficios</span><strong>Arancel, comisión de servicio</strong></div>
          </div>
        </Panel>
        <Panel title="Historial de eventos">
          {[
            ['28/04/2026', 'Solicitud enviada por el académico.'],
            ['29/04/2026', 'Director(a) de Departamento autoriza la postulación.'],
            ['30/04/2026', 'Decano(a) autoriza y remite al Comité CPA.'],
            ['02/05/2026', 'Secretaría CPA incorpora el caso a la tabla.'],
          ].map(([d, t]) => (
            <div key={d} className="hist-row"><strong>{d}</strong><p>{t}</p></div>
          ))}
        </Panel>
      </div>
      <Panel title="Solicitud PA-2026-011 — Con observaciones" className="obs-panel">
        <FlowTrack steps={etapasObs} />
        <div className="obs-alert">⚠ Esta solicitud fue observada en Revisión DDA. El académico debe corregir los antecedentes para continuar el flujo.</div>
      </Panel>
    </div>
  )
}

function Documentos() {
  return (
    <div className="page">
      <PageHead title="Documentos de la Solicitud" actions={<button className="btn pri">Subir PDF</button>} />
      <Panel>
        <table>
          <thead><tr><th>Documento</th><th>Formato</th><th>Estado</th><th>Fecha</th><th>Acción</th></tr></thead>
          <tbody>
            {[
              ['Ficha FPPA','PDF','ok','Cargado','28/04/2026'],
              ['Constancia aceptación','PDF','blue','En revisión','29/04/2026'],
              ['Antecedentes programa','PDF','ok','Cargado','28/04/2026'],
              ['Carta patrocinio DDA','PDF','warn','Pendiente','—'],
              ['Carta patrocinio Decano','PDF','warn','Pendiente','—'],
            ].map(([doc,fmt,tipo,est,fecha]) => (
              <tr key={doc}>
                <td>{doc}</td><td>{fmt}</td>
                <td><Badge type={tipo}>{est}</Badge></td>
                <td>{fecha}</td>
                <td><button className="link-act">Ver</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

function Bandeja({ title, showActions }) {
  const [comentario, setComentario] = useState('')
  return (
    <div className="page">
      <PageHead title={title} actions={<button className="btn sec">Exportar</button>} />
      <Panel className="filter-panel">
        <label><span>Estado</span><select><option>Todas</option><option>Pendientes</option><option>Observadas</option></select></label>
        <label><span>Unidad</span><select><option>Seleccione…</option></select></label>
        <label><span>Fecha</span><input placeholder="dd/mm/aaaa" /></label>
        <button className="btn pri">Buscar</button>
      </Panel>
      <Panel>
        <table>
          <thead><tr><th>Folio</th><th>Académico/a</th><th>Programa</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>
            {[
              ['PA-2026-014','Cristopher Jiménez','Doctorado en Educación','blue','Pendiente'],
              ['PA-2026-013','María Pérez','Magíster en Gestión','warn','Observada'],
              ['PA-2026-009','Juan Soto','Pasantía internacional','ok','Visada'],
            ].map(([folio, nombre, prog, tipo, est]) => (
              <tr key={folio}>
                <td>{folio}</td><td>{nombre}</td><td>{prog}</td>
                <td><Badge type={tipo}>{est}</Badge></td>
                <td><button className="link-act">Revisar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel title="Resolución — PA-2026-014 / Cristopher Jiménez">
        <FlowTrack steps={etapas} />
        <div className="vis-actions">
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Comentario u observación (opcional)..."
          />
          <button className="btn pri">✔ Aprobar</button>
          <button className="btn danger">✖ Rechazar</button>
        </div>
      </Panel>
    </div>
  )
}

function Reportes() {
  return (
    <div className="page">
      <PageHead title="Reportes y seguimiento" actions={<button className="btn sec">Exportar</button>} />
      <div className="stats-row">
        <Panel><span className="stat-label">Solicitudes 2026</span><strong className="stat-num">28</strong></Panel>
        <Panel><span className="stat-label">Tiempo promedio</span><strong className="stat-num">5,2 días</strong></Panel>
        <Panel><span className="stat-label">Con observaciones</span><strong className="stat-num">6</strong></Panel>
        <Panel><span className="stat-label">Finalizadas</span><strong className="stat-num">16</strong></Panel>
      </div>
      <Panel title="Distribución por etapa">
        {[['Revisión DDA',12,.58],['Decanato',7,.36],['Comité CPA',5,.28],['Finalizadas',16,.78]].map(([l,n,p]) => (
          <div key={l} className="bar-row"><span>{l}</span><div className="bar"><i style={{width:`${p*100}%`}} /></div><strong>{n}</strong></div>
        ))}
      </Panel>
    </div>
  )
}

function App() {
  const [roleId, setRoleId] = useState('academico')
  const [view, setView] = useState('nueva-solicitud')

  const role = ROLES.find(r => r.id === roleId)
  const allowedViews = role.views

  const handleRoleChange = (newRoleId) => {
    setRoleId(newRoleId)
    const newRole = ROLES.find(r => r.id === newRoleId)
    if (!newRole.views.includes(view)) {
      setView(newRole.views[0])
    }
  }

  const renderView = () => {
    if (!allowedViews.includes(view)) return <NoAccess view={ALL_VIEWS.find(v => v.id === view)?.label} />
    switch (view) {
      case 'nueva-solicitud':  return <NuevaSolicitud />
      case 'seguimiento':      return <Seguimiento roleId={roleId} />
      case 'documentos':       return <Documentos />
      case 'bandeja-dda':      return <Bandeja title="Bandeja DDA" />
      case 'bandeja-decanato': return <Bandeja title="Bandeja Decanato" />
      case 'bandeja-cpa':      return <Bandeja title="Bandeja Comité CPA" />
      case 'reportes':         return <Reportes />
      default:                 return <NuevaSolicitud />
    }
  }

  return (
    <div className="app">
      <Topbar role={role} />
      <RoleBar roleId={roleId} setRoleId={handleRoleChange} />
      <div className="body">
        <Sidebar view={view} setView={setView} allowedViews={allowedViews} />
        <main className="main">{renderView()}</main>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
