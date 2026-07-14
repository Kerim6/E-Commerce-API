import { db } from "./connection.ts";
import {
  users,
  categories,
  products,
  productImages,
  carts,
  cartItems,
  orders,
  orderItems,
  addresses,
  orderAddresses,
  reviews,
} from "./schema/index.ts";
import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function seed() {
  console.log("🌱 Starting E-Commerce database seed...");

  try {
    // Step 1: Clear existing data (order matters due to foreign keys!)
    console.log("Clearing existing data...");
    await db.delete(reviews);
    await db.delete(cartItems);
    await db.delete(carts);
    await db.delete(orderAddresses);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(addresses);
    await db.delete(productImages);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(users);

    // Step 2: Create demo users
    console.log("Creating demo users...");
    const hashedPassword = await hashPassword("demo123");
    const hashedPassword2 = await hashPassword("user456");

    const [adminUser] = await db
      .insert(users)
      .values({
        email: "admin@ecommerce.com",
        password: hashedPassword,
        role: "admin",
        firstName: "Admin",
        lastName: "User",
      })
      .returning();

    const [regularUser] = await db
      .insert(users)
      .values({
        email: "customer@ecommerce.com",
        password: hashedPassword2,
        role: "user",
        firstName: "John",
        lastName: "Doe",
      })
      .returning();

    // Step 3: Create categories
    console.log("Creating categories...");
    const [electronicsCategory] = await db
      .insert(categories)
      .values({
        name: "Electronics",
        slug: "electronics",
      })
      .returning();

    const [clothingCategory] = await db
      .insert(categories)
      .values({
        name: "Clothing",
        slug: "clothing",
      })
      .returning();

    const [booksCategory] = await db
      .insert(categories)
      .values({
        name: "Books",
        slug: "books",
      })
      .returning();

    // Step 4: Create products
    console.log("Creating products...");
    const [laptop] = await db
      .insert(products)
      .values({
        name: "Laptop Pro 15",
        slog: "laptop-pro-15",
        description: "High-performance laptop for professionals",
        price: "1299.99",
        stock: 50,
        categoryId: electronicsCategory.id,
      })
      .returning();

    const [wireless_mouse] = await db
      .insert(products)
      .values({
        name: "Wireless Mouse",
        slog: "wireless-mouse",
        description: "Ergonomic wireless mouse with 2.4GHz connection",
        price: "29.99",
        stock: 200,
        categoryId: electronicsCategory.id,
      })
      .returning();

    const [tshirt] = await db
      .insert(products)
      .values({
        name: "Cotton T-Shirt",
        slog: "cotton-tshirt",
        description: "Comfortable 100% cotton t-shirt",
        price: "19.99",
        stock: 300,
        categoryId: clothingCategory.id,
      })
      .returning();

    const [book] = await db
      .insert(products)
      .values({
        name: "Clean Code",
        slog: "clean-code",
        description: "A Handbook of Agile Software Craftsmanship",
        price: "45.00",
        stock: 75,
        categoryId: booksCategory.id,
      })
      .returning();

    // Step 5: Create product images
    console.log("Creating product images...");
    await db.insert(productImages).values([
      {
        productId: laptop.id,
        imageUrl: "https://via.placeholder.com/500?text=Laptop+Pro+15",
      },
      {
        productId: laptop.id,
        imageUrl: "https://via.placeholder.com/500?text=Laptop+Pro+15+Side",
      },
      {
        productId: wireless_mouse.id,
        imageUrl: "https://via.placeholder.com/500?text=Wireless+Mouse",
      },
      {
        productId: tshirt.id,
        imageUrl: "https://via.placeholder.com/500?text=T-Shirt",
      },
      {
        productId: book.id,
        imageUrl: "https://via.placeholder.com/500?text=Clean+Code+Book",
      },
    ]);

    // Step 6: Create user addresses
    console.log("Creating user addresses...");
    const [homeAddress] = await db
      .insert(addresses)
      .values({
        userId: regularUser.id,
        country: "United States",
        city: "San Francisco",
        street: "123 Main St",
        postalCode: "94105",
        isDefault: true,
      })
      .returning();

    const [workAddress] = await db
      .insert(addresses)
      .values({
        userId: regularUser.id,
        country: "United States",
        city: "New York",
        street: "456 Tech Ave",
        postalCode: "10001",
        isDefault: false,
      })
      .returning();

    // Step 7: Create shopping cart
    console.log("Creating shopping cart...");
    const [cart] = await db
      .insert(carts)
      .values({
        userId: regularUser.id,
      })
      .returning();

    // Step 8: Add items to cart
    await db.insert(cartItems).values([
      {
        cartId: cart.id,
        productId: laptop.id,
        quantity: 1,
      },
      {
        cartId: cart.id,
        productId: wireless_mouse.id,
        quantity: 2,
      },
    ]);

    // Step 9: Create orders
    console.log("Creating orders...");
    const [order1] = await db
      .insert(orders)
      .values({
        userId: regularUser.id,
        status: "delivered",
        totalPrice: "1329.98",
      })
      .returning();

    const [order2] = await db
      .insert(orders)
      .values({
        userId: regularUser.id,
        status: "processing",
        totalPrice: "64.99",
      })
      .returning();

    // Step 10: Create order items
    console.log("Creating order items...");
    await db.insert(orderItems).values([
      {
        orderId: order1.id,
        productId: laptop.id,
        unitPrice: "1299.99",
        quantity: 1,
      },
      {
        orderId: order1.id,
        productId: wireless_mouse.id,
        unitPrice: "29.99",
        quantity: 1,
      },
      {
        orderId: order2.id,
        productId: tshirt.id,
        unitPrice: "19.99",
        quantity: 2,
      },
      {
        orderId: order2.id,
        productId: book.id,
        unitPrice: "45.00",
        quantity: 1,
      },
    ]);

    // Step 11: Create order addresses
    console.log("Creating order addresses...");
    await db.insert(orderAddresses).values([
      {
        orderId: order1.id,
        country: "United States",
        city: "San Francisco",
        street: "123 Main St",
        postalCode: "94105",
      },
      {
        orderId: order2.id,
        country: "United States",
        city: "New York",
        street: "456 Tech Ave",
        postalCode: "10001",
      },
    ]);

    // Step 12: Create reviews
    console.log("Creating reviews...");
    await db.insert(reviews).values([
      {
        userId: regularUser.id,
        productId: laptop.id,
        rating: 5,
        comment: "Excellent laptop! Very fast and reliable.",
      },
      {
        userId: regularUser.id,
        productId: wireless_mouse.id,
        rating: 4,
        comment: "Good mouse, battery lasts long.",
      },
      {
        userId: regularUser.id,
        productId: book.id,
        rating: 5,
        comment: "Must-read for any developer.",
      },
    ]);

    // Step 13: Query and display seed summary
    console.log("\n✅ Database seeded successfully!");
    console.log("\n📊 Seed Summary:");
    console.log(`- ${2} demo users created`);
    console.log(`- ${3} product categories created`);
    console.log(`- ${4} products created`);
    console.log(`- ${1} shopping cart created with ${2} items`);
    console.log(`- ${2} orders created`);
    console.log(`- ${3} reviews created`);
    console.log("\n🔑 Login Credentials:");
    console.log("Admin:");
    console.log("  Email: admin@ecommerce.com");
    console.log("  Password: demo123");
    console.log("\nCustomer:");
    console.log("  Email: customer@ecommerce.com");
    console.log("  Password: user456");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run seed when file is executed
seed()
  .then(() => {
    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to run seed:", error);
    process.exit(1);
  });

export default seed;
