export async function GET() {
  const categories = [
    {
      id: 1,
      name: "Sarees",
      description: "Pure silk sarees with intricate patterns",
      image: "https://images.unsplash.com/photo-1610030469668-2c8c2f2d9c6f?auto=format&fit=crop&w=800&q=80",
      slug: "sarees",
    },
    {
      id: 2,
      name: "Lehengas",
      description: "Stunning lehengas for special occasions",
      image: "https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?auto=format&fit=crop&w=800&q=80",
      slug: "lehengas",
    },
    {
      id: 3,
      name: "Kurta Sets",
      description: "Comfortable and elegant kurta sets",
      image: "https://images.unsplash.com/photo-1593032465171-8c4c6b7c2b9b?auto=format&fit=crop&w=800&q=80",
      slug: "kurta-sets",
    },
    {
      id: 4,
      name: "Dresses",
      description: "Contemporary fusion dresses for everyday wear",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      slug: "dresses",
    },
    {
      id: 5,
      name: "Co-ords",
      description: "Matching co-ord sets for a complete look",
      image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80",
      slug: "coords",
    },
    {
      id: 6,
      name: "Gowns",
      description: "Elegant gowns for evening parties",
      image: "https://images.unsplash.com/photo-1520975922203-b4f1b6e2e9c6?auto=format&fit=crop&w=800&q=80",
      slug: "gowns",
    },
    {
      id: 7,
      name: "Tops",
      description: "Versatile tops for casual and formal wear",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      slug: "tops",
    },
    {
      id: 8,
      name: "Loungewear",
      description: "Comfortable loungewear for relaxing at home",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      slug: "loungewear",
    },
  ];

  return Response.json(categories);
}