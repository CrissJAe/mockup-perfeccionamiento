import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const etapas = [
  { n: 1, label: 'Solicitud en trámite', sub: '28/04/2026', state: 'done' },
  { n: 2, label: 'Revisión Departamento', sub: 'Aprobada', state: 'done' },
  { n: 3, label: 'Revisión Facultad', sub: 'Aprobada', state: 'done' },
  { n: 4, label: 'Revisión Comité', sub: 'En curso', state: 'current' },
  { n: 5, label: 'Siaper', sub: 'Pendiente', state: 'pending' },
  { n: 6, label: 'Decretación', sub: 'Pendiente', state: 'pending' },
  { n: 7, label: 'Decretado', sub: 'Pendiente', state: 'pending' },
]

const etapasObs = [
  { n: 1, label: 'Solicitud en trámite', sub: '18/04/2026', state: 'done' },
  { n: 2, label: 'Revisión Departamento', sub: 'Observada', state: 'observed' },
  { n: 3, label: 'Corrección solicitada', sub: 'Pendiente', state: 'pending' },
  { n: 4, label: 'Revisión Facultad', sub: 'Pendiente', state: 'pending' },
  { n: 5, label: 'Revisión Comité', sub: 'Pendiente', state: 'pending' },
  { n: 6, label: 'Siaper', sub: 'Pendiente', state: 'pending' },
  { n: 7, label: 'Decretación', sub: 'Pendiente', state: 'pending' },
  { n: 8, label: 'Decretado', sub: 'Pendiente', state: 'pending' },
]

const SOLICITUDES = [
  {
    id: 'PA-2026-014',
    rut: '12.345.678-9',
    academico: 'Cristopher Jiménez',
    programa: 'Doctorado en Educación',
    institucion: 'Univ. de Granada, España',
    periodo: 'Ago 2026 – Jul 2030',
    beneficios: 'Arancel, comisión de servicio',
    badgeType: 'blue',
    badgeLabel: 'En trámite',
    etapas: etapas,
    historial: [
      { fecha: '28/04/2026', texto: 'Solicitud enviada por el académico.' },
      { fecha: '29/04/2026', texto: 'Departamento autoriza la postulación.' },
      { fecha: '30/04/2026', texto: 'Facultad autoriza.' },
      { fecha: '02/05/2026', texto: 'Revisión Comité en curso.' },
    ],
    obs: null,
  },
  {
    id: 'PA-2026-011',
    rut: '9.876.543-2',
    academico: 'María Pérez',
    programa: 'Magíster en Gestión',
    institucion: 'Univ. de Chile',
    periodo: 'Mar 2026 – Mar 2028',
    beneficios: 'Beca UBB, matrícula',
    badgeType: 'warn',
    badgeLabel: 'Observada',
    etapas: etapasObs,
    historial: [
      { fecha: '18/04/2026', texto: 'Solicitud enviada por la académica.' },
      { fecha: '20/04/2026', texto: 'Departamento observa la solicitud: falta constancia de aceptación.' },
    ],
    obs: 'Esta solicitud fue observada en Revisión Departamento. La académica debe corregir los antecedentes para continuar el flujo.',
  },
  {
    id: 'PA-2026-009',
    rut: '15.222.333-K',
    academico: 'Juan Soto',
    programa: 'Pasantía internacional',
    institucion: 'MIT, Estados Unidos',
    periodo: 'Jun 2026 – Dic 2026',
    beneficios: 'Pasajes, seguro de salud',
    badgeType: 'ok',
    badgeLabel: 'Aprobada',
    etapas: [
      { n: 1, label: 'Solicitud en trámite', sub: '01/03/2026', state: 'done' },
      { n: 2, label: 'Revisión Departamento', sub: 'Aprobada', state: 'done' },
      { n: 3, label: 'Revisión Facultad', sub: 'Aprobada', state: 'done' },
      { n: 4, label: 'Revisión Comité', sub: 'Aprobada', state: 'done' },
      { n: 5, label: 'Siaper', sub: 'Registrado', state: 'done' },
      { n: 6, label: 'Decretación', sub: 'Emitida', state: 'done' },
      { n: 7, label: 'Decretado', sub: '05/04/2026', state: 'done' },
    ],
    historial: [
      { fecha: '01/03/2026', texto: 'Solicitud enviada por el académico.' },
      { fecha: '03/03/2026', texto: 'Departamento aprueba.' },
      { fecha: '05/03/2026', texto: 'Facultad aprueba.' },
      { fecha: '10/03/2026', texto: 'Comité aprueba.' },
      { fecha: '15/03/2026', texto: 'Ingreso a SIAPER completado.' },
      { fecha: '05/04/2026', texto: 'Resolución decretada y notificada al académico.' },
    ],
    obs: null,
  },
]

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
    label: 'Director/a Dpto',
    user: 'Roberto Alcaíno',
    desc: 'Revisa y visa solicitudes de su departamento',
    views: ['bandeja', 'seguimiento', 'documentos'],
  },
  {
    id: 'decano',
    label: 'Decano/a',
    user: 'Carmen Vidal',
    desc: 'Segunda visación antes del Comité CPA',
    views: ['bandeja', 'seguimiento', 'documentos'],
  },
  {
    id: 'scpa',
    label: 'Comité',
    user: 'Valeria Beratto',
    desc: 'Tercera visación y gestiona expedientes',
    views: ['bandeja', 'seguimiento', 'documentos', 'reportes'],
  },
  {
    id: 'vra',
    label: 'VRA',
    user: 'Marcelo Farías',
    desc: 'Consulta ejecutiva de reportes e indicadores',
    views: ['reportes', 'seguimiento'],
  },
]

