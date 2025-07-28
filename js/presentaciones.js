// js/presentaciones.js
// Lógica para la sección de Presentaciones

window.onload = cargarPresentaciones;

async function cargarPresentaciones() {
  const { data, error } = await supabase
    .from('presentaciones')
    .select('id, nombre');
  if (error) {
    document.getElementById('tabla-presentaciones').innerText = "Error cargando datos";
    return;
  }
  let tabla = `<table>
    <tr>
      <th>Nombre</th>
      <th>Acciones</th>
    </tr>`;
  for (const p of data) {
    tabla += `<tr>
      <td>${p.nombre}</td>
      <td>
        <button onclick="mostrarFormularioEditarPresentacion(${p.id})">Editar</button>
        <button onclick="eliminarPresentacion(${p.id})">Eliminar</button>
      </td>
    </tr>`;
  }
  tabla += `</table>`;
  document.getElementById('tabla-presentaciones').innerHTML = tabla;
}

function mostrarFormularioAgregarPresentacion() {
  document.getElementById('formulario-presentacion').innerHTML = `
    <h3>Agregar Presentación</h3>
    <form onsubmit="agregarPresentacion(event)">
      <label>Nombre:</label><input name="nombre" required/>
      <button type="submit">Agregar</button>
      <button type="button" onclick="ocultarFormularioPresentacion()">Cancelar</button>
    </form>
  `;
  document.getElementById('formulario-presentacion').style.display = 'block';
}

function ocultarFormularioPresentacion() {
  document.getElementById('formulario-presentacion').style.display = 'none';
}

async function agregarPresentacion(e) {
  e.preventDefault();
  const form = e.target;
  const nuevo = {
    nombre: form.nombre.value
  };
  const { error } = await supabase.from('presentaciones').insert([nuevo]);
  if (error) alert("Error: " + error.message);
  ocultarFormularioPresentacion();
  cargarPresentaciones();
}

async function mostrarFormularioEditarPresentacion(id) {
  const { data } = await supabase.from('presentaciones').select('*').eq('id', id).single();
  document.getElementById('formulario-presentacion').innerHTML = `
    <h3>Editar Presentación</h3>
    <form onsubmit="editarPresentacion(event,${id})">
      <label>Nombre:</label><input name="nombre" value="${data.nombre}" required/>
      <button type="submit">Guardar</button>
      <button type="button" onclick="ocultarFormularioPresentacion()">Cancelar</button>
    </form>
  `;
  document.getElementById('formulario-presentacion').style.display = 'block';
}

async function editarPresentacion(e, id) {
  e.preventDefault();
  const form = e.target;
  const editado = {
    nombre: form.nombre.value
  };
  const { error } = await supabase.from('presentaciones').update(editado).eq('id', id);
  if (error) alert("Error: " + error.message);
  ocultarFormularioPresentacion();
  cargarPresentaciones();
}

async function eliminarPresentacion(id) {
  if (!confirm("¿Eliminar esta presentación?")) return;
  const { error } = await supabase.from('presentaciones').delete().eq('id', id);
  if (error) alert("Error: " + error.message);
  cargarPresentaciones();
}
