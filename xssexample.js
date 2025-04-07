const xss = require("xss");

console.log(xss("MIRA:   <script>alert('Hola')</script>"));
