import React from 'react'
import Link from 'next/link';

const Locations = () => {
    return (
      <div className="font-neue-haas-grotesk px-2 ml-24 mt-4 text-xs">

        <h2 className='font-bold text-sm mb-4'>Puntos de venta:</h2>
        <br/>
        <p className="font-bold pb-6 italic">CABA:</p>
        <p className="font-semibold">ARCADIA (CENTRO)</p>
        <p>Marcelo T. de Alvear 1548</p>
  
        <p className="font-semibold mt-4">LAS PERLAS ROJAS (CENTRO)</p>
        <p>Rodriguez Peña 754</p>
  
        <p className="font-semibold mt-4">OTRAS ORILLAS (RECOLETA)</p>
        <p>Gral. Lucio Norberto Mansilla 2974</p>
  
        <p className="font-semibold mt-4">LIBRERÍA NORTE</p>
        <p>Av. Las Heras 2225</p>
  
        <p className="font-semibold mt-4">LA LIBRE (SAN TELMO)</p>
        <p>Chacabuco 917</p>
  
        <p className="font-semibold mt-4">LAS MÉNADES (ALMAGRO)</p>
        <p>Av. Medrano 29</p>
  
        <p className="font-semibold mt-4">LIBROS DEL PASAJE (PALERMO)</p>
        <p>Thames 1762</p>
  
        <p className="font-semibold mt-4">EL JAÚL (PALERMO)</p>
        <p>Gascón 1355</p>
  
        <p className="font-semibold mt-4">OCIO (VILLA CRESPO)</p>
        <p>Loyola 829</p>
  
        <p className="font-semibold mt-4">MANDRÁGORA (VILLA CRESPO)</p>
        <p>Vera 1096</p>
  
        <p className="font-semibold mt-4">MANDOLINA (BELGRANO)</p>
        <p>Manuel Ugarte 2439</p>
  
        <p className="font-semibold mt-4">LOS MANTRAS (VIRTUAL)</p>
        <p><a href="https://www.losmantras.com.ar" className="text-gray-500 hover:underline">https://www.losmantras.com.ar</a></p>
        <p>@mantraslibros</p>
  
        <p className="font-semibold mt-4">ARENGA LIBROS</p>
        <p><a href="https://www.arengalibros.com.ar" className="text-gray-500 hover:underline mb-4">https://www.arengalibros.com.ar</a></p>
        <p>@arengalibros</p>
  
        <p className="font-bold mt-6 pb-6 italic">LA PLATA:</p>
        <p className="font-semibold">HAURISMAKI (CENTRO)</p>
        <p>Calle 11 Nº 1362</p>
  
        <p className="font-semibold mt-4">GALIARTE (CENTRO)</p>
        <p>Calle 11 Nº 544</p>
  
        <p className="font-semibold mt-4">CARIÑO (Villa Elisa)</p>
        <p>Calle 419 Nº 2216</p>
  
        <p className="font-bold mt-6 pb-6 italic">MAR DEL PLATA:</p>
        <p className="font-semibold">EL GRAN PEZ</p>
        <p>Santiago del Estero 2052</p>
  
        <p className="font-bold mt-6 pb-6 italic">ENTRE RÍOS</p>
        <p className="font-semibold">MALA PALABRA (CONCEPCIÓN DEL URUGUAY)</p>
        <p>Eva Perón 38 - Local 30</p>
  
        <p className="font-bold mt-6 pb-6 italic">CÓRDOBA</p>
        <p className="font-semibold">VOLCÁN AZUL</p>
        <p>Independencia 1247</p>
  
        <p className="font-bold mt-6 pb-6 italic">SAN LUIS</p>
        <p className="font-semibold">BRIZNAL (VIRTUAL Y VISITA PACTADA)</p>
        <p>@Briznal.libros</p>
  
        <p className="font-bold mt-6 pb-6 italic">MENDOZA</p>
        <p className="font-semibold">CARDO RUSO (VIRTUAL)</p>
        
        <Link href='https://www.instagram.com/Cardorusolibros'>
          <p>@Cardorusolibros</p>
        
        </Link>
  
        <p className="font-bold mt-6">E-SHOP OFICIAL</p>
        <p><a href="https://pency.app/eldesenfreno" className="text-gray-500 hover:underline">Pency.app/eldesenfreno</a></p>
      </div>
    );
  };

export default Locations