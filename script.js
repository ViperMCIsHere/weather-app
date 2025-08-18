// Animated rotating earth
const canvas = document.getElementById("earthCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let angle = 0;
function drawEarth() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const earthRadius = Math.min(canvas.width, canvas.height) / 3;
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  ctx.beginPath();
  ctx.arc(x, y, earthRadius, 0, Math.PI * 2, false);
  const gradient = ctx.createRadialGradient(x, y, earthRadius * 0.2, x, y, earthRadius);
  gradient.addColorStop(0, "#1e90ff");
  gradient.addColorStop(1, "#000080");
  ctx.fillStyle = gradient;
  ctx.fill();

  // Simple longitude lines
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  for (let i = 0; i < 12; i++) {
    const lineAngle = angle + (i * Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + earthRadius * Math.cos(lineAngle), y + earthRadius * Math.sin(lineAngle));
    ctx.stroke();
  }

  angle += 0.002;
  requestAnimationFrame(drawEarth);
}
drawEarth();
// === 3D Earth with Three.js ===
// === 3D Earth with Three.js ===
// === 3D Earth with Stars Background ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("bgScene").appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// 🌍 Earth
const earthTexture = textureLoader.load("https://threejs.org/examples/textures/earth_atmos_2048.jpg");
const earthGeo = new THREE.SphereGeometry(2, 64, 64);
const earthMat = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeo, earthMat);
scene.add(earth);

// ✨ Stars (simple space background)
const starTexture = textureLoader.load("https://threejs.org/examples/textures/galaxy_starfield.png");
const starGeo = new THREE.SphereGeometry(90, 64, 64);
const starMat = new THREE.MeshBasicMaterial({
  map: starTexture,
  side: THREE.BackSide
});
const stars = new THREE.Mesh(starGeo, starMat);
scene.add(stars);

// 💡 Lights
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

camera.position.z = 5;

// 🎥 Animate
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.002; // slow rotation
  renderer.render(scene, camera);
}
animate();

// 📱 Responsive resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



// Weather functions
const weatherOutput = document.getElementById("weatherOutput");

// Location button
document.getElementById("getWeatherBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    weatherOutput.innerHTML = "❌ Geolocation not supported.";
  }
});

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeather(`lat=${lat}&lon=${lon}`);
}

function error() {
  weatherOutput.innerHTML = "❌ Unable to retrieve location.";
}

// Search by city
function getWeatherByCity(city) {
  fetchWeather(`q=${encodeURIComponent(city)}`);
}

// Fetch weather
function fetchWeather(query) {
  const apiKey = "d7a99dd6d452457c6e88b94a2c563b1c"; // Replace with your real key
  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      const city = data.name;
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      weatherOutput.innerHTML = `📍 ${city}<br>🌡 ${temp}°C<br>☁ ${desc}`;
    })
    .catch(err => {
      weatherOutput.innerHTML = `<span style="color:red">${err.message}</span>`;
    });
}

// Event listeners for city search
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) getWeatherByCity(city);
});

// Enter key press
document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("searchBtn").click();
  }
});

// Autocomplete suggestions
const suggestionsList = document.getElementById("suggestions");
const cityInput = document.getElementById("cityInput");

cityInput.addEventListener("input", function () {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    return;
  }

  const apiKey = "d7a99dd6d452457c6e88b94a2c563b1c";
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;

  fetch(geoUrl)
    .then(res => res.json())
    .then(data => {
      suggestionsList.innerHTML = "";
      data.forEach(city => {
        const li = document.createElement("li");
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener("click", () => {
          cityInput.value = city.name;
          suggestionsList.innerHTML = "";
          getWeatherByCity(city.name);
        });
        suggestionsList.appendChild(li);
      });
    });
});

document.addEventListener("click", e => {
  if (e.target !== cityInput) {
    suggestionsList.innerHTML = "";
  }
});



