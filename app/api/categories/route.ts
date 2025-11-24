export async function GET() {
  const categories = [
    {
      id: 1,
      name: "Silk Sarees",
      description: "Pure silk sarees with intricate patterns",
      image: "/elegant-silk-saree-texture.jpg",
      slug: "silk-sarees",
    },
    {
      id: 2,
      name: "Cotton Sarees",
      description: "Comfortable and breathable cotton sarees",
      image: "/cotton-saree-traditional-weave.jpg",
      slug: "cotton-sarees",
    },
    {
      id: 3,
      name: "Designer Sarees",
      description: "Contemporary designs with traditional touch",
      image: "/designer-saree-modern-luxury.jpg",
      slug: "designer-sarees",
    },
    {
      id: 4,
      name: "Bridal Sarees",
      description: "Stunning sarees for your special day",
      image: "/bridal-saree-wedding-gold-embroidery.jpg",
      slug: "bridal-sarees",
    },
  ]

  return Response.json(categories)
}
