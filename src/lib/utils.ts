import { clsx, type ClassValue } from "clsx"
import exp from "constants"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function saveJSON(key: string, table: []){
  const json: string = JSON.stringify(table)
  localStorage.setItem(key, json)
}

export function loadJSON(key: string){
  const json: string = localStorage.getItem(key) || "[]"
  return JSON.parse(json)
}