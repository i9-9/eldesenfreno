import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-4 font-neue-haas-grotesk hidden md:flex">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 text-sm">
          <div>
            <h4 className="font-bold mb-2">CABA:</h4>
            <p>ARCADIA (CENTRO)</p>
            <p>Marcelo T. de Alvear 1548</p>
            <p>LAS PERLAS ROJAS (CENTRO)</p>
            <p>Rodriguez Peña 754</p>
            <p>OTRAS ORILLAS (RECOLETA)</p>
            <p>Gral. Lucio Norberto Mansilla 2974</p>
            <p>LIBRERÍA NORTE</p>
            <p>Av. Las Heras 2225</p>
          </div>
          <div>
            <p>LA LIBRE (SAN TELMO)</p>
            <p>Chacabuco 917</p>
            <p>LAS MÉNADES (ALMAGRO)</p>
            <p>Av. Medrano 29</p>
            <p>LIBROS DEL PASAJE (PALERMO)</p>
            <p>Thames 1762</p>
            <p>EL JAÚL (PALERMO)</p>
            <p>Gascón 1355</p>
          </div>
          <div>
            <p>OCIO (VILLA CRESPO)</p>
            <p>Loyola 829</p>
            <p>MANDRÁGORA (VILLA CRESPO)</p>
            <p>Vera 1096</p>
            <p>MANDOLINA (BELGRANO)</p>
            <p>Manuel Ugarte 2439</p>
            <p>LOS MANTRAS (VIRTUAL)</p>
            <p><a href="https://www.losmantras.com.ar" className="hover:underline">losmantras.com.ar</a></p>
          </div>
          <div>
            <p>ARENGA LIBROS</p>
            <p><a href="https://www.arengalibros.com.ar" className="hover:underline">arengalibros.com.ar</a></p>
            <p>LA PLATA:</p>
            <p>HAURISMAKI (CENTRO)</p>
            <p>Calle 11 Nº 1362</p>
            <p>GALIARTE (CENTRO)</p>
            <p>Calle 11 Nº 544</p>
          </div>
          <div>
            <p>CARIÑO (Villa Elisa)</p>
            <p>Calle 419 Nº 2216</p>
            <p>MAR DEL PLATA:</p>
            <p>EL GRAN PEZ</p>
            <p>Santiago del Estero 2052</p>
            <p>ENTRE RÍOS</p>
            <p>MALA PALABRA (CONCEPCIÓN DEL URUGUAY)</p>
            <p>Eva Perón 38 - Local 30</p>
          </div>
          <div>
            <p>CÓRDOBA</p>
            <p>VOLCÁN AZUL</p>
            <p>Independencia 1247</p>
            <p>SAN LUIS</p>
            <p>BRIZNAL (VIRTUAL Y VISITA PACTADA)</p>
            <p>@Briznal.libros</p>
            <p>MENDOZA</p>
          </div>
          <div>
            <p>CARDO RUSO (VIRTUAL)</p>
            <p><a href="https://www.instagram.com/Cardorusolibros" className="hover:underline">@Cardorusolibros</a></p>
            <p>E-SHOP OFICIAL</p>
            <p><a href="https://pency.app/eldesenfreno" className="hover:underline">Pency.app/eldesenfreno</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
