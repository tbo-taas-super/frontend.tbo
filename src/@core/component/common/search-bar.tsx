"use client"

import { TextField, InputAdornment } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  width?: number | string
}

export function SearchBar({ placeholder, value, onChange, width = 300 }: SearchBarProps) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ width: { xs: "100%", sm: width } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "text.secondary" }} />
          </InputAdornment>
        ),
      }}
    />
  )
}
