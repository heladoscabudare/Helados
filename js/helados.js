// js/helados.js
// Lógica para la sección de Helados: cargar, agregar, editar, eliminar

// Al cargar la página, muestra la tabla
window.onload = cargarHelados;

// Función para cargar y mostrar la tabla de helados
async function cargarHelados() {
  // Consulta a la base de datos, incluyendo las relaciones
  const { data, error } = await supabase
    .from('helados')
    .select(`
      id, nombre, precio_mayor, precio_detal, cantidad_disponible,
      presentaciones:presentacion_id(nombre)
    `);

  if (error) {
    document.getElementById('tabla-helados').innerText = "Error cargando datos";
    return;
  }

  // Construye la tabla en HTML
  let tabla = `<table>
    <tr>
      <th>Nombre</th>
      <th>Presentación</th>
      <th>Precio Mayor</th>
      <th>Precio Detal</th>
      <th>Cantidad</th>
      <th>Acciones</th>
    </tr>`;
  for (const h of data) {
    tabla += `<tr>
      <td>${h.nombre}</td>
      <td>${h.presentaciones?.nombre || ''}</td>
      <td>${h.precio_mayor}</td>
      <td>${h.precio_detal}</td>
      <td>${h.cantidad_disponible}</td>
      <td>
        <button onclick="mostrarFormularioEditar(${h.id})">Editar</button>
        <button onclick="eliminarHelado(${h.id})">Eliminar</button>
      </td>
    </tr>`;
  }
  tabla += `</table>`;
  document.getElementById('tabla-helados').innerHTML = tabla;
}

// Mostrar formulario para agregar un nuevo helado
async function mostrarFormularioAgregar() {
  const presentaciones = await obtenerPresentaciones();
  let opcionesPresentaciones = presentaciones.map(
    p => `<option value="${p.id}">${p.nombre}</option>`
  ).join('');
  document.getElementById('formulario-helado').innerHTML = `
    <h3>Agregar Helado</h3>
    <form onsubmit="agregarHelado(event)">
      <label>Nombre:</label><input name="nombre" required/>
      <label>Presentación:</label>
      <select name="presentacion_id" required>
        ${opcionesPresentaciones}
      </select>
      <label>Precio Mayor:</label><input name="precio_mayor" type="number" step="0.01" required/>
      <label>Precio Detal:</label><input name="precio_detal" type="number" step="0.01" required/>
      <label>Cantidad:</label><input name="cantidad_disponible" type="number" min="0" value="0" required/>
      <button type="submit">Agregar</button>
      <button type="button" onclick="ocultarFormulario()">Cancelar</button>
    </form>
  `;
  document.getElementById('formulario-helado').style.display = 'block';
}

// Ocultar cualquier formulario
function ocultarFormulario() {
  document.getElementById('formulario-helado').style.display = 'none';
}

// Obtener presentaciones de la BD
async function obtenerPresentaciones() {
  const { data } = await supabase.from('presentaciones').select('id, nombre');
  return data || [];
}

// Agregar helado (maneja el submit del formulario)
async function agregarHelado(e) {
  e.preventDefault();
  const form = e.target;
  const nuevo = {
    nombre: form.nombre.value,
    presentacion_id: parseInt(form.presentacion_id.value),
    precio_mayor: parseFloat(form.precio_mayor.value),
    precio_detal: parseFloat(form.precio_detal.value),
    cantidad_disponible: parseInt(form.cantidad_disponible.value)
  };
  const { error } = await supabase.from('helados').insert([nuevo]);
  if (error) alert("Error: " + error.message);
  ocultarFormulario();
  cargarHelados();
}

// Mostrar formulario para editar un helado
async function mostrarFormularioEditar(id) {
  const { data } = await supabase.from('helados').select('*').eq('id', id).single();
  const presentaciones = await obtenerPresentaciones();
  let opcionesPresentaciones = presentaciones.map(
    p => `<option value="${p.id}" ${p.id===data.presentacion_id?'selected':''}>${p.nombre}</option>`
  ).join('');
  document.getElementById('formulario-helado').innerHTML = `
    <h3>Editar Helado</h3>
    <form onsubmit="editarHelado(event,${id})">
      <label>Nombre:</label><input name="nombre" value="${data.nombre}" required/>
      <label>Presentación:</label>
      <select name="presentacion_id" required>
        ${opcionesPresentaciones}
      </select>
      <label>Precio Mayor:</label><input name="precio_mayor" value="${data.precio_mayor}" type="number" step="0.01" required/>
      <label>Precio Detal:</label><input name="precio_detal" value="${data.precio_detal}" type="number" step="0.01" required/>
      <label>Cantidad:</label><input name="cantidad_disponible" value="${data.cantidad_disponible}" type="number" min="0" required/>
      <button type="submit">Guardar</button>
      <button type="button" onclick="ocultarFormulario()">Cancelar</button>
    </form>
  `;
  document.getElementById('formulario-helado').style.display = 'block';
}

// Editar helado (maneja el submit del formulario)
async function editarHelado(e, id) {
  e.preventDefault();
  const form = e.target;
  const editado = {
    nombre: form.nombre.value,
    presentacion_id: parseInt(form.presentacion_id.value),
    precio_mayor: parseFloat(form.precio_mayor.value),
    precio_detal: parseFloat(form.precio_detal.value),
    cantidad_disponible: parseInt(form.cantidad_disponible.value)
  };
  const { error } = await supabase.from('helados').update(editado).eq('id', id);
  if (error) alert("Error: " + error.message);
  ocultarFormulario();
  cargarHelados();
}

// Eliminar helado
async function eliminarHelado(id) {
  if (!confirm("¿Eliminar este helado?")) return;
  const { error } = await supabase.from('helados').delete().eq('id', id);
  if (error) alert("Error: " + error.message);
  cargarHelados();
}