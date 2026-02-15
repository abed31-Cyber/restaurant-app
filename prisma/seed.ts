import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with real data...');

  // Create restaurant - Les Saveurs d'Istanbul
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Les Saveurs d'Istanbul",
      slug: 'les-saveurs-d-istanbul',
      address: '264 Avenue de Fronton, 31200 Toulouse, France',
      phone: '+33 9 82 44 00 12',
      email: 'contact@saveurs-istanbul.fr',
      description: 'Cuisine turque traditionnelle et restauration rapide. Kebab, Tacos, Naans au fromage maison cuits au four artisanal.',
      primaryColor: '#F97316',
      subscriptionStatus: 'ACTIVE',
    },
  });

  console.log('✅ Restaurant created:', restaurant.name);

  // Create opening hours - Tous les jours 11h-23h
  const openingHoursData = [
    { dayOfWeek: 0, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Sunday
    { dayOfWeek: 1, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Monday
    { dayOfWeek: 2, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Saturday
  ];

  for (const hours of openingHoursData) {
    await prisma.openingHours.create({
      data: {
        ...hours,
        restaurantId: restaurant.id,
      },
    });
  }

  console.log('✅ Opening hours created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Entrées & Accompagnements',
        description: 'Pour commencer ou accompagner',
        sortOrder: 1,
        restaurantId: restaurant.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sandwichs & Naans',
        description: 'Nos spécialités signature',
        sortOrder: 2,
        restaurantId: restaurant.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Assiettes',
        description: 'Repas complets',
        sortOrder: 3,
        restaurantId: restaurant.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Burgers & Tacos',
        description: 'Classiques revisités',
        sortOrder: 4,
        restaurantId: restaurant.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Menu Enfant',
        description: 'Pour les petits gourmands',
        sortOrder: 5,
        restaurantId: restaurant.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Desserts',
        description: 'Douceurs maison',
        sortOrder: 6,
        restaurantId: restaurant.id,
      },
    }),
  ]);

  console.log('✅ Categories created');

  const [entrees, sandwichs, assiettes, burgers, enfants, desserts] = categories;

  // Entrées & Accompagnements
  await prisma.dish.create({
    data: {
      name: 'Portion Frites Maison',
      description: 'Frites fraîches avec 1 sauce au choix',
      price: 4.50,
      isAvailable: true,
      allergens: [],
      categoryId: entrees.id,
      restaurantId: restaurant.id,
      sortOrder: 1,
    },
  });

  await prisma.dish.create({
    data: {
      name: 'Barquette de Boulgour',
      description: 'Portion de boulgour maison',
      price: 6.00,
      isAvailable: true,
      allergens: ['gluten'],
      categoryId: entrees.id,
      restaurantId: restaurant.id,
      sortOrder: 2,
    },
  });

  await prisma.dish.create({
    data: {
      name: 'Barquette Kebab',
      description: 'Viande de kebab seule avec 1 sauce',
      price: 8.00,
      isAvailable: true,
      allergens: [],
      categoryId: entrees.id,
      restaurantId: restaurant.id,
      sortOrder: 3,
    },
  });

  // Sandwichs & Naans
  const menuNaan = await prisma.dish.create({
    data: {
      name: 'Menu Naan Fromage',
      description: 'Viande au choix, frites et boisson 33cl',
      price: 15.00,
      isAvailable: true,
      allergens: ['gluten', 'laitage'],
      categoryId: sandwichs.id,
      restaurantId: restaurant.id,
      sortOrder: 1,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: menuNaan.id, name: 'Viande: Kebab', price: 0, isAvailable: true },
      { dishId: menuNaan.id, name: 'Viande: Poulet', price: 0, isAvailable: true },
      { dishId: menuNaan.id, name: 'Viande: Steak', price: 0, isAvailable: true },
      { dishId: menuNaan.id, name: 'Boisson: Coca', price: 0, isAvailable: true },
      { dishId: menuNaan.id, name: 'Boisson: Fanta', price: 0, isAvailable: true },
      { dishId: menuNaan.id, name: 'Boisson: Sprite', price: 0, isAvailable: true },
    ],
  });

  const sandwichSeul = await prisma.dish.create({
    data: {
      name: 'Sandwich Seul',
      description: 'Pain et sauce au choix (à composer)',
      price: 11.90,
      isAvailable: true,
      allergens: ['gluten'],
      categoryId: sandwichs.id,
      restaurantId: restaurant.id,
      sortOrder: 2,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: sandwichSeul.id, name: 'Pain: Classique', price: 0, isAvailable: true },
      { dishId: sandwichSeul.id, name: 'Pain: Galette', price: 0, isAvailable: true },
      { dishId: sandwichSeul.id, name: 'Sauce: Blanche', price: 0, isAvailable: true },
      { dishId: sandwichSeul.id, name: 'Sauce: Harissa', price: 0, isAvailable: true },
      { dishId: sandwichSeul.id, name: 'Sauce: Ketchup', price: 0, isAvailable: true },
      { dishId: sandwichSeul.id, name: 'Supplément fromage', price: 1.50, isAvailable: true },
    ],
  });

  await prisma.dish.create({
    data: {
      name: 'Naan Fromage Seul',
      description: 'Cuit dans un four artisanal',
      price: 5.50,
      isAvailable: true,
      isVegetarian: true,
      allergens: ['gluten', 'laitage'],
      categoryId: sandwichs.id,
      restaurantId: restaurant.id,
      sortOrder: 3,
    },
  });

  // Assiettes
  const assietteKebab = await prisma.dish.create({
    data: {
      name: 'Assiette Kebab',
      description: 'Viande, crudités, frites et boulgour',
      price: 17.00,
      isAvailable: true,
      allergens: ['gluten'],
      categoryId: assiettes.id,
      restaurantId: restaurant.id,
      sortOrder: 1,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: assietteKebab.id, name: 'Viande: Kebab', price: 0, isAvailable: true },
      { dishId: assietteKebab.id, name: 'Viande: Poulet', price: 0, isAvailable: true },
      { dishId: assietteKebab.id, name: 'Viande: Steak', price: 0, isAvailable: true },
    ],
  });

  const assietteMixte = await prisma.dish.create({
    data: {
      name: 'Assiette Mixte (3 viandes)',
      description: '3 viandes au choix, frites, boulgour, pain naan',
      price: 24.50,
      isAvailable: true,
      allergens: ['gluten', 'laitage'],
      categoryId: assiettes.id,
      restaurantId: restaurant.id,
      sortOrder: 2,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: assietteMixte.id, name: 'Inclure: Kebab', price: 0, isAvailable: true },
      { dishId: assietteMixte.id, name: 'Inclure: Poulet', price: 0, isAvailable: true },
      { dishId: assietteMixte.id, name: 'Inclure: Steak', price: 0, isAvailable: true },
      { dishId: assietteMixte.id, name: 'Inclure: Adana', price: 0, isAvailable: true },
    ],
  });

  await prisma.dish.create({
    data: {
      name: 'Assiette Adana',
      description: 'Brochette de viande hachée épicée, pain naan',
      price: 19.50,
      isAvailable: true,
      isSpicy: true,
      allergens: ['gluten', 'laitage'],
      categoryId: assiettes.id,
      restaurantId: restaurant.id,
      sortOrder: 3,
    },
  });

  // Burgers & Tacos
  const menuBurger = await prisma.dish.create({
    data: {
      name: 'Menu Burger Maison',
      description: 'Steak maison, cheddar, frites et boisson 33cl',
      price: 14.90,
      isAvailable: true,
      allergens: ['gluten', 'laitage'],
      categoryId: burgers.id,
      restaurantId: restaurant.id,
      sortOrder: 1,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: menuBurger.id, name: 'Boisson: Coca', price: 0, isAvailable: true },
      { dishId: menuBurger.id, name: 'Boisson: Fanta', price: 0, isAvailable: true },
      { dishId: menuBurger.id, name: 'Supplément bacon', price: 1.50, isAvailable: true },
    ],
  });

  const tacos = await prisma.dish.create({
    data: {
      name: 'Tacos (seul)',
      description: '1 ou 2 viandes, frites et sauce fromagère',
      price: 11.50,
      isAvailable: true,
      allergens: ['gluten', 'laitage'],
      categoryId: burgers.id,
      restaurantId: restaurant.id,
      sortOrder: 2,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: tacos.id, name: '1 viande', price: 0, isAvailable: true },
      { dishId: tacos.id, name: '2 viandes', price: 3.00, isAvailable: true },
      { dishId: tacos.id, name: 'Viande: Kebab', price: 0, isAvailable: true },
      { dishId: tacos.id, name: 'Viande: Poulet', price: 0, isAvailable: true },
      { dishId: tacos.id, name: 'Viande: Steak', price: 0, isAvailable: true },
    ],
  });

  // Menu Enfant
  const menuKid = await prisma.dish.create({
    data: {
      name: 'Menu Kid',
      description: 'Kebab, nuggets ou burger + frites + Capri-Sun',
      price: 10.90,
      isAvailable: true,
      allergens: ['gluten'],
      categoryId: enfants.id,
      restaurantId: restaurant.id,
      sortOrder: 1,
    },
  });

  await prisma.dishOption.createMany({
    data: [
      { dishId: menuKid.id, name: 'Choix: Kebab', price: 0, isAvailable: true },
      { dishId: menuKid.id, name: 'Choix: Nuggets', price: 0, isAvailable: true },
      { dishId: menuKid.id, name: 'Choix: Burger', price: 0, isAvailable: true },
    ],
  });

  // Desserts
  await prisma.dish.create({
    data: {
      name: 'Tiramisu Maison',
      description: 'Fait maison',
      price: 4.50,
      isAvailable: true,
      isVegetarian: true,
      allergens: ['gluten', 'laitage', 'oeufs'],
      categoryId: desserts.id,
      restaurantId: restaurant.id,
      sortOrder: 1,
    },
  });

  console.log('✅ Dishes created');

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@saveurs-istanbul.fr',
      password: '$2b$10$YourHashedPasswordHere',
      name: 'Administrateur',
      role: 'ADMIN',
      restaurantId: restaurant.id,
    },
  });

  console.log('✅ Admin user created');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`Restaurant: ${restaurant.name}`);
  console.log(`Slug: ${restaurant.slug}`);
  console.log(`URL: http://localhost:5173/${restaurant.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
