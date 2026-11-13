export interface IProductSeed {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
}

export const initialProducts: IProductSeed[] = [
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling headphones with dual processors, 8 microphones, and up to 30 hours of battery life with ultra-comfortable lightweight design.",
    price: 399.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 18,
    rating: 4.8,
    numReviews: 124,
    isFeatured: true
  },
  {
    name: "Apple Watch Series 9 GPS 45mm",
    description: "Smarter, brighter, and mightier with the S9 SiP chip, double tap gesture, advanced health sensors including ECG and Blood Oxygen tracking.",
    price: 429.00,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 24,
    rating: 4.9,
    numReviews: 98,
    isFeatured: true
  },
  {
    name: "Fujifilm X-T5 Mirrorless Digital Camera",
    description: "40.2MP X-Trans CMOS 5 HR sensor, 5-axis in-body image stabilization, 6.2K/30p video, and iconic tactile dial controls for creative photography.",
    price: 1699.95,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 8,
    rating: 4.7,
    numReviews: 45,
    isFeatured: true
  },
  {
    name: "Minimalist Italian Leather Backpack",
    description: "Handcrafted from full-grain vegetable-tanned leather, equipped with padded 15-inch laptop sleeve, water-resistant lining, and solid brass hardware.",
    price: 249.50,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 32,
    rating: 4.6,
    numReviews: 87,
    isFeatured: false
  },
  {
    name: "Heritage Cashmere Crewneck Sweater",
    description: "Spun from 100% Grade-A Mongolian cashmere with a relaxed classic fit, ribbed trim, and supreme softness designed for all-season layering.",
    price: 185.00,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 40,
    rating: 4.7,
    numReviews: 63,
    isFeatured: false
  },
  {
    name: "Nike Air Max 270 React Runners",
    description: "Lightweight lifestyle sneaker combining Nike's biggest Air unit with lightweight, durable Nike React foam for super soft cushioning and bouncy strides.",
    price: 159.99,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 15,
    rating: 4.5,
    numReviews: 210,
    isFeatured: true
  },
  {
    name: "Fellow Ode Gen 2 Brew Grinder",
    description: "Precision burr coffee grinder built for aeropress, pour-over, French press, and cold brew with 64mm commercial-grade flat burrs and quiet motor.",
    price: 345.00,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 12,
    rating: 4.9,
    numReviews: 54,
    isFeatured: true
  },
  {
    name: "Modern Ergonomic Mesh Office Chair",
    description: "Breathable double-mesh executive desk chair with adjustable lumbar support, 3D armrests, dynamic recline lock, and silent PU caster wheels.",
    price: 299.00,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1580481077195-c22ae2b30928?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 20,
    rating: 4.4,
    numReviews: 76,
    isFeatured: false
  },
  {
    name: "Artisan Ceramic Pour-Over Kettle & Carafe",
    description: "Handcrafted matte ceramic coffee dripper set with heat-resistant borosilicate glass carafe and precision stainless steel gooseneck spout.",
    price: 89.00,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 28,
    rating: 4.8,
    numReviews: 39,
    isFeatured: false
  },
  {
    name: "Marshall Acton III Bluetooth Speaker",
    description: "Legendary room-filling sound with re-engineered soundstage, Bluetooth 5.2, custom bass reflex port, and vintage brass accent controls.",
    price: 279.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 14,
    rating: 4.7,
    numReviews: 92,
    isFeatured: true
  },
  {
    name: "Nordic Ceramic Table Lamp",
    description: "Sculptural textured clay base with warm linen lampshade, three-stage touch dimming, and energy-efficient ambient warm LED bulb included.",
    price: 119.00,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 22,
    rating: 4.6,
    numReviews: 48,
    isFeatured: false
  },
  {
    name: "UV-Protect Polarized Classic Sunglasses",
    description: "Acetate handcrafted frames with scratch-resistant category 3 polarized lenses offering 100% UVA/UVB protection and premium hard case.",
    price: 95.00,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 35,
    rating: 4.5,
    numReviews: 67,
    isFeatured: false
  }
];
