export const getDestinationImage = (destination: string, country: string) => {
  const destinationMap: { [key: string]: string } = {
    "New York":
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop&crop=center&q=80",
    "Washington, D.C.":
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
    "Washington DC":
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
    Washington:
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
    "Los Angeles":
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    Chicago:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Miami:
      "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
    "San Francisco":
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center&q=80",
    "Las Vegas":
      "https://images.unsplash.com/photo-1581350917348-867d3e3f3c8e?w=800&h=400&fit=crop&crop=center&q=80",
    Seattle:
      "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
    Boston:
      "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=800&h=400&fit=crop&crop=center&q=80",
    Denver:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Nashville:
      "https://images.unsplash.com/photo-1514896856000-91cb788aa01e?w=800&h=400&fit=crop&crop=center&q=80",
    "New Orleans":
      "https://images.unsplash.com/photo-1514896856000-91cb788aa01e?w=800&h=400&fit=crop&crop=center&q=80",
    Austin:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Portland:
      "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
    Philadelphia:
      "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=800&h=400&fit=crop&crop=center&q=80",
    Phoenix:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    "San Diego":
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    Dallas:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Houston:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Atlanta:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Orlando:
      "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
    Tampa:
      "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
    Minneapolis:
      "https://images.unsplash.com/photo-1502173173179-7e09bbf17e39?w=800&h=400&fit=crop&crop=center&q=80",
    Detroit:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Cleveland:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Pittsburgh:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Cincinnati:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    "Kansas City":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    "St. Louis":
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Indianapolis:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Columbus:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop&crop=center&q=80",
    Charlotte:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Raleigh:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Jacksonville:
      "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
    "Fort Worth":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Arlington:
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=400&fit=crop&crop=center&q=80",
    Sacramento:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    Oakland:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center&q=80",
    Fresno:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    "Long Beach":
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    Mesa: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    "Virginia Beach":
      "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&h=400&fit=crop&crop=center&q=80",
    "Colorado Springs":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Omaha:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&q=80",
    Honolulu:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    Anaheim:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=400&fit=crop&crop=center&q=80",
    London:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop&crop=center&q=80",
    Paris:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=400&fit=crop&crop=center&q=80",
    "Paris, France":
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=400&fit=crop&crop=center&q=80",
    Tokyo:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&crop=center&q=80",
    Sydney:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=400&fit=crop&crop=center&q=80",
    Dubai:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop&crop=center&q=80",
    Singapore:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop&crop=center&q=80",
    Barcelona:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=400&fit=crop&crop=center&q=80",
    Amsterdam:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=400&fit=crop&crop=center&q=80",
    Berlin:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=400&fit=crop&crop=center&q=80",
    Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop&crop=center&q=80",
    Vienna:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=400&fit=crop&crop=center&q=80",
  };

  const countryMap: { [key: string]: string } = {
    "United States":
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop&crop=center&q=80",
    "United Kingdom":
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop&crop=center&q=80",
    France:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=400&fit=crop&crop=center&q=80",
    Japan:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&crop=center&q=80",
    Italy:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop&crop=center&q=80",
    Spain:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=400&fit=crop&crop=center&q=80",
    Netherlands:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=400&fit=crop&crop=center&q=80",
    Germany:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=400&fit=crop&crop=center&q=80",
    Austria:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=400&fit=crop&crop=center&q=80",
    Australia:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=400&fit=crop&crop=center&q=80",
  };

  return (
    destinationMap[destination] ||
    destinationMap[country] ||
    countryMap[country] ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&crop=center&q=80"
  );
};
