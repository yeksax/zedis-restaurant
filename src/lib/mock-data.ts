import { MenuType } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/pt_BR";

const mockImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  "https://images.unsplash.com/photo-1565299585577-e4e1dd8ac5b3",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929",
];

const mockMainCourses = [
  "Filé à Parmegiana",
  "Salmão Grelhado",
  "Risoto de Funghi",
  "Picanha na Brasa",
  "Fettuccine Alfredo",
  "Moqueca de Peixe",
  "Strogonoff de Frango",
  "Costela no Bafo",
];

const mockDesserts = [
  "Pudim de Leite",
  "Mousse de Chocolate",
  "Cheesecake de Morango",
  "Tiramisu",
  "Petit Gateau",
  "Pavlova",
  "Crème Brûlée",
  "Torta de Limão",
];

const mockWines = [
  "Cabernet Sauvignon",
  "Merlot",
  "Pinot Noir",
  "Chardonnay",
  "Sauvignon Blanc",
  "Malbec",
  "Carménère",
  "Syrah",
];

const mockCocktails = [
  "Mojito",
  "Caipirinha",
  "Margarita",
  "Cosmopolitan",
  "Moscow Mule",
  "Negroni",
  "Gin Tônica",
  "Aperol Spritz",
];

export function generateRandomMenuItem(categoryId: string, type: MenuType) {
  const isWine = type === MenuType.WINE;
  const isCocktail = type === MenuType.COCKTAILS;
  const isDessert = type === MenuType.DESSERTS;

  let name = "";
  if (isWine) {
    name = faker.helpers.arrayElement(mockWines);
  } else if (isCocktail) {
    name = faker.helpers.arrayElement(mockCocktails);
  } else if (isDessert) {
    name = faker.helpers.arrayElement(mockDesserts);
  } else {
    name = faker.helpers.arrayElement(mockMainCourses);
  }

  const baseItem = {
    name,
    description: faker.lorem.paragraph(),
    price: Number(faker.commerce.price({ min: 20, max: 200 })),
    image: faker.helpers.arrayElement(mockImages),
    available: faker.datatype.boolean({ probability: 0.8 }),
    featured: faker.datatype.boolean({ probability: 0.2 }),
    isSpicy: faker.datatype.boolean({ probability: 0.3 }),
    isVegetarian: faker.datatype.boolean({ probability: 0.3 }),
    isVegan: faker.datatype.boolean({ probability: 0.2 }),
    glutenFree: faker.datatype.boolean({ probability: 0.3 }),
    preparationTime: faker.number.int({ min: 10, max: 60 }),
    ingredients: faker.lorem.words({ min: 3, max: 8 }),
    allergens: faker.lorem.words({ min: 1, max: 4 }),
    categoryId,
  };

  if (isWine) {
    return {
      ...baseItem,
      wineRegion: faker.location.country(),
      wineVintage: faker.number.int({ min: 1990, max: 2020 }),
      wineGrapes: faker.lorem.words({ min: 1, max: 3 }),
    };
  }

  if (isCocktail) {
    return {
      ...baseItem,
      baseSpirit: faker.lorem.word(),
      glassType: faker.lorem.word(),
    };
  }

  return baseItem;
} 