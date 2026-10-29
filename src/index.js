import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

let scene;
let camera;
let naveCamera;
let renderer;
let controls;
let sol;
let Planetas = [];
let Lunas = [];
let t0 = Date.now();

// Variables camra nave pilotable
let camaraTierra;
let camaraNave;
let naveMesh;
const teclas = { w: false, a: false, s: false, d: false };

//Menú interactivo
const settings = {
  velocidad: 1.0,
  pausa: false,
  mostrarOrbitas: true,
  vistaDerecha: "Tierra",
};

const textureLoader = new THREE.TextureLoader();
const txTierra = textureLoader.load("src/earthmap1k.jpg");
const txBump = textureLoader.load("src/earthbump1k.jpg");
const txSpec = textureLoader.load("src/earthspec1k.jpg");
const txNubes = textureLoader.load("src/earthcloudmap.jpg");
const txAlphaNubes = textureLoader.load("src/earthcloudmaptrans_invert.jpg");

function init() {
  scene = new THREE.Scene();
  const aspect = window.innerWidth / 2 / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 15, 25);

  naveCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  //Controles de la orbita para girar la vista con el raton
  controls = new OrbitControls(camera, renderer.domElement);

  // Luces de la escena
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);
  // Luz del Sol
  const sunLight = new THREE.PointLight(0xffffff, 2, 100);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);

  const starsGeom = new THREE.BufferGeometry();
  const starsCount = 2000;
  const starPositions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 200;
  }
  starsGeom.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const starField = new THREE.Points(starsGeom, starsMat);
  scene.add(starField);

  // Creacionde la estrella, los Planetas y las lunas
  CrearEstrella(2.0, 0xffcc00);

  CrearPlaneta(0.3, 4.0, 1.5, 0xaaaaaa, 1.0, 1.0); //Planeta 1
  CrearPlaneta(0.5, 6.5, 1.1, 0xe3bb76, 1.0, 1.0); //Planeta 2
  // CrearPlaneta(0.6, 9.5, 0.8, 0x2277ff, 1.1, 0.9); //Planeta 3
  CrearPlaneta(0.4, 13.0, 0.6, 0xcc4422, 1.0, 1.2); //Planeta 4
  CrearPlaneta(1.1, 17.5, 0.3, 0xd4a373, 1.0, 1.0); //Planeta 5

  const planetaTierra = CrearPlaneta(0.6, 9.5, 0.8, 0xffffff, 1.1, 0.9, {
    map: txTierra,
    bumpMap: txBump,
    specularMap: txSpec,
  });

  CrearCapaNubes(planetaTierra, 0.62, txNubes, txAlphaNubes);

  CrearLuna(planetaTierra, 0.15, 1.2, 3.0, 0xdddddd, 0.2); // Luna 1
  CrearLuna(planetaTierra, 0.08, 1.7, -2.0, 0x888888, Math.PI / 4); // Luna 2

  camaraTierra = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  planetaTierra.add(camaraTierra);
  camaraTierra.position.set(0, 1, 3);
  camaraTierra.lookAt(0, 0, 0);

  // Creacion de la nave
  const geomNave = new THREE.ConeGeometry(0.2, 1, 0);
  geomNave.rotateX(Math.PI / 2);
  const matNave = new THREE.MeshPhongMaterial({ color: 0xff3333 });
  naveMesh = new THREE.Mesh(geomNave, matNave);
  naveMesh.position.set(0, 5, 20);
  scene.add(naveMesh);

  // Camara anclada a la nave
  camaraNave = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  naveMesh.add(camaraNave);
  camaraNave.position.set(0, 1, 3);
  camaraNave.lookAt(0, 0, -10);

  // Menú interactiivo para elegir la vista
  const gui = new GUI();
  gui
    .add(settings, "vistaDerecha", ["Tierra", "Nave Piloto"])
    .name("Cámara Derecha");
  // Detectar cuando se pulsa WASD
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() == "w") teclas.w = true;
    if (e.key.toLowerCase() == "a") teclas.a = true;
    if (e.key.toLowerCase() == "s") teclas.s = true;
    if (e.key.toLowerCase() == "d") teclas.d = true;
  });
  window.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() == "w") teclas.w = false;
    if (e.key.toLowerCase() == "a") teclas.a = false;
    if (e.key.toLowerCase() == "s") teclas.s = false;
    if (e.key.toLowerCase() == "d") teclas.d = false;
  });

  window.addEventListener("resize", onWindowResize);
}

function CrearEstrella(radio, color) {
  const geom = new THREE.SphereGeometry(radio, 32, 32);
  const mat = new THREE.MeshBasicMaterial({ color: color });
  sol = new THREE.Mesh(geom, mat);
  scene.add(sol);
}

