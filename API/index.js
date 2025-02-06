const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Conectar a MongoDB
mongoose.connect('mongodb://000.000.00.00:27017/db_red_social');

const app = express();
app.use(bodyParser.json());

// Definición de esquemas y modelos
const UsuarioSchema = new mongoose.Schema({
  nombre_usuario: String,
  contraseña: String,
  correo: String,
  nombre_completo: String,
  fecha_registro: Date,
  amigos: [String],
  seguidores: [String],
  siguiendo: [String],
  publicaciones: [{
    _id: String,
    contenido: String,
    fecha: Date,
    likes: Number,
    comentarios: [{
      id_usuario: String,
      comentario: String,
      fecha: Date
    }]
  }],
  mensajes_privados: [{
    _id: String,
    id_usuario_envia: String,
    id_usuario_recibe: String,
    contenido: String,
    fecha: Date
  }],
  notificaciones: [{
    _id: String,
    id_tipo_categoria: String,
    contenido: String,
    fecha: Date
  }]
});

const PublicacionSchema = new mongoose.Schema({
  id_usuario: String,
  contenido: String,
  fecha: Date,
  likes: Number,
  comentarios: [{
    _id: String,
    id_usuario: String,
    comentario: String,
    fecha: Date
  }]
});

const ComentarioSchema = new mongoose.Schema({
  id_publicacion: String,
  id_usuario: String,
  comentario: String,
  fecha: Date
});

const SeguidorSchema = new mongoose.Schema({
  id_seguidor: String,
  id_siguiendo: String
});

const MensajePrivadoSchema = new mongoose.Schema({
  id_usuario_envia: String,
  id_usuario_recibe: String,
  contenido: String,
  fecha: Date
});

const NotificacionSchema = new mongoose.Schema({
  id_tipo_categoria: String,
  contenido: String,
  fecha: Date
});

const CategoriaNotificacionSchema = new mongoose.Schema({
  nombre: String
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Publicacion = mongoose.model('Publicacion', PublicacionSchema);
const Comentario = mongoose.model('Comentario', ComentarioSchema);
const Seguidor = mongoose.model('Seguidor', SeguidorSchema);
const MensajePrivado = mongoose.model('MensajePrivado', MensajePrivadoSchema);
const Notificacion = mongoose.model('Notificacion', NotificacionSchema);
const CategoriaNotificacion = mongoose.model('CategoriaNotificacion', CategoriaNotificacionSchema);

// Rutas CRUD para usuarios
app.post('/usuarios', async (req, res) => {
  const usuario = new Usuario(req.body);
  await usuario.save();
  res.send(usuario);
});

app.get('/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.send(usuario);
});

app.put('/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(usuario);
});

app.delete('/usuarios/:id', async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.send({ message: 'Usuario eliminado' });
});

// Rutas CRUD para publicaciones
app.post('/publicaciones', async (req, res) => {
  const publicacion = new Publicacion(req.body);
  await publicacion.save();
  res.send(publicacion);
});

app.get('/publicaciones/:id', async (req, res) => {
  const publicacion = await Publicacion.findById(req.params.id);
  res.send(publicacion);
});

app.put('/publicaciones/:id', async (req, res) => {
  const publicacion = await Publicacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(publicacion);
});

app.delete('/publicaciones/:id', async (req, res) => {
  await Publicacion.findByIdAndDelete(req.params.id);
  res.send({ message: 'Publicación eliminada' });
});

// Rutas CRUD para comentarios
app.post('/comentarios', async (req, res) => {
  const comentario = new Comentario(req.body);
  await comentario.save();
  res.send(comentario);
});

app.get('/comentarios/:id', async (req, res) => {
  const comentario = await Comentario.findById(req.params.id);
  res.send(comentario);
});

app.put('/comentarios/:id', async (req, res) => {
  const comentario = await Comentario.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(comentario);
});

app.delete('/comentarios/:id', async (req, res) => {
  await Comentario.findByIdAndDelete(req.params.id);
  res.send({ message: 'Comentario eliminado' });
});

// Rutas CRUD para seguidores
app.post('/seguidores', async (req, res) => {
  const seguidor = new Seguidor(req.body);
  await seguidor.save();
  res.send(seguidor);
});

app.get('/seguidores/:id', async (req, res) => {
  const seguidor = await Seguidor.findById(req.params.id);
  res.send(seguidor);
});

app.put('/seguidores/:id', async (req, res) => {
  const seguidor = await Seguidor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(seguidor);
});

app.delete('/seguidores/:id', async (req, res) => {
  await Seguidor.findByIdAndDelete(req.params.id);
  res.send({ message: 'Seguidor eliminado' });
});

// Rutas CRUD para mensajes privados
app.post('/mensajes_privados', async (req, res) => {
  const mensajePrivado = new MensajePrivado(req.body);
  await mensajePrivado.save();
  res.send(mensajePrivado);
});

app.get('/mensajes_privados/:id', async (req, res) => {
  const mensajePrivado = await MensajePrivado.findById(req.params.id);
  res.send(mensajePrivado);
});

app.put('/mensajes_privados/:id', async (req, res) => {
  const mensajePrivado = await MensajePrivado.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(mensajePrivado);
});

app.delete('/mensajes_privados/:id', async (req, res) => {
  await MensajePrivado.findByIdAndDelete(req.params.id);
  res.send({ message: 'Mensaje privado eliminado' });
});

// Rutas CRUD para notificaciones
app.post('/notificaciones', async (req, res) => {
  const notificacion = new Notificacion(req.body);
  await notificacion.save();
  res.send(notificacion);
});

app.get('/notificaciones/:id', async (req, res) => {
  const notificacion = await Notificacion.findById(req.params.id);
  res.send(notificacion);
});

app.put('/notificaciones/:id', async (req, res) => {
  const notificacion = await Notificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(notificacion);
});

app.delete('/notificaciones/:id', async (req, res) => {
  await Notificacion.findByIdAndDelete(req.params.id);
  res.send({ message: 'Notificación eliminada' });
});

// Rutas CRUD para categorías de notificaciones
app.post('/categoria_notificaciones', async (req, res) => {
  const categoria = new CategoriaNotificacion(req.body);
  await categoria.save();
  res.send(categoria);
});

app.get('/categoria_notificaciones/:id', async (req, res) => {
  const categoria = await CategoriaNotificacion.findById(req.params.id);
  res.send(categoria);
});

app.put('/categoria_notificaciones/:id', async (req, res) => {
  const categoria = await CategoriaNotificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(categoria);
});

app.delete('/categoria_notificaciones/:id', async (req, res) => {
  await CategoriaNotificacion.findByIdAndDelete(req.params.id);
  res.send({ message: 'Categoría eliminada' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
