import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { TransferMarketFilters } from "../../types/transfer";

interface FilterPanelProps {
  filters: TransferMarketFilters;
  onFilterChange: (key: keyof TransferMarketFilters, value: string) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  showAdvanced,
  onToggleAdvanced,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [localMinPrice, setLocalMinPrice] = useState(
    filters.minPrice?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    filters.maxPrice?.toString() || ""
  );

  const debouncedSearch = useDebounce(localSearch, 800);
  const debouncedMinPrice = useDebounce(localMinPrice, 800);
  const debouncedMaxPrice = useDebounce(localMaxPrice, 800);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange("search", debouncedSearch);
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  useEffect(() => {
    if (debouncedMinPrice !== filters.minPrice?.toString()) {
      onFilterChange("minPrice", debouncedMinPrice);
    }
  }, [debouncedMinPrice, filters.minPrice, onFilterChange]);

  useEffect(() => {
    if (debouncedMaxPrice !== filters.maxPrice?.toString()) {
      onFilterChange("maxPrice", debouncedMaxPrice);
    }
  }, [debouncedMaxPrice, filters.maxPrice, onFilterChange]);

  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice?.toString() || "");
  }, [filters.minPrice]);

  useEffect(() => {
    setLocalMaxPrice(filters.maxPrice?.toString() || "");
  }, [filters.maxPrice]);

  const handleImmediateFilterChange = useCallback(
    (key: keyof TransferMarketFilters, value: string) => {
      onFilterChange(key, value);
    },
    [onFilterChange]
  );
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            onClick={onToggleAdvanced}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={filters.position || ""}
                onChange={(e) =>
                  handleImmediateFilterChange("position", e.target.value)
                }
                title="Filter by position"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Positions</option>
                <option value="GK">Goalkeeper</option>
                <option value="DEF">Defender</option>
                <option value="MID">Midfielder</option>
                <option value="ATT">Attacker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  placeholder="Min price"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  placeholder="Max price"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
