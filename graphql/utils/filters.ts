interface StringFilter {
  eq?: string;
  contains?: string;
  ne?: string;
  notContains?: string;
}

interface NumberFilter {
  eq?: number;
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
}

interface Filter {
  [key: string]: StringFilter | NumberFilter | any;
}

export const applyFilters = (data: any[], filters: Filter) => {
  return data.filter((item) => {
    return Object.entries(filters).every(([field, filter]) => {
      if (!filter) return true;

      const value = item[field];
      if (value === undefined) return true;

      // String filters
      if (typeof value === "string") {
        if (filter.eq !== undefined) {
          return value === filter.eq;
        }
        if (filter.contains !== undefined) {
          return value.toLowerCase().includes(filter.contains.toLowerCase());
        }
        if (filter.ne !== undefined) {
          return value !== filter.ne;
        }
        if (filter.notContains !== undefined) {
          return !value
            .toLowerCase()
            .includes(filter.notContains.toLowerCase());
        }
      }

      // Number filters
      if (typeof value === "number") {
        if (filter.eq !== undefined) {
          return value === filter.eq;
        }
        if (filter.gt !== undefined) {
          return value > filter.gt;
        }
        if (filter.lt !== undefined) {
          return value < filter.lt;
        }
        if (filter.gte !== undefined) {
          return value >= filter.gte;
        }
        if (filter.lte !== undefined) {
          return value <= filter.lte;
        }
      }

      return true;
    });
  });
};
