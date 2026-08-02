export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://mariscoseljona.mx/#business",
    name: "Mariscos El Jona",
    alternateName: "Distribuidora Mariscos El Jona",
    description:
      "Distribuidora de pescados y mariscos frescos en Rosarito, Baja California. Mayoreo y menudeo con entrega a domicilio.",
    url: "https://mariscoseljona.mx",
    telephone: "+526616123456",
    email: "ventas@mariscoseljona.mx",
    image: "https://mariscoseljona.mx/jona-logo.svg",
    logo: "https://mariscoseljona.mx/jona-logo.svg",
    priceRange: "$$",
    currenciesAccepted: "MXN",
    paymentAccepted: "Efectivo, Transferencia, Tarjeta de crédito, Tarjeta de débito",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Blvd. Benito Juárez 1452, Col. Centro",
      addressLocality: "Rosarito",
      addressRegion: "Baja California",
      postalCode: "22710",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.237,
      longitude: -117.053,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "07:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Rosarito" },
      { "@type": "City", name: "Tijuana" },
      { "@type": "City", name: "Ensenada" },
      { "@type": "City", name: "Mexicali" },
      { "@type": "City", name: "San Quintín" },
    ],
    sameAs: [
      "https://facebook.com/mariscoseljona",
      "https://instagram.com/mariscoseljona",
      "https://tiktok.com/@mariscoseljona",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "3",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
