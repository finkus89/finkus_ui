🧩 1️⃣ Alineación del texto
text-left      → alinea a la izquierda  
text-center    → centra  
text-right     → alinea a la derecha  
text-justify   → justifica

```tsx
<p className="text-center text-white">
  Este texto está centrado.
</p>

🧩 2️⃣ Tamaño del texto

(lo usas como text-[valor])

Clase	Tamaño aprox.	Ejemplo
text-xs	12 px	muy pequeño
text-sm	14 px	pequeño
text-base	16 px	normal
text-lg	18 px	grande
text-xl	20 px	subtítulo
text-2xl	24 px	título medio
text-3xl	30 px	título principal
text-4xl	36 px	grande
text-5xl → text-9xl	48–96 px	hero/banner

<h1 className="text-3xl font-bold text-center">Título grande</h1>


🧩 3️⃣ Peso (grosor)

(usa font-[peso])

Clase	Peso	Descripción
font-thin	100	ultra fino
font-extralight	200	muy ligero
font-light	300	ligero
font-normal	400	estándar
font-medium	500	medio
font-semibold	600	semi-negrita
font-bold	700	negrita
font-extrabold	800	muy negrita
font-black	900	máximo grosor

<p className="font-light text-lg">
  Texto ligero con Sulphur Point.
</p>


🧩 4️⃣ Color y opacidad del texto
text-white               → blanco puro  
text-white/80             → 80 % de opacidad  
text-slate-300            → gris claro  
text-slate-700            → gris oscuro  
text-[#AA6DC7]            → color personalizado (usa tu violeta)

🧩 5️⃣ Espaciado y altura de línea
tracking-tight    → letras más juntas  
tracking-wide     → letras más separadas  
leading-none      → líneas pegadas  
leading-snug      → línea justa  
leading-relaxed   → línea más amplia  

<p className="tracking-wide leading-snug">
  Texto con espaciado amplio y líneas justas.
</p>


🧩 6️⃣ Transformaciones y decoración
uppercase      → mayúsculas  
lowercase      → minúsculas  
capitalize     → capitaliza palabras  
underline      → subraya  
underline-offset-4  → distancia de subrayado  
italic         → cursiva  

```tsx
<p className="text-center text-white">
  Este texto está centrado.
</p>

Ejemplo combinado
<div className="text-center">
  <h1 className="text-3xl font-bold tracking-wide text-white">
    Finkus
  </h1>
  <p className="mt-3 text-lg font-light text-white/80 leading-snug">
    Hoy no necesitas hacerlo perfecto, solo avanzar.
  </p>
  <p className="mt-2 text-sm text-white/70 uppercase tracking-wide">
    Constancia y enfoque
  </p>
</div>
