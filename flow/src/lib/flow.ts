import { saveJSON, loadJSON } from "./utils";

export function addTrans(date, amount: string, title: string, pos: boolean) {
    let table = loadJSON("transactions")
    table.push({
      date: date.toLocaleString(),
      amount: amount,
      title: title,
      positive: pos,
    })

    saveJSON("transactions", table)
}
export function getTrans() {
    return loadJSON("transactions")
}
export function connect() {
  
}
export function exportData() {
  
}