/**
 * Dummy property data for Honesty Realtors
 * This will be replaced with Firebase data later
 */

export const properties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment in Gachibowli",
    location: "Gachibowli",
    price: "₹72 Lakhs",
    priceValue: 7200000,
    type: "Flat",
    bhk: "3BHK",
    area: "1,850 sqft",
    image: "/images/property-1.png",
    description:
      "Spacious 3BHK apartment with modern amenities, club house, swimming pool, and 24/7 security. Located near IT corridor.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Premium Villa with Pool in Jubilee Hills",
    location: "Jubilee Hills",
    price: "₹2.5 Cr",
    priceValue: 25000000,
    type: "Villa",
    bhk: "4BHK",
    area: "4,200 sqft",
    image: "/images/property-2.png",
    description:
      "Exquisite villa with private swimming pool, landscaped garden, modular kitchen, and premium interiors in the heart of Jubilee Hills.",
    isNew: false,
    isFeatured: true,
  },
  {
    id: 3,
    title: "Modern 2BHK Flat near Hitech City",
    location: "Hitech City",
    price: "₹48 Lakhs",
    priceValue: 4800000,
    type: "Flat",
    bhk: "2BHK",
    area: "1,200 sqft",
    image: "/images/property-3.png",
    description:
      "Brand new 2BHK flat with semi-furnished interiors, gym, children's play area, and proximity to metro station.",
    isNew: true,
    isFeatured: false,
  },
  {
    id: 4,
    title: "Independent House in Kondapur",
    location: "Kondapur",
    price: "₹1.8 Cr",
    priceValue: 18000000,
    type: "Independent House",
    bhk: "4BHK",
    area: "3,500 sqft",
    image: "/images/property-4.png",
    description:
      "Double-story independent house with private garden, car parking, servant quarters, and modular kitchen in a prime locality.",
    isNew: false,
    isFeatured: true,
  },
  {
    id: 5,
    title: "Scenic Farmhouse near Shamshabad",
    location: "LB Nagar",
    price: "₹95 Lakhs",
    priceValue: 9500000,
    type: "Farm House",
    bhk: "3BHK",
    area: "5,000 sqft",
    image: "/images/property-5.png",
    description:
      "Beautiful farmhouse with open land, rustic modern design, organic garden, and peaceful countryside setting away from the city hustle.",
    isNew: true,
    isFeatured: false,
  },
  {
    id: 6,
    title: "Penthouse in Banjara Hills",
    location: "Banjara Hills",
    price: "₹3.2 Cr",
    priceValue: 32000000,
    type: "Flat",
    bhk: "4BHK",
    area: "3,800 sqft",
    image: "/images/property-6.png",
    description:
      "Ultra-luxury penthouse with terrace garden, panoramic city views, smart home automation, and Italian marble flooring.",
    isNew: false,
    isFeatured: true,
  },
  {
    id: 7,
    title: "Affordable 2BHK in Miyapur",
    location: "Miyapur",
    price: "₹32 Lakhs",
    priceValue: 3200000,
    type: "Flat",
    bhk: "2BHK",
    area: "1,050 sqft",
    image: "/images/property-7.png",
    description:
      "Compact and efficient 2BHK apartment in a gated community with 24/7 water supply, power backup, and metro connectivity.",
    isNew: true,
    isFeatured: false,
  },
  {
    id: 8,
    title: "Gated Community Villa in Madhapur",
    location: "Madhapur",
    price: "₹1.5 Cr",
    priceValue: 15000000,
    type: "Villa",
    bhk: "3BHK",
    area: "2,800 sqft",
    image: "/images/property-8.png",
    description:
      "Elegant villa in a premium gated community with clubhouse, jogging track, amphitheatre, and round-the-clock security.",
    isNew: false,
    isFeatured: true,
  },
];

/**
 * Filter configuration for nested dynamic filters
 */
export const filterConfig = {
  Flats: {
    subFilters: ["2BHK", "3BHK", "4BHK"],
    nested: {
      "2BHK": ["Resale Flats (With Furniture)", "New Flats"],
      "3BHK": ["Resale Flats (With Furniture)", "New Flats"],
      "4BHK": ["Resale Flats (With Furniture)", "New Flats"],
    },
  },
  "Independent Houses": {
    subFilters: [],
    nested: {},
  },
  Villas: {
    subFilters: ["2BHK", "3BHK", "4BHK", "Duplex", "Triplex"],
    nested: {},
  },
  "Agriculture Land": {
    subFilters: ["1-2 Acres", "2-5 Acres", "5+ Acres"],
    nested: {},
  },
  Plots: {
    subFilters: [],
    nested: {},
  },
};

/**
 * Location options for Hyderabad
 */
export const locations = [
  "All Locations",
  "Gachibowli",
  "Madhapur",
  "Kukatpally",
  "Hitech City",
  "Kondapur",
  "Miyapur",
  "Jubilee Hills",
  "Banjara Hills",
  "LB Nagar",
  "Uppal",
];

/**
 * Price range options
 */
export const priceRanges = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Below 25 Lakhs", min: 0, max: 2500000 },
  { label: "Below 50 Lakhs", min: 0, max: 5000000 },
  { label: "Below 75 Lakhs", min: 0, max: 7500000 },
  { label: "Above 75 Lakhs", min: 7500000, max: Infinity },
];
