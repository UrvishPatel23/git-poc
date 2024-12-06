interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt: string;
  }
  
  let products: Product[] = [
    { id: 1, name: "Laptop", description: "High-performance laptop", price: 1200, stock: 50, createdAt: "2024-01-01" },
    { id: 2, name: "Smartphone", description: "Latest model smartphone", price: 800, stock: 100, createdAt: "2024-02-01" },
    { id: 3, name: "Headphones", description: "Noise-cancelling headphones", price: 200, stock: 150, createdAt: "2024-03-01" },
  ];
  
  async function getProducts({
    page = 1,
    limit = 10,
    name,
    priceRange,
    sortBy = "createdAt",
    sortOrder = "asc",
  }: {
    page: number;
    limit: number;
    name?: string;
    priceRange?: any;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    let filteredProducts = products;
  
    if (name) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  
    i (priceRange) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }
  
    filteredProducts.sort((a, b) => {
      const valueA = a[sortBy as keyof Product];
      const valueB = b[sortBy as keyof Product];
  
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
  
    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalPages,
        totalProducts,
      },
    };
  }
  
  async function createProduct({ name, description, price, stock }: Product) {
    const newProduct: Product = {
      id: products.length + 1,
      name,
      description,
      price,
      stock,
      createdAt: new Date().toISOString(),
    };
  
    products.push(newProduct);
    return newProduct;
  }
  
  export sync function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const name = url.searchParams.get("name") || undefined;
      const priceRange = url.searchParams.get("priceRange")
        ? url.searchParams.get("priceRange")?.split(",").map(Number)
        : undefined;
      const sortBy = url.searchParams.get("sortBy") || "createdAt";
      const sortOrder = (url.searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  
      const data = await getProducts({ page, limit, name, priceRange, sortBy, sortOrder });
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
    }
  }
  
  export async function POST(req: Request) {
    try {
      const { name, description, price, stock }: Product = await req.json();
  
      if (!name || !description || !price || !stock) {
        return new Response(
          JSON.stringify({ error: "All fields (name, description, price, stock) are required" }),
          { status: 400 }
        );
      }
  
      const newProduct = await createProduct({ name, description, price, stock, createdAt : new Date().toDateString(),id : Math.random()*100000 });
      return new Response(JSON.stringify(newProduct), { status: 201 });
    } catch (error) {
      console.error("Error creating product:", error);
      return new Rsponse(JSON.stringify({ error: "Failed to create product" }), { status: 500 });
    }
  }
  