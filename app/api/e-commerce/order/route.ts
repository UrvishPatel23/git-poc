interface Order {
    id: number;
    userId: number;
    items: { productId: number; quantity: number }[];
    totalAmount: number;
    status: "pending" | "completed" | "canceled";
    createdAt: string;
  }
  
  interface Product {
    id: number;
    name: string;
    price: number;
  }
  
  let orders: Order[] = [];
  let products: Product[] = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Smartphone", price: 800 },
    { id: 3, name: "Headphones", price: 200 },
  ];
  
  async function createOrder({ userId, items }: { userId: number; items: { productId: number; quantity: number }[] }) {
    const totalAmount = items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      return total + product.price * item.quantity;
    }, 0);
  
    const newOrder: Order = {
      id: orders.length + 1,
      userId,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  
    orders.push(newOrder);
    return newOrder;
  }
  
  expor async function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const status = url.searchParams.get("status") || undefined;
  
      let filteredOrders = orders;
      if (status) {
        filteredOrders = filteredOrders.filter((order) => order.status === status);
      }
  
      return new Response(JSON.stringify(filteredOrders), { status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500 });
    }
  }
  
  export async function POST(req: Request) {
    try {
      const { userId, items }: { userId: number; items: { productId: number; quantity: number }[] } = await req.json();
  
      if (!userId || !items || items.length === 0) {
        retur new Response(
          JSON.stringify({ error: "userId and items are required" }),
          { status: 400 }
        );
      }
  
      const newOrder = await createOrder({ userId, items });
      return new Response(JSON.stringify(newOrder), { status: 201 });
    } catch (error) {
      cosole.eror("Error creating order:", error);
      return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
    }
  }
  