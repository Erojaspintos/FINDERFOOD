const geolib = require('geolib');
 
const distancia = geolib.getDistance(
  { latitude: -34.9011, longitude: -56.1645 }, // Origen (ejemplo: Montevideo)
  { latitude: -34.6037, longitude: -58.3816 }  // Destino (ejemplo: Buenos Aires)
);
 
console.log(`Distancia: ${distancia} metros`);