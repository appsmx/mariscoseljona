export default function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Con qué frecuencia reciben producto fresco?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recibimos producto del puerto todos los días antes de las 6:00 AM. El inventario de mariscos frescos se renueva diariamente; lo que ves disponible hoy salió del mar esa misma madrugada.",
        },
      },
      {
        "@type": "Question",
        name: "¿Hacen entregas a domicilio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. En zona metropolitana de Rosarito y Tijuana entregamos el mismo día si el pedido se realiza antes de las 11:00 AM. Para Ensenada, Mexicali y otras ciudades enviamos por paquetería refrigerada con llegada de 24 a 48 horas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es el mínimo de compra para mayoreo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El mínimo para precios de mayoreo es de 5 kilogramos por producto o un ticket equivalente. Ofrecemos precios escalonados: mayor volumen, mejor precio unitario.",
        },
      },
      {
        "@type": "Question",
        name: "¿Aceptan tarjeta o solo efectivo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aceptamos efectivo, transferencia bancaria, tarjetas de débito y crédito, y wallets móviles. Para clientes de mayoreo recurrente abrimos línea de crédito a 30 días.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo garantizan la cadena de frío?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trabajamos con cuartos fríos a -2°C para frescos y -18°C para congelados. Las entregas se hacen en vehículos con hieleras industriales y monitoreo de temperatura en todo el trayecto.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
