import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { TransferMarketFilters } from "../../types/transfer";

interface FilterPanelProps {
  filters: TransferMarketFilters;
  onFilterChange: (key: keyof TransferMarketFilters, value: string) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

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
    if (debouncedSearch.trim().length >= 2 || debouncedSearch.trim() === "") {
      onFilterChange("search", debouncedSearch);
    }
  }, [debouncedSearch, onFilterChange]);

  useEffect(() => {
    if (
      debouncedMinPrice === "" ||
      (!isNaN(Number(debouncedMinPrice)) && Number(debouncedMinPrice) >= 0)
    ) {
      onFilterChange("minPrice", debouncedMinPrice);
    }
  }, [debouncedMinPrice, onFilterChange]);

  useEffect(() => {
    if (
      debouncedMaxPrice === "" ||
      (!isNaN(Number(debouncedMaxPrice)) && Number(debouncedMaxPrice) >= 0)
    ) {
      onFilterChange("maxPrice", debouncedMaxPrice);
    }
  }, [debouncedMaxPrice, onFilterChange]);

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search players or teams..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Search by player name or team
            </p>
          </div>

          <button
            onClick={onToggleAdvanced}
            className="flex items-center justify-center gap-2 h-11 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <Filter className="h-4 w-4" />
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
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-colors bg-white text-sm"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
