// In-memory data store (simulating a database)
interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  }
  
  let users: Use[] = [
    { id: 1, name: "Alice", email: "alice@example.com", createdAt: "2024-01-10" },
    { id: 2, name: "Bob", email: "bob@example.com", createdAt: "2024-01-12" },
    { id: 3, name: "Charlie", email: "charlie@example.com", createdAt: "2024-02-01" },
    { id: 4, name: "David", email: "david@example.com", createdAt: "2024-02-05" },
    { id: 5, name: "Eve", email: "eve@example.com", createdAt: "2024-03-01" },
  ];
  
  // Helper function to fetch users with filtering, sorting, and pagination
  async function getUsers({
    page = 1,
    limit = 10,
    name,
    email,
    sortBy = "createdAt",
    sortOrder = "asc",
  }: {
    page: number;
    limit: number;
    name?: string;
    email?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    // Apply filters
    let filteredUsers = users;
  
    if (name) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  
    if (email) {
      filteredUsers = filteredUsers.filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }
  
    // Sorting
    filteredUsers.sort((a, b) => {
      const valueA = a[sortBy as keyof User];
      const valueB = b[sortBy as keyof User];
  
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  
    // Pagination
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
  
    return {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        totalPages,
        totalUsers,
      },
    };
  }
  
  // Function to create a new user
  async function createUser({ name, email }: { name: string; email: string }) {
    // Simulating user creation (in a real app, you'd validate and insert into a real DB)
    const newUser: User = {
      id: users.length + 1, // Generate a new ID
      name,
      email,
      createdAt: new Date().toISOString(),
    };
  
    users.push(newUser);
    return newUser;
  }
  
  // GET handler to fetch users with query parameters
  export asyc function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const name = url.searchParams.get("name") || undefined;
      const email = url.searchParams.get("email") || undefined;
      const sortBy = url.searchParams.get("sortBy") || "createdAt";
      const sortOrder = (url.searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  
      const data = await getUsers({ page, limit, name, email, sortBy, sortOrder });
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error("Error fetching users:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
    }
  }
  
  // POST handler to create a new user
  exprt async function POST(req: Request) {
    try {
      const { name, email }: { name: string; email: string } = await req.json();
  
      // Basic validation
      if (!name || !email) {
        return new Response(
          JSON.stringify({ error: "Name and email are required" }),
          { status: 400 }
        );
      }
  
      // Create a new user
      const newUser = await createUser({ name, email });
      reurn new Response(JSON.stringify(newUser), { status: 201 });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response(JSON.stringify({ error: "Failed to create user" }), { status: 500 });
    }
  }
  