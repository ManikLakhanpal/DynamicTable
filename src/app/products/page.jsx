"use client";

import { Suspense } from "react";
import { DataTableContainer } from "@/components/Table";
import { Chip, Rating, Box } from "@mui/material";
import Image from "next/image";

// * Columns in table
const columns = [
  {
    key: "id",
    label: "ID",
    align: "left",
    sortable: true,
  },
  {
    key: "thumbnail",
    label: "Image",
    align: "center",
    render: (value, row) => (
      <Box
        sx={{ width: 60, height: 60, position: "relative", margin: "0 auto" }}
      >
        <Image
          src={value}
          alt={row.title}
          fill
          style={{ objectFit: "contain" }}
        />
      </Box>
    ),
  },
  {
    key: "title",
    label: "Name",
    align: "left",
    sortable: true,
  },
  {
    key: "brand",
    label: "Brand",
    align: "left",
    sortable: true,
  },
  {
    key: "category",
    label: "Category",
    align: "left",
    sortable: true,
  },
  {
    key: "price",
    label: "Price",
    align: "right",
    sortable: true,
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: "discountPercentage",
    label: "Discount",
    align: "right",
    sortable: true,
    render: (value) => `${value}%`,
  },
  {
    key: "rating",
    label: "Rating",
    align: "center",
    sortable: true,
    render: (value) => (
      <Rating value={value} precision={0.5} readOnly size="small" />
    ),
  },
  {
    key: "stock",
    label: "Stock",
    align: "right",
    sortable: true,
    render: (value) => (
      <Chip
        label={
          value > 50 ? "In Stock" : value > 0 ? "Low Stock" : "Out of Stock"
        }
        color={value > 50 ? "success" : value > 0 ? "warning" : "error"}
        size="small"
      />
    ),
  },
];

// * Filters that we want
const filterConfig = {
  searchEnabled: true,
  searchPlaceholder: "Search products...",
  tabsEnabled: true,
  tabOptions: [
    { value: "all", label: "All Products" },
    { value: "inStock", label: "In Stock" },
    { value: "lowStock", label: "Low Stock" },
    { value: "outOfStock", label: "Out of Stock" },
  ],
  dropdownEnabled: true,
  dropdownLabel: "Category",
  dropdownOptions: [
    { value: "", label: "All Categories" },
    { value: "beauty", label: "Beauty" },
    { value: "fragrances", label: "Fragrances" },
    { value: "groceries", label: "Groceries" },
  ],
  multiSelectEnabled: true,
  multiSelectLabel: "Brands",
  multiSelectOptions: [
    { value: "Essence", label: "Essence" },
    { value: "Glamour Beauty", label: "Glamour Beauty" },
    { value: "Annibale Colombo", label: "Annibale Colombo" },
    { value: "Dior", label: "Dior" },
  ],
};

// * Function to fetch the data
const fetchProducts = async (params) => {
  try {
    const {
      activeTab,
      search,
      dropdown,
      multiSelect,
      sort,
      order,
      page,
      limit,
    } = params;

    const baseUrl = search
      ? `https://dummyjson.com/products/search?q=${search}&page=${page}`
      : `https://dummyjson.com/products?limit=1000`; // fetch all

    const response = await fetch(baseUrl);
    const result = await response.json();
    let filteredData = result.products || [];

    // * Stock filtering
    if (activeTab === "inStock") {
      filteredData = filteredData.filter((p) => {
        return p.stock > 50;
      });
    } else if (activeTab === "lowStock") {
      filteredData = filteredData.filter((p) => {
        return p.stock > 0 && p.stock <= 50;
      });
    } else if (activeTab === "outOfStock") {
      filteredData = filteredData.filter((p) => {
        return p.stock === 0;
      });
    }

    // * Category filter
    if (dropdown) {
      filteredData = filteredData.filter((p) => {
        return p.category.toLowerCase() === dropdown.toLowerCase();
      });
    }

    // * Brand filter
    if (multiSelect && multiSelect.length > 0) {
      filteredData = filteredData.filter((p) => {
        return multiSelect.includes(p.brand);
      });
    }

    // * Sorting
    if (sort) {
      filteredData.sort((a, b) => {
        if (order === "asc") {
          return a[sort] > b[sort] ? 1 : -1;
        }
        return a[sort] < b[sort] ? 1 : -1;
      });
    }

    // * Pagination
    const start = page * limit;
    const paginatedData = filteredData.slice(start, start + limit);

    return {
      data: paginatedData,
      totalCount: filteredData.length,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], totalCount: 0 };
  }
};

export default function ProductsPage() {
  return (
    <Suspense>
      <DataTableContainer
        title="Products Catalog"
        columns={columns}
        fetchData={fetchProducts}
        filterConfig={filterConfig}
        defaultSortConfig={{ key: "id", direction: "asc" }}
        defaultRowsPerPage={10}
        defaultFilterValues={{
          activeTab: "all",
          dropdown: "",
          multiSelect: [],
        }}
      />
    </Suspense>
  );
}
