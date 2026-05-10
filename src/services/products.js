import { isSupabaseConfigured, supabase } from './supabase';
import { parseImageList } from '../utils/media';

const DEMO_PRODUCTS = [
  { id: 'demo-1', name: 'Luxe 3-Seater Sofa', brand: 'GUGAN', price: 24999, discount: 22, category: 'Living Room', fabric: 'Fabric', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop'], sizes: ['3 Seater', 'Grey', 'Walnut'], is_best_seller: true, is_trending: true, created_at: '2026-04-01T10:00:00.000Z' },
  { id: 'demo-2', name: 'Walnut Coffee Table', brand: 'WoodNest', price: 5999, discount: 15, category: 'Living Room', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=900&auto=format&fit=crop'], sizes: ['Round', 'Walnut', '90 cm'], is_new_arrival: true, created_at: '2026-04-09T10:00:00.000Z' },
  { id: 'demo-3', name: 'Modern TV Console', brand: 'Urban Home', price: 11999, discount: 10, category: 'Living Room', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop'], sizes: ['5 ft', '6 ft', 'Walnut'], is_best_seller: true, created_at: '2026-03-29T10:00:00.000Z' },
  { id: 'demo-4', name: 'Queen Upholstered Bed', brand: 'SleepCraft', price: 28999, discount: 28, category: 'Bedroom', fabric: 'Upholstery', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop'], sizes: ['Queen', 'King', 'Hydraulic'], is_best_seller: true, is_trending: true, created_at: '2026-04-04T10:00:00.000Z' },
  { id: 'demo-5', name: 'Two Door Wardrobe', brand: 'CasaWood', price: 17999, discount: 18, category: 'Bedroom', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Door', '3 Door', 'Mirror'], is_new_arrival: true, created_at: '2026-04-13T10:00:00.000Z' },
  { id: 'demo-6', name: 'Compact Bedside Table', brand: 'GUGAN', price: 3499, discount: 20, category: 'Bedroom', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=900&auto=format&fit=crop'], sizes: ['Single Drawer', 'Oak', 'Walnut'], is_trending: true, created_at: '2026-04-11T10:00:00.000Z' },
  { id: 'demo-7', name: 'Six Seater Dining Set', brand: 'DineWell', price: 32999, discount: 24, category: 'Dining', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Seater', '6 Seater', '8 Seater'], created_at: '2026-03-20T10:00:00.000Z' },
  { id: 'demo-8', name: 'Curved Dining Chair Pair', brand: 'SeatStory', price: 6999, discount: 14, category: 'Dining', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Set of 4', 'Cushioned'], is_best_seller: true, created_at: '2026-04-05T10:00:00.000Z' },
  { id: 'demo-9', name: 'Glass Top Bar Cabinet', brand: 'CasaWood', price: 18999, discount: 16, category: 'Dining', fabric: 'Glass & Wood', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop'], sizes: ['Compact', 'Tall', 'Walnut'], created_at: '2026-03-24T10:00:00.000Z' },
  { id: 'demo-10', name: 'Ergo Mesh Office Chair', brand: 'WorkPro', price: 8999, discount: 12, category: 'Office', fabric: 'Mesh', images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=900&auto=format&fit=crop'], sizes: ['High Back', 'Lumbar', 'Black'], is_trending: true, created_at: '2026-04-03T10:00:00.000Z' },
  { id: 'demo-11', name: 'Minimal Study Desk', brand: 'GUGAN', price: 10999, discount: 21, category: 'Office', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=900&auto=format&fit=crop'], sizes: ['4 ft', '5 ft', 'With Drawer'], is_new_arrival: true, created_at: '2026-04-20T10:00:00.000Z' },
  { id: 'demo-12', name: 'Open Bookshelf Unit', brand: 'ShelfMate', price: 7999, discount: 17, category: 'Office', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Tier', '5 Tier', 'Walnut'], created_at: '2026-03-27T10:00:00.000Z' },
  { id: 'demo-13', name: 'Outdoor Patio Set', brand: 'PatioPlus', price: 21999, discount: 18, category: 'Outdoor', fabric: 'Rattan', images: ['https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Chair', '4 Chair', 'With Table'], is_best_seller: true, created_at: '2026-04-06T10:00:00.000Z' },
  { id: 'demo-14', name: 'Balcony Folding Table', brand: 'Outdoorly', price: 3999, discount: 19, category: 'Outdoor', fabric: 'Metal', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop'], sizes: ['Small', 'Medium', 'Foldable'], is_trending: true, created_at: '2026-04-14T10:00:00.000Z' },
  { id: 'demo-15', name: 'Garden Lounge Chair', brand: 'PatioPlus', price: 7499, discount: 13, category: 'Outdoor', fabric: 'Wicker', images: ['https://images.unsplash.com/photo-1617104678098-de229db51175?q=80&w=900&auto=format&fit=crop'], sizes: ['Single', 'Set of 2', 'Beige'], is_new_arrival: true, created_at: '2026-04-17T10:00:00.000Z' },
  { id: 'demo-16', name: 'Six Shelf Shoe Rack', brand: 'StoreMore', price: 4999, discount: 25, category: 'Storage', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Shelf', '6 Shelf', 'Closed'], is_best_seller: true, created_at: '2026-04-08T10:00:00.000Z' },
  { id: 'demo-17', name: 'Tall Storage Cabinet', brand: 'StoreMore', price: 12999, discount: 20, category: 'Storage', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1616627781431-23b776aad6c6?q=80&w=900&auto=format&fit=crop'], sizes: ['Tall', 'Wide', 'White'], is_best_seller: true, created_at: '2026-04-02T10:00:00.000Z' },
  { id: 'demo-18', name: 'Floating Wall Shelves', brand: 'ShelfMate', price: 2499, discount: 15, category: 'Storage', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Set of 3', 'Oak'], is_trending: true, created_at: '2026-04-12T10:00:00.000Z' },
  { id: 'demo-19', name: 'Round Accent Mirror', brand: 'Decorly', price: 3499, discount: 18, category: 'Decor', fabric: 'Glass', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=900&auto=format&fit=crop'], sizes: ['24 inch', '30 inch', 'Black'], is_new_arrival: true, created_at: '2026-04-18T10:00:00.000Z' },
  { id: 'demo-20', name: 'Handwoven Area Rug', brand: 'Decorly', price: 5999, discount: 14, category: 'Decor', fabric: 'Cotton Blend', images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=900&auto=format&fit=crop'], sizes: ['4x6 ft', '5x7 ft', '6x9 ft'], created_at: '2026-04-10T10:00:00.000Z' },
  { id: 'demo-21', name: 'Ceramic Planter Trio', brand: 'GreenCorner', price: 1999, discount: 18, category: 'Decor', fabric: 'Ceramic', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 3', 'White', 'Terracotta'], is_new_arrival: true, created_at: '2026-04-15T10:00:00.000Z' },
  { id: 'demo-22', name: 'Arc Floor Lamp', brand: 'GlowHome', price: 7999, discount: 12, category: 'Lighting', fabric: 'Metal', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop'], sizes: ['Gold', 'Black', 'Warm Light'], created_at: '2026-04-07T10:00:00.000Z' },
  { id: 'demo-23', name: 'Bedside Table Lamp', brand: 'GlowHome', price: 2999, discount: 10, category: 'Lighting', fabric: 'Fabric Shade', images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=900&auto=format&fit=crop'], sizes: ['Warm', 'Neutral', 'Wood Base'], is_trending: true, created_at: '2026-04-21T10:00:00.000Z' },
  { id: 'demo-24', name: 'Pendant Dining Light', brand: 'LumaDecor', price: 6499, discount: 22, category: 'Lighting', fabric: 'Metal', images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=900&auto=format&fit=crop'], sizes: ['Single', 'Triple', 'Black'], is_best_seller: true, created_at: '2026-04-09T10:00:00.000Z' },
  { id: 'demo-25', name: 'Plush Recliner Chair', brand: 'ComfortCo', price: 18999, discount: 14, category: 'Living Room', fabric: 'Leatherette', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop'], sizes: ['Manual', 'Motorized', 'Brown'], created_at: '2026-04-11T10:00:00.000Z' },
  { id: 'demo-26', name: 'Compact Loveseat Sofa', brand: 'GUGAN', price: 16999, discount: 11, category: 'Living Room', fabric: 'Fabric', images: ['https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Seater', 'Blue', 'Grey'], is_new_arrival: true, created_at: '2026-04-16T10:00:00.000Z' },
  { id: 'demo-27', name: 'Memory Foam Mattress', brand: 'SleepCraft', price: 15999, discount: 18, category: 'Bedroom', fabric: 'Foam', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=900&auto=format&fit=crop'], sizes: ['Single', 'Queen', 'King'], is_best_seller: true, created_at: '2026-04-10T10:00:00.000Z' },
  { id: 'demo-28', name: 'Dresser With Mirror', brand: 'CasaWood', price: 14999, discount: 16, category: 'Bedroom', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop'], sizes: ['3 Drawer', 'Mirror', 'Walnut'], created_at: '2026-04-14T10:00:00.000Z' },
  { id: 'demo-29', name: 'Round Dining Table', brand: 'DineWell', price: 13999, discount: 13, category: 'Dining', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Seater', 'Round', 'Oak'], is_trending: true, created_at: '2026-04-18T10:00:00.000Z' },
  { id: 'demo-30', name: 'Crockery Display Unit', brand: 'CasaWood', price: 16999, discount: 8, category: 'Dining', fabric: 'Glass & Wood', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop'], sizes: ['Single Door', 'Double Door', 'Walnut'], created_at: '2026-04-06T10:00:00.000Z' },
  { id: 'demo-31', name: 'Executive Office Desk', brand: 'WorkPro', price: 18999, discount: 20, category: 'Office', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop'], sizes: ['5 ft', '6 ft', 'With Storage'], is_best_seller: true, created_at: '2026-04-12T10:00:00.000Z' },
  { id: 'demo-32', name: 'Filing Storage Cabinet', brand: 'StoreMore', price: 6999, discount: 15, category: 'Office', fabric: 'Metal', images: ['https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Drawer', '3 Drawer', 'Lockable'], created_at: '2026-04-15T10:00:00.000Z' },
  { id: 'demo-33', name: 'Teak Garden Bench', brand: 'Outdoorly', price: 12999, discount: 10, category: 'Outdoor', fabric: 'Teak Wood', images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Seater', '3 Seater', 'Natural'], created_at: '2026-04-08T10:00:00.000Z' },
  { id: 'demo-34', name: 'Outdoor Swing Chair', brand: 'PatioPlus', price: 14999, discount: 17, category: 'Outdoor', fabric: 'Rattan', images: ['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=900&auto=format&fit=crop'], sizes: ['Single', 'With Stand', 'Cushioned'], is_new_arrival: true, created_at: '2026-04-20T10:00:00.000Z' },
  { id: 'demo-35', name: 'Modular Wardrobe System', brand: 'StoreMore', price: 34999, discount: 10, category: 'Storage', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop'], sizes: ['3 Door', '4 Door', 'Sliding'], created_at: '2026-04-07T10:00:00.000Z' },
  { id: 'demo-36', name: 'Entryway Console Table', brand: 'Decorly', price: 8999, discount: 14, category: 'Decor', fabric: 'Wood & Metal', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop'], sizes: ['3 ft', '4 ft', 'Black'], is_best_seller: true, created_at: '2026-04-13T10:00:00.000Z' },
  { id: 'demo-37', name: 'Textured Wall Art Set', brand: 'Decorly', price: 4499, discount: 9, category: 'Decor', fabric: 'Canvas', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Set of 3', 'Neutral'], created_at: '2026-04-16T10:00:00.000Z' },
  { id: 'demo-38', name: 'Cluster Pendant Lights', brand: 'LumaDecor', price: 9999, discount: 12, category: 'Lighting', fabric: 'Glass', images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=900&auto=format&fit=crop'], sizes: ['3 Light', '5 Light', 'Amber'], is_new_arrival: true, created_at: '2026-04-19T10:00:00.000Z' },
  { id: 'demo-39', name: 'Wall Sconce Pair', brand: 'GlowHome', price: 3999, discount: 18, category: 'Lighting', fabric: 'Metal', images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Warm Light', 'Black'], created_at: '2026-04-22T10:00:00.000Z' },
  { id: 'demo-40', name: 'Sectional Corner Sofa', brand: 'GUGAN', price: 42999, discount: 12, category: 'Living Room', fabric: 'Fabric', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop'], sizes: ['L Shape', 'Right Chaise', 'Left Chaise'], is_trending: true, created_at: '2026-04-23T10:00:00.000Z' },
  { id: 'demo-41', name: 'Solid Wood Chest Drawer', brand: 'CasaWood', price: 11999, discount: 15, category: 'Bedroom', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Drawer', '5 Drawer', 'Walnut'], is_new_arrival: true, created_at: '2026-04-24T10:00:00.000Z' },
  { id: 'demo-42', name: 'Bench Dining Seat', brand: 'DineWell', price: 7999, discount: 16, category: 'Dining', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=900&auto=format&fit=crop'], sizes: ['4 ft', '5 ft', 'Cushioned'], created_at: '2026-04-25T10:00:00.000Z' },
  { id: 'demo-43', name: 'Nest Side Table Set', brand: 'WoodNest', price: 6499, discount: 11, category: 'Living Room', fabric: 'Wood & Metal', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Oak', 'Black'], is_new_arrival: true, created_at: '2026-04-26T10:00:00.000Z' },
  { id: 'demo-44', name: 'Velvet Accent Chair', brand: 'ComfortCo', price: 12999, discount: 18, category: 'Living Room', fabric: 'Velvet', images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop'], sizes: ['Emerald', 'Beige', 'Single'], created_at: '2026-04-27T10:00:00.000Z' },
  { id: 'demo-45', name: 'Marble Top Center Table', brand: 'Urban Home', price: 15999, discount: 14, category: 'Living Room', fabric: 'Marble & Metal', images: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=900&auto=format&fit=crop'], sizes: ['Round', 'Gold Base', 'White Top'], is_best_seller: true, created_at: '2026-04-28T10:00:00.000Z' },
  { id: 'demo-46', name: 'King Platform Bed', brand: 'SleepCraft', price: 36999, discount: 19, category: 'Bedroom', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1617325247661-675ab4b64b40?q=80&w=900&auto=format&fit=crop'], sizes: ['King', 'Queen', 'Natural Oak'], is_best_seller: true, created_at: '2026-04-29T10:00:00.000Z' },
  { id: 'demo-47', name: 'Sliding Door Wardrobe', brand: 'StoreMore', price: 42999, discount: 17, category: 'Bedroom', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Door', '3 Door', 'Mirror'], is_trending: true, created_at: '2026-04-30T10:00:00.000Z' },
  { id: 'demo-48', name: 'Tufted Storage Ottoman', brand: 'ComfortCo', price: 7999, discount: 12, category: 'Bedroom', fabric: 'Upholstery', images: ['https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=900&auto=format&fit=crop'], sizes: ['Bench', 'Grey', 'Beige'], created_at: '2026-05-01T10:00:00.000Z' },
  { id: 'demo-49', name: 'Extendable Dining Table', brand: 'DineWell', price: 38999, discount: 16, category: 'Dining', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=900&auto=format&fit=crop'], sizes: ['6 Seater', '8 Seater', 'Extendable'], is_new_arrival: true, created_at: '2026-05-02T10:00:00.000Z' },
  { id: 'demo-50', name: 'Upholstered Dining Chair Set', brand: 'SeatStory', price: 11999, discount: 13, category: 'Dining', fabric: 'Fabric & Wood', images: ['https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Set of 4', 'Grey'], is_best_seller: true, created_at: '2026-05-03T10:00:00.000Z' },
  { id: 'demo-51', name: 'Kitchen Island Cart', brand: 'CasaWood', price: 13999, discount: 9, category: 'Dining', fabric: 'Wood & Steel', images: ['https://images.unsplash.com/photo-1556912173-3bb406ef7e8d?q=80&w=900&auto=format&fit=crop'], sizes: ['With Wheels', '2 Drawer', 'White'], created_at: '2026-05-04T10:00:00.000Z' },
  { id: 'demo-52', name: 'Height Adjustable Desk', brand: 'WorkPro', price: 27999, discount: 18, category: 'Office', fabric: 'Metal & Wood', images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop'], sizes: ['4 ft', '5 ft', 'Electric'], is_trending: true, created_at: '2026-05-05T10:00:00.000Z' },
  { id: 'demo-53', name: 'Executive Leather Chair', brand: 'WorkPro', price: 14999, discount: 20, category: 'Office', fabric: 'Leatherette', images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=900&auto=format&fit=crop'], sizes: ['High Back', 'Brown', 'Black'], is_best_seller: true, created_at: '2026-05-06T10:00:00.000Z' },
  { id: 'demo-54', name: 'Compact Laptop Table', brand: 'GUGAN', price: 3999, discount: 10, category: 'Office', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=900&auto=format&fit=crop'], sizes: ['Foldable', 'Walnut', 'White'], is_new_arrival: true, created_at: '2026-05-07T10:00:00.000Z' },
  { id: 'demo-55', name: 'Rattan Balcony Chair Pair', brand: 'PatioPlus', price: 16999, discount: 15, category: 'Outdoor', fabric: 'Rattan', images: ['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Natural', 'With Cushions'], is_best_seller: true, created_at: '2026-05-08T10:00:00.000Z' },
  { id: 'demo-56', name: 'Outdoor Dining Bench', brand: 'Outdoorly', price: 9999, discount: 11, category: 'Outdoor', fabric: 'Teak Wood', images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=900&auto=format&fit=crop'], sizes: ['4 ft', '5 ft', 'Natural'], created_at: '2026-05-09T10:00:00.000Z' },
  { id: 'demo-57', name: 'Garden Bistro Table', brand: 'PatioPlus', price: 6499, discount: 12, category: 'Outdoor', fabric: 'Powder Coated Metal', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop'], sizes: ['Round', 'Foldable', 'Black'], is_new_arrival: true, created_at: '2026-05-10T10:00:00.000Z' },
  { id: 'demo-58', name: 'Low Storage Trunk', brand: 'StoreMore', price: 8999, discount: 18, category: 'Storage', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop'], sizes: ['3 ft', '4 ft', 'Walnut'], is_trending: true, created_at: '2026-05-11T10:00:00.000Z' },
  { id: 'demo-59', name: 'Modular Wall Cabinet', brand: 'ShelfMate', price: 11999, discount: 14, category: 'Storage', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Module', '3 Module', 'White'], created_at: '2026-05-12T10:00:00.000Z' },
  { id: 'demo-60', name: 'Laundry Storage Tower', brand: 'StoreMore', price: 7499, discount: 10, category: 'Storage', fabric: 'Bamboo', images: ['https://images.unsplash.com/photo-1616627781431-23b776aad6c6?q=80&w=900&auto=format&fit=crop'], sizes: ['3 Basket', '4 Basket', 'Natural'], is_new_arrival: true, created_at: '2026-05-13T10:00:00.000Z' },
  { id: 'demo-61', name: 'Ceramic Vase Set', brand: 'Decorly', price: 2999, discount: 12, category: 'Decor', fabric: 'Ceramic', images: ['https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 2', 'Set of 3', 'Matte'], is_trending: true, created_at: '2026-05-14T10:00:00.000Z' },
  { id: 'demo-62', name: 'Large Wall Clock', brand: 'Decorly', price: 2499, discount: 8, category: 'Decor', fabric: 'Metal', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=900&auto=format&fit=crop'], sizes: ['24 inch', '30 inch', 'Black'], created_at: '2026-05-15T10:00:00.000Z' },
  { id: 'demo-63', name: 'Textured Cushion Set', brand: 'SoftHome', price: 1999, discount: 16, category: 'Decor', fabric: 'Cotton', images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop'], sizes: ['Set of 4', 'Neutral', 'Pastel'], is_best_seller: true, created_at: '2026-05-16T10:00:00.000Z' },
  { id: 'demo-64', name: 'Linear Pendant Light', brand: 'LumaDecor', price: 11999, discount: 17, category: 'Lighting', fabric: 'Metal & Glass', images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=900&auto=format&fit=crop'], sizes: ['3 ft', '4 ft', 'Warm Light'], is_best_seller: true, created_at: '2026-05-17T10:00:00.000Z' },
  { id: 'demo-65', name: 'Tripod Floor Lamp', brand: 'GlowHome', price: 6999, discount: 13, category: 'Lighting', fabric: 'Wood & Fabric', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop'], sizes: ['Natural', 'Black', 'Warm Light'], is_new_arrival: true, created_at: '2026-05-18T10:00:00.000Z' },
  { id: 'demo-66', name: 'Smart LED Wall Light', brand: 'LumaDecor', price: 4999, discount: 15, category: 'Lighting', fabric: 'Aluminium', images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=900&auto=format&fit=crop'], sizes: ['White', 'Warm', 'Dimmable'], is_trending: true, created_at: '2026-05-19T10:00:00.000Z' },
  { id: 'demo-67', name: 'Modular Sofa Lounger', brand: 'GUGAN', price: 52999, discount: 18, category: 'Living Room', fabric: 'Fabric', images: ['https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=900&auto=format&fit=crop'], sizes: ['L Shape', 'Grey', 'Beige'], is_new_arrival: true, created_at: '2026-04-25T10:00:00.000Z' },
  { id: 'demo-68', name: 'Cane Lounge Chair', brand: 'ComfortCo', price: 13999, discount: 12, category: 'Living Room', fabric: 'Cane & Wood', images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=900&auto=format&fit=crop'], sizes: ['Natural', 'Black Frame', 'Single'], created_at: '2026-04-26T10:00:00.000Z' },
  { id: 'demo-69', name: 'Hydraulic Storage Bed', brand: 'SleepCraft', price: 44999, discount: 20, category: 'Bedroom', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=900&auto=format&fit=crop'], sizes: ['Queen', 'King', 'Hydraulic'], is_best_seller: true, created_at: '2026-04-27T10:00:00.000Z' },
  { id: 'demo-70', name: 'Minimal Dressing Table', brand: 'CasaWood', price: 12999, discount: 11, category: 'Bedroom', fabric: 'Wood & Glass', images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop'], sizes: ['Mirror', 'Drawer', 'Walnut'], created_at: '2026-04-28T10:00:00.000Z' },
  { id: 'demo-71', name: 'Round Marble Dining Table', brand: 'DineWell', price: 45999, discount: 16, category: 'Dining', fabric: 'Marble & Wood', images: ['https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Seater', '6 Seater', 'Round'], is_trending: true, created_at: '2026-04-29T10:00:00.000Z' },
  { id: 'demo-72', name: 'Buffet Sideboard Cabinet', brand: 'CasaWood', price: 22999, discount: 14, category: 'Dining', fabric: 'Solid Wood', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop'], sizes: ['3 Door', '4 Door', 'Walnut'], created_at: '2026-04-30T10:00:00.000Z' },
  { id: 'demo-73', name: 'Corner Workstation Desk', brand: 'WorkPro', price: 16999, discount: 13, category: 'Office', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop'], sizes: ['Left Corner', 'Right Corner', 'Oak'], is_new_arrival: true, created_at: '2026-05-01T10:00:00.000Z' },
  { id: 'demo-74', name: 'Tall Library Bookcase', brand: 'ShelfMate', price: 14999, discount: 10, category: 'Office', fabric: 'Wood', images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop'], sizes: ['5 Tier', '6 Tier', 'Walnut'], created_at: '2026-05-02T10:00:00.000Z' },
  { id: 'demo-75', name: 'Weatherproof Patio Sofa', brand: 'PatioPlus', price: 32999, discount: 17, category: 'Outdoor', fabric: 'Rattan', images: ['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=900&auto=format&fit=crop'], sizes: ['2 Seater', '3 Seater', 'Grey'], is_best_seller: true, created_at: '2026-05-03T10:00:00.000Z' },
  { id: 'demo-76', name: 'Foldable Garden Lounger', brand: 'Outdoorly', price: 10999, discount: 12, category: 'Outdoor', fabric: 'Teak & Canvas', images: ['https://images.unsplash.com/photo-1617104678098-de229db51175?q=80&w=900&auto=format&fit=crop'], sizes: ['Single', 'Foldable', 'Natural'], created_at: '2026-05-04T10:00:00.000Z' },
  { id: 'demo-77', name: 'Sliding Shoe Cabinet', brand: 'StoreMore', price: 9999, discount: 14, category: 'Storage', fabric: 'Engineered Wood', images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=900&auto=format&fit=crop'], sizes: ['12 Pair', '18 Pair', 'Closed'], is_trending: true, created_at: '2026-05-05T10:00:00.000Z' },
  { id: 'demo-78', name: 'Multi Utility Storage Unit', brand: 'StoreMore', price: 15999, discount: 16, category: 'Storage', fabric: 'Wood & Metal', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop'], sizes: ['4 Shelf', '6 Shelf', 'Black'], created_at: '2026-05-06T10:00:00.000Z' },
  { id: 'demo-79', name: 'Statement Wall Mirror', brand: 'Decorly', price: 7999, discount: 18, category: 'Decor', fabric: 'Glass & Metal', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=900&auto=format&fit=crop'], sizes: ['Round', 'Arch', 'Gold'], is_new_arrival: true, created_at: '2026-05-07T10:00:00.000Z' },
  { id: 'demo-80', name: 'Handmade Table Decor Bowl', brand: 'GreenCorner', price: 1799, discount: 9, category: 'Decor', fabric: 'Ceramic', images: ['https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=900&auto=format&fit=crop'], sizes: ['Small', 'Large', 'Matte'], created_at: '2026-05-08T10:00:00.000Z' },
  { id: 'demo-81', name: 'Crystal Chandelier', brand: 'LumaDecor', price: 18999, discount: 21, category: 'Lighting', fabric: 'Crystal & Metal', images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=900&auto=format&fit=crop'], sizes: ['6 Light', '8 Light', 'Warm'], is_best_seller: true, created_at: '2026-05-09T10:00:00.000Z' },
  { id: 'demo-82', name: 'Minimal Ceiling Light', brand: 'GlowHome', price: 3499, discount: 10, category: 'Lighting', fabric: 'Acrylic', images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=900&auto=format&fit=crop'], sizes: ['12 inch', '18 inch', 'Neutral'], created_at: '2026-05-10T10:00:00.000Z' },
];

const toArray = (value) => parseImageList(value);

const normalizeProduct = (item) => {
  const images = toArray(item?.images);
  return {
    ...item,
    id: item?.id ?? `demo-${Math.random().toString(36).slice(2, 8)}`,
    name: item?.name || 'Untitled Product',
    brand: item?.brand || 'GUGAN',
    price: Number(item?.price) || 0,
    discount: Number(item?.discount) || 0,
    images: images.length ? images : ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop'],
    sizes: Array.isArray(item?.sizes) && item.sizes.length ? item.sizes : ['Standard', 'Premium'],
    created_at: item?.created_at || '2026-01-01T00:00:00.000Z'
  };
};

const applyDemoFilters = (products, filters = {}) => {
  let result = [...products];
  const {
    category,
    priceRange,
    sort,
    search,
    sizes,
    brand,
    fabric,
    isBestSeller,
    isNewArrival,
    isTrending,
    limit = 50,
    offset = 0
  } = filters;

  if (category) result = result.filter((p) => String(p.category).toLowerCase() === String(category).toLowerCase());
  if (brand) result = result.filter((p) => String(p.brand).toLowerCase() === String(brand).toLowerCase());
  if (fabric) result = result.filter((p) => String(p.fabric).toLowerCase() === String(fabric).toLowerCase());
  if (isBestSeller) result = result.filter((p) => p.is_best_seller);
  if (isNewArrival) result = result.filter((p) => p.is_new_arrival);
  if (isTrending) result = result.filter((p) => p.is_trending);

  if (search) {
    const normalizeSearchTerm = (value) => String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.endsWith('s') && word.length > 3 ? word.slice(0, -1) : word);
    const needles = normalizeSearchTerm(search);
    result = result.filter((p) => {
      const haystack = normalizeSearchTerm(`${p.name} ${p.brand} ${p.category} ${p.fabric} ${(p.sizes || []).join(' ')}`).join(' ');
      return needles.every((needle) => haystack.includes(needle));
    });
  }

  if (priceRange) {
    result = result.filter((p) => p.price >= Number(priceRange.min ?? 0) && p.price <= Number(priceRange.max ?? 999999));
  }

  if (sizes?.length) {
    result = result.filter((p) => p.sizes?.some((size) => sizes.includes(size)));
  }

  if (sort) {
    const [column, order] = sort.split(':');
    const asc = order === 'asc';
    result.sort((a, b) => {
      const av = a[column];
      const bv = b[column];
      if (column === 'created_at') {
        return asc ? new Date(av) - new Date(bv) : new Date(bv) - new Date(av);
      }
      if (typeof av === 'number' && typeof bv === 'number') {
        return asc ? av - bv : bv - av;
      }
      return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  } else {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const total = result.length;
  const paged = result.slice(offset, offset + limit);
  return { products: paged, total };
};

const productQueryCache = new Map();
const productByIdCache = new Map();
const demoCatalog = () => DEMO_PRODUCTS.map(normalizeProduct);
const getCachedResult = (cache, key) => {
  if (!cache.has(key)) return null;
  return cache.get(key);
};
const setCachedResult = (cache, key, value) => {
  cache.set(key, value);
  return value;
};
const clearProductCache = () => {
  productQueryCache.clear();
  productByIdCache.clear();
};

export const productService = {
  async getProducts({ 
    category, 
    priceRange, 
    sort, 
    search, 
    sizes, 
    brand,
    fabric,
    isBestSeller,
    isNewArrival,
    isTrending,
    limit = 50,
    offset = 0
  } = {}) {
    const filters = {
      category,
      priceRange,
      sort,
      search,
      sizes,
      brand,
      fabric,
      isBestSeller,
      isNewArrival,
      isTrending,
      limit,
      offset
    };
    const cacheKey = JSON.stringify(filters);
    const cached = getCachedResult(productQueryCache, cacheKey);
    if (cached) return cached;

    if (!isSupabaseConfigured) {
      return setCachedResult(productQueryCache, cacheKey, applyDemoFilters(demoCatalog(), filters));
    }

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (category) query = query.eq('category', category);
    if (brand) query = query.eq('brand', brand);
    if (fabric) query = query.eq('fabric', fabric);
    if (isBestSeller) query = query.eq('is_best_seller', true);
    if (isNewArrival) query = query.eq('is_new_arrival', true);
    if (isTrending) query = query.eq('is_trending', true);

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    if (priceRange) {
      query = query.gte('price', priceRange.min).lte('price', priceRange.max);
    }

    if (sizes && sizes.length > 0) {
      // Assuming sizes is stored in a way that we can filter (e.g., jsonb array)
      // For simplicity in vanilla supabase-js, we filter by 'contains' or or
      query = query.filter('sizes', 'cs', JSON.stringify(sizes));
    }

    if (sort) {
      const [column, order] = sort.split(':');
      query = query.order(column, { ascending: order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (limit) query = query.range(offset, offset + limit - 1);

    try {
      const { data, error, count } = await query;
      if (error) throw error;

      const normalized = (data || []).map(normalizeProduct);
      if (normalized.length > 0) {
        return setCachedResult(productQueryCache, cacheKey, { products: normalized, total: count ?? normalized.length });
      }
    } catch (_) {
      // Fallback to demo catalog when backend is empty or unavailable.
    }

    return setCachedResult(productQueryCache, cacheKey, applyDemoFilters(demoCatalog(), filters));
  },

  async getProductById(id) {
    const cacheKey = String(id);
    const cached = getCachedResult(productByIdCache, cacheKey);
    if (cached) return cached;

    if (!isSupabaseConfigured) {
      const demo = demoCatalog().find((p) => String(p.id) === cacheKey);
      if (!demo) throw new Error('Product not found');
      return setCachedResult(productByIdCache, cacheKey, demo);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return setCachedResult(productByIdCache, cacheKey, normalizeProduct(data));
    } catch (_) {
      const demo = demoCatalog().find((p) => String(p.id) === String(id));
      if (!demo) throw new Error('Product not found');
      return setCachedResult(productByIdCache, cacheKey, demo);
    }
  },

  async createProduct(productData) {
    clearProductCache();
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id, productData) {
    clearProductCache();
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    clearProductCache();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Demo data for UI fallback and local development
  getMockProducts() {
    return demoCatalog();
  }
};
