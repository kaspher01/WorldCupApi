interface FilterOption {
  field: string;
  value: string;
}

interface SortOption {
  field: string;
  ascending: boolean;
}

interface PaginationOption {
  page: number;
  per_page: number;
}

export function filterData(data: any[], filters: FilterOption[]) {
  return data.filter((item) => {
    return filters.every((filter) => {
      const value = item[filter.field];
      if (typeof value === "number") {
        return value === Number(filter.value);
      }
      return value.toLowerCase().includes(filter.value.toLowerCase());
    });
  });
}

export function sortData(data: any[], sort: SortOption) {
  return [...data].sort((a, b) => {
    const valueA = a[sort.field];
    const valueB = b[sort.field];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sort.ascending ? valueA - valueB : valueB - valueA;
    }

    const compareResult = valueA.localeCompare(valueB);
    return sort.ascending ? compareResult : -compareResult;
  });
}

export function paginateData(data: any[], pagination: PaginationOption) {
  const startIndex = (pagination.page - 1) * pagination.per_page;
  const endIndex = startIndex + pagination.per_page;

  return {
    items: data.slice(startIndex, endIndex),
    totalCount: data.length,
  };
}
