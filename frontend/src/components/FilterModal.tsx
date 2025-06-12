"use client"

import type React from "react"
import { useState } from "react"
import { X, Filter, Star } from "lucide-react"
import type { FilterOptions } from "../types"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filters: FilterOptions) => void
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilter }) => {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [importance, setImportance] = useState<"all" | "important" | "normal">("all")
  const [keywords, setKeywords] = useState("")

  if (!isOpen) return null

  const handleApply = () => {
    const filters: FilterOptions = {
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      importance,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    }
    onApplyFilter(filters)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Filter</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Importance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message Importance
            </label>
            <div className="space-y-2">
              {[
                { value: "all", label: "All Messages" },
                { value: "important", label: "Important Only" },
                { value: "normal", label: "Normal Only" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="importance"
                    value={option.value}
                    checked={importance === option.value}
                    onChange={(e) => setImportance(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  {option.value === "important" && <Star className="w-4 h-4 text-yellow-400 ml-1" />}
                </label>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="meeting, maintenance, urgent"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal