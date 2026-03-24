"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ Types
type Product = {
  id: number;
  title: string;
};

type ProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

// ✅ API function
const fetchProducts = async (page: number): Promise<ProductResponse> => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const res = await axios.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
  );

  return res.data;
};

export default function Properties() {
  // Page state is created
  const [page, setPage] = useState(1);
  

  // useQuery runs
  const { data, isLoading, error, isFetching } = useQuery<ProductResponse>({

//  dynamic cache per page
    queryKey: ["products", page],
     

    queryFn: () => fetchProducts(page),

    
    // ✅ Placeholder data
    placeholderData: (prev) => prev,
  });

  
  const totalPages = Math.ceil((data?.total || 0) / 10);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error loading products</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products - Page {page}</h1>

      {data?.products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
        </div>
      ))}

      {/* ✅ Pagination Controls */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          ⬅ Prev
        </button>

        <button
            onClick={() => setPage((prev) => prev + 1)}
  disabled={page >= totalPages}
          style={{ marginLeft: "10px" }}
        >
          Next ➡
        </button>
      </div>

      {/* ✅ Background loading indicator */}
      {isFetching && <p>Loading new page...</p>}
    </div>
  );
}