const ALL_VIEWS = [
  { id: 'nueva-solicitud', label: 'Nueva Solicitud' },
  { id: 'seguimiento', label: 'Seguimiento' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'bandeja', label: 'Bandeja' },
  { id: 'reportes', label: 'Reportes' },
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

  const [tipoPerfec, setTipoPerfec] = useState('Postgrado')
  const [gradoPostula, setGradoPostula] = useState('')
  const [beneficios, setBeneficios] = useState([])
  const [tipoJornada, setTipoJornada] = useState('')
  const [horasJornada, setHorasJornada] = useState('')
  const [montoMatricula, setMontoMatricula] = useState('')
  const [montoArancel, setMontoArancel] = useState('')
  const [montoBeca, setMontoBeca] = useState('')

  const toggleBeneficio = (b, uncheck) =>
    setBeneficios(prev => uncheck ? prev.filter(x => x !== b) : [...prev, b])

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
            <select value={tipoPerfec} onChange={e => { setTipoPerfec(e.target.value); setGradoPostula('') }}>
              <option value="Postgrado">Postgrado</option>
              <option value="Curso">Curso</option>
              <option value="Diplomado">Diplomado</option>
              <option value="Pasantía">Pasantía / Estadía</option>
              <option value="Otro">Postdoctorado</option>
            </select>
          </label>
          {tipoPerfec === 'Postgrado' && (
            <label><span>Grado al que postula</span>
              <select value={gradoPostula} onChange={e => setGradoPostula(e.target.value)}>
                <option value="">Seleccione...</option>
                <option value="Magíster">Magíster</option>
                <option value="Doctorado">Doctorado</option>
              </select>
            </label>
          )}
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
          <label className="benefit-row"><input type="checkbox" /> Mantención Total de Remuneraciones</label>
          <div className={beneficios.includes('Liberación de Jornada') ? 'benefit-item-expanded' : 'benefit-item'}>
            <label className="benefit-row">
              <input type="checkbox"
                checked={beneficios.includes('Liberación de Jornada')}
                onChange={e => {
                  toggleBeneficio('Liberación de Jornada', !e.target.checked)
                  if (!e.target.checked) { setTipoJornada(''); setHorasJornada('') }
                }}
              /> Liberación de Jornada
            </label>
            {beneficios.includes('Liberación de Jornada') && (
              <div className="benefit-sub">
                {['Jornada completa', 'Jornada media', 'Jornada por horas'].map(op => (
                  <label key={op} className="benefit-row">
                    <input type="radio" name="tipoJornada" value={op}
                      checked={tipoJornada === op}
                      onChange={e => { setTipoJornada(e.target.value); setHorasJornada('') }}
                    /> {op}
                  </label>
                ))}
                {tipoJornada === 'Jornada por horas' && (
                  <label className="benefit-row">
                    <span style={{ marginRight: '0.5rem' }}>Cantidad de horas:</span>
                    <input type="number" min="1" placeholder="Ej: 10"
                      value={horasJornada} onChange={e => setHorasJornada(e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
          <div className={beneficios.includes('Beca UBB') ? 'benefit-item-expanded' : 'benefit-item'}>
            <label className="benefit-row">
              <input type="checkbox"
                checked={beneficios.includes('Beca UBB')}
                onChange={e => {
                  toggleBeneficio('Beca UBB', !e.target.checked)
                  if (!e.target.checked) setMontoBeca('')
                }}
              /> Beca UBB
            </label>
            {beneficios.includes('Beca UBB') && (
              <div className="benefit-sub">
                <label className="benefit-row">
                  <span style={{ marginRight: '0.5rem' }}>Monto ($):</span>
                  <input type="number" min="0" placeholder="Ej: 500000"
                    value={montoBeca} onChange={e => setMontoBeca(e.target.value)}
                    style={{ width: '160px' }}
                  />
                </label>
              </div>
            )}
          </div>
          <label className="benefit-row"><input type="checkbox" /> Pasajes</label>
          <div className={beneficios.includes('Matrícula') ? 'benefit-item-expanded' : 'benefit-item'}>
            <label className="benefit-row">
              <input type="checkbox"
                checked={beneficios.includes('Matrícula')}
                onChange={e => {
                  toggleBeneficio('Matrícula', !e.target.checked)
                  if (!e.target.checked) setMontoMatricula('')
                }}
              /> Matrícula
            </label>
            {beneficios.includes('Matrícula') && (
              <div className="benefit-sub">
                <label className="benefit-row">
                  <span style={{ marginRight: '0.5rem' }}>Monto ($):</span>
                  <input type="number" min="0" placeholder="Ej: 200000"
                    value={montoMatricula} onChange={e => setMontoMatricula(e.target.value)}
                    style={{ width: '160px' }}
                  />
                </label>
              </div>
            )}
          </div>
          <div className={beneficios.includes('Arancel') ? 'benefit-item-expanded' : 'benefit-item'}>
            <label className="benefit-row">
              <input type="checkbox"
                checked={beneficios.includes('Arancel')}
                onChange={e => {
                  toggleBeneficio('Arancel', !e.target.checked)
                  if (!e.target.checked) setMontoArancel('')
                }}
              /> Arancel
            </label>
            {beneficios.includes('Arancel') && (
              <div className="benefit-sub">
                <label className="benefit-row">
                  <span style={{ marginRight: '0.5rem' }}>Monto ($):</span>
                  <input type="number" min="0" placeholder="Ej: 1500000"
                    value={montoArancel} onChange={e => setMontoArancel(e.target.value)}
                    style={{ width: '160px' }}
                  />
                </label>
              </div>
            )}
          </div>
          <label className="benefit-row"><input type="checkbox" /> Seguro de Salud</label>
          <label className="benefit-row"><input type="checkbox" /> Reemplazo Docente</label>

        </div>
      </Panel>
      <Panel title="Razones que motivan la petición de patrocinio">
        <textarea className="form-grid" style={{ width: '100%', resize: 'vertical', padding: '10px', border: '1px solid #c3ced8', height: '100px' }} placeholder="Ingrese la fundamentación académica y estratégica de su solicitud..." />
      </Panel>
      <Panel title="Adjuntar documentos requeridos">
        <p className="upload-hint">
          Adjunte los documentos requeridos según el Reglamento.
        </p>
        <div className="upload-list">
          {['Constancia de aceptación / invitación', 'Antecedentes del programa', 'Beca o financiamiento externo', 'Otros'].map((d, i) => (
            <FileRow key={i} label={d} />
          ))}
        </div>
      </Panel>
    </div>
  )
}

function HistorialModal({ sol, onClose }) {
  if (!sol) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Historial — {sol.id}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-divider" />

        <div className="modal-section-title">Estado de la solicitud</div>
        <div className="modal-flow-wrap">
          <FlowTrack steps={sol.etapas} />
        </div>
        <div className="modal-divider" />

        <div className="modal-section-title">Detalle</div>
        <div className="modal-detail-grid">
          <div><span>Folio</span><strong>{sol.id}</strong></div>
          <div><span>Estado</span><Badge type={sol.badgeType}>{sol.badgeLabel}</Badge></div>
          <div><span>Académico/a</span><strong>{sol.academico}</strong></div>
          <div><span>Programa</span><strong>{sol.programa}</strong></div>
          <div><span>Institución</span><strong>{sol.institucion}</strong></div>
          <div><span>Período</span><strong>{sol.periodo}</strong></div>
          <div><span>Beneficios</span><strong>{sol.beneficios}</strong></div>
        </div>
        <div className="modal-divider" />

        <div className="modal-section-title">Historial</div>
        <table className="modal-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Evento</th>
            </tr>
          </thead>
          <tbody>
            {sol.historial.map((h, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: 'nowrap' }}>{h.fecha}</td>
                <td>{h.texto}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sol.obs && (
          <div className="obs-alert" style={{ marginTop: '1rem' }}>⚠ {sol.obs}</div>
        )}

        <div className="modal-footer">
          <button className="btn danger" onClick={onClose}>✕ Cerrar</button>
        </div>
      </div>
    </div>
  )
}

function Seguimiento({ roleId }) {
  const canSeeAll = roleId !== 'academico'
  const baseList = canSeeAll ? SOLICITUDES : SOLICITUDES.filter(s => s.id === 'PA-2026-014')

  const [modalSol, setModalSol] = useState(null)
  const [filtroRut, setFiltroRut] = useState('')
  const [filtroUnidad, setFiltroUnidad] = useState('Todas')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [lista, setLista] = useState(baseList)

  const handleBuscar = () => {
    let result = baseList
    if (filtroRut.trim() !== '') {
      result = result.filter(s =>
        s.rut.replace(/\./g, '').replace(/-/g, '')
          .includes(filtroRut.trim().replace(/\./g, '').replace(/-/g, ''))
      )
    }
    if (filtroEstado !== 'Todos') {
      result = result.filter(s => s.badgeLabel === filtroEstado)
    }
    setLista(result)
  }

  const handleLimpiar = () => {
    setFiltroRut('')
    setFiltroUnidad('Todas')
    setFiltroEstado('Todos')
    setLista(baseList)
  }

  return (
    <div className="page">
      <PageHead title="Seguimiento de Resolución" actions={<button className="btn sec">Imprimir</button>} />

      {canSeeAll && (
        <Panel className="filter-panel">
          <label>
            <span>RUT Académico/a</span>
            <input
              placeholder="Ej: 12.345.678-9"
              value={filtroRut}
              onChange={e => setFiltroRut(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBuscar()}
            />
          </label>
          <label>
            <span>Unidad</span>
            <select value={filtroUnidad} onChange={e => setFiltroUnidad(e.target.value)}>
              <option>Todas</option>
            </select>
          </label>
          <label>
            <span>Estado</span>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option>Todos</option>
              <option>En trámite</option>
              <option>Observada</option>
              <option>Aprobada</option>
              <option>Rechazada</option>
            </select>
          </label>
          <div className="filter-btns">
            <button className="btn pri" onClick={handleBuscar}>Buscar</button>
            <button className="btn sec" onClick={handleLimpiar}>Limpiar</button>
          </div>
        </Panel>
      )}

      <Panel title="Solicitudes">
        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>RUT</th>
              <th>Académico/a</th>
              <th>Programa</th>
              <th>Estado</th>
              <th>Historial</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#7a8fa6', padding: '1.5rem' }}>
                  No se encontraron solicitudes para el RUT ingresado.
                </td>
              </tr>
            ) : (
              lista.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{s.rut}</td>
                  <td>{s.academico}</td>
                  <td>{s.programa}</td>
                  <td><Badge type={s.badgeType}>{s.badgeLabel}</Badge></td>
                  <td>
                    <button
                      className="btn-historial"
                      title="Ver historial"
                      onClick={() => setModalSol(s)}
                    >
                      &#8943;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>

      <HistorialModal sol={modalSol} onClose={() => setModalSol(null)} />
    </div>
  )
}

function Documentos({ roleId }) {
  const canUploadPdf = roleId === 'academico'

  return (
    <div className="page">
      <PageHead
        title="Documentos de la Solicitud"
        actions={canUploadPdf ? <button className="btn pri">Subir PDF</button> : null}
      />
      <Panel>
        <table>
          <thead><tr><th>Documento</th><th>Formato</th><th>Estado</th><th>Fecha</th><th>Acción</th></tr></thead>
          <tbody>
            {[
              ['Ficha Postulación', 'PDF', 'ok', 'Cargado', '28/04/2026'],
              ['Constancia aceptación / invitación', 'PDF', 'ok', 'Cargado', '29/04/2026'],
              ['Antecedentes programa', 'PDF', 'ok', 'Cargado', '28/04/2026'],
              ['Beca o financiamiento externo', 'PDF', 'blue', 'Pendiente', '—'],
              ['Otros', 'PDF', 'blue', 'Pendiente', '—'],
            ].map(([doc, fmt, tipo, est, fecha]) => (
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
        <label><span>Estado</span><select><option>Todos</option><option>Pendiente</option><option>Observada</option></select></label>
        <label><span>Unidad</span><select><option>Seleccione…</option></select></label>
        <label><span>Fecha</span><input placeholder="dd/mm/aaaa" /></label>
        <button className="btn pri">Buscar</button>
      </Panel>
      <Panel>
        <table>
          <thead><tr><th>Folio</th><th>RUT</th><th>Académico/a</th><th>Programa</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>
            {[
              ['PA-2026-014', '12.345.678-9', 'Cristopher Jiménez', 'Doctorado en Educación', 'blue', 'Pendiente'],
              ['PA-2026-013', '11.234.567-8', 'María Pérez', 'Magíster en Gestión', 'warn', 'Observada'],
              ['PA-2026-009', '9.876.543-2', 'Juan Soto', 'Pasantía internacional', 'ok', 'Aprobada'],
            ].map(([folio, rut, nombre, prog, tipo, est]) => (
              <tr key={folio}>
                <td>{folio}</td><td style={{ whiteSpace: 'nowrap' }}>{rut}</td><td>{nombre}</td><td>{prog}</td>
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
          <button className="btn warn">⚠ Observar</button>
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
        {[['Revisión DDA', 12, .58], ['Decanato', 7, .36], ['Comité CPA', 5, .28], ['Finalizadas', 16, .78]].map(([l, n, p]) => (
          <div key={l} className="bar-row"><span>{l}</span><div className="bar"><i style={{ width: `${p * 100}%` }} /></div><strong>{n}</strong></div>
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
      case 'nueva-solicitud': return <NuevaSolicitud />
      case 'seguimiento': return <Seguimiento roleId={roleId} />
      case 'documentos': return <Documentos roleId={roleId} />
      case 'bandeja': return <Bandeja title="Bandeja" />
      case 'reportes': return <Reportes />
      default: return <NuevaSolicitud />
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