function CrearPlaneta(radio, dist, vel, color, f1, f2, texturas = {}) {
  const geom = new THREE.SphereGeometry(radio, 32, 32);
  const matParams = { color: color };

  if (texturas.map) matParams.map = texturas.map;
  if (texturas.bumpMap) matParams.bumpMap = texturas.bumpMap;
  if (texturas.specularMap) matParams.specularMap = texturas.specularMap;

  const mat = new THREE.MeshPhongMaterial(matParams);

  if (texturas.bumpMap) mat.bumpScale = 0.5;
  if (texturas.specularMap) mat.specular = new THREE.Color("grey");

  const planeta = new THREE.Mesh(geom, mat);

  planeta.castShadow = true;
  planeta.receiveShadow = true;

  planeta.userData = { dist, speed: vel, f1, f2 };
  Planetas.push(planeta);
  scene.add(planeta);

  //Linea de la orbita
  const curve = new THREE.EllipseCurve(0, 0, dist * f1, dist * f2);
  const points = curve.getPoints(64);
  const geomOrbita = new THREE.BufferGeometry().setFromPoints(points);
  const matOrbita = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
  });

  const orbita = new THREE.Line(geomOrbita, matOrbita);
  orbita.rotation.x = Math.PI / 2;
  scene.add(orbita);

  return planeta;
}

function CrearCapaNubes(planetaPadre, radio, texNubes, texAlpha) {
  const geom = new THREE.SphereGeometry(radio, 32, 32);
  const mat = new THREE.MeshPhongMaterial({
    map: texNubes,
    alphaMap: texAlpha,
    transparent: true,
    side: THREE.DoubleSide,
    opacity: 1.0,
    depthWrite: false,
  });
  const nubes = new THREE.Mesh(geom, mat);
  planetaPadre.add(nubes);
}

function CrearLuna(planetaPadre, radio, dist, vel, color, inclinacion) {
  const pivote = new THREE.Object3D();
  pivote.rotation.x = inclinacion;
  planetaPadre.add(pivote);

  const geom = new THREE.SphereGeometry(radio, 16, 16);
  const mat = new THREE.MeshPhongMaterial({ color: color });
  const luna = new THREE.Mesh(geom, mat);

  luna.castShadow = true;
  luna.receiveShadow = true;

  luna.userData = { dist, speed: vel };
  Lunas.push(luna);
  pivote.add(luna);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / 2 / height;
  camera.updateProjectionMatrix();

  camaraTierra.aspect = aspect;
  camaraTierra.updateProjectionMatrix();
  camaraNave.aspect = aspect;
  camaraNave.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const timestamp = (Date.now() - t0) * 0.001;

  if (sol) {
    sol.rotation.y += 0.002;
  }

  Planetas.forEach((planeta) => {
    planeta.position.x =
      Math.cos(timestamp * planeta.userData.speed) *
      planeta.userData.dist *
      planeta.userData.f1;
    planeta.position.z =
      Math.sin(timestamp * planeta.userData.speed) *
      planeta.userData.dist *
      planeta.userData.f2;
    planeta.rotation.y += 0.01;
  });

  Lunas.forEach((luna) => {
    luna.position.x =
      Math.cos(timestamp * luna.userData.speed) * luna.userData.dist;
    luna.position.z =
      Math.sin(timestamp * luna.userData.speed) * luna.userData.dist;
    luna.rotation.y += 0.02;
  });

  // Logica vuelo nave
  if (teclas.w) naveMesh.translateZ(-0.2);
  if (teclas.s) naveMesh.translateZ(0.2);
  if (teclas.a) naveMesh.rotation.y += 0.04;
  if (teclas.d) naveMesh.rotation.y -= 0.04;

  controls.update();

  // Implementacion pantalla dividida
  renderer.setScissorTest(true);
  // Camara general
  renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.render(scene, camera);
  // Camara nave
  renderer.setViewport(
    window.innerWidth / 2,
    0,
    window.innerWidth / 2,
    window.innerHeight
  );
  renderer.setScissor(
    window.innerWidth / 2,
    0,
    window.innerWidth / 2,
    window.innerHeight
  );

  const camaraActivaDerecha =
    settings.vistaDerecha === "Tierra" ? camaraTierra : camaraNave;

  renderer.setViewport(
    window.innerWidth / 2,
    0,
    window.innerWidth / 2,
    window.innerHeight
  );
  renderer.setScissor(
    window.innerWidth / 2,
    0,
    window.innerWidth / 2,
    window.innerHeight
  );

  renderer.render(scene, camaraActivaDerecha);

  renderer.setScissorTest(false);
}

//Llamadas al init y a la animación
init();
animate();
