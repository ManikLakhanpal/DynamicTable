"use client";
import { Suspense } from "react";
import { DataTableContainer } from "@/components/Table";
import { Avatar } from "@mui/material";

// * Columns in table
const columns = [
  {
    key: "id",
    label: "ID",
    align: "left",
    sortable: true,
  },
  {
    key: "image",
    label: "Avatar",
    align: "center",
    render: (value, row) => (
      <Avatar src={value} alt={`${row.firstName} ${row.lastName}`} />
    ),
  },
  {
    key: "firstName",
    label: "First Name",
    align: "left",
    sortable: true,
  },
  {
    key: "lastName",
    label: "Last Name",
    align: "left",
    sortable: true,
  },
  {
    key: "birthDate",
    label: "DOB",
    align: "left",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    align: "left",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    align: "right",
    sortable: true,
  },
  {
    key: "gender",
    label: "Gender",
    align: "center",
  },
];

// * Filters that we want
const filterConfig = {
  searchEnabled: true,
  searchPlaceholder: "Search users...",
  dateRangeEnabled: true,
  dropdownEnabled: true,
  dropdownLabel: "Gender",
  dropdownOptions: [
    { value: "", label: "All" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ],
};

// * Function to fetch the data
const fetchUsers = async (params) => {
  try {
    const { page, limit, search, order, dropdown, sort, startDate, endDate } =
      params;

    const baseUrl = search
      ? `https://dummyjson.com/users/search?q=${search}&page=${page}`
      : `https://dummyjson.com/users?limit=1000`;

    const response = await fetch(baseUrl);
    const result = await response.json();

    // * All users
    let filteredData = result.users || [];

    // * DOB Filter
    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();

      filteredData = filteredData.filter((user) => {
        const userBirthDate = new Date(user.birthDate).getTime();
        return userBirthDate >= startDateTime && userBirthDate <= endDateTime;
      });
    } else if (startDate) {
      const startDateTime = new Date(startDate).getTime();
      filteredData = filteredData.filter((user) => {
        const userBirthDate = new Date(user.birthDate).getTime();
        return userBirthDate >= startDateTime;
      });
    } else if (endDate) {
      const endDateTime = new Date(endDate).getTime();
      filteredData = filteredData.filter((user) => {
        const userBirthDate = new Date(user.birthDate).getTime();
        return userBirthDate <= endDateTime;
      });
    }

    // * Date ke Filters
    if (startDate || endDate) {
      filteredData = filteredData.filter((user) => {
        const userDate = new Date(user.birthDate).getTime();
        const startTime = startDate ? new Date(startDate).getTime() : -Infinity;
        const endTime = endDate ? new Date(endDate).getTime() : Infinity;
        return userDate >= startTime && userDate <= endTime;
      });
    }

    // * Gender filter
    if (dropdown) {
      filteredData = filteredData.filter(
        (user) => user.gender.toLowerCase() === dropdown.toLowerCase()
      );
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
    console.error("Error fetching users:", error);
    return { data: [], totalCount: 0 };
  }
};

export default function UsersPage() {
  return (
    <Suspense>
      <DataTableContainer
        title="Users Directory"
        columns={columns}
        fetchData={fetchUsers}
        filterConfig={filterConfig}
        defaultSortConfig={{ key: "id", direction: "asc" }}
        defaultRowsPerPage={10}
        defaultFilterValues={{
          activeTab: "all",
          dropdown: "",
        }}
      />
    </Suspense>
  );
}
