"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getTrans } from "@/lib/flow"

function abbreviateNumber(value: any) {
  let newValue = value;
  if (value >= 1000) {
    const suffixes = ["", "k", "m", "b","t"];
    const suffixNum = Math.floor(("" + value).length / 3);
    let shortValue: any = '';
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"]
export function Overview() {
  const numData = getTrans();
  var preData: any = []
  var data = [
    { name: months[0], total: 0 },
    { name: months[1], total: 0 },
    { name: months[2], total: 0 },
    { name: months[3], total: 0 },
    { name: months[4], total: 0 },
    { name: months[5], total: 0 },
    { name: months[6], total: 0 },
    { name: months[7], total: 0 },
    { name: months[8], total: 0 },
    { name: months[9], total: 0 },
    { name: months[10], total: 0 },
    { name: months[11], total: 0 },
  ]
    

  numData.forEach((item: any) => {
    if (item.positive) {
      const year = new Date(parseInt(item.date.replace(/,/g, ''))).getFullYear()
      const monthNum = new Date(parseInt(item.date.replace(/,/g, ''))).getMonth()
      const month = months[monthNum];
      if (year == new Date().getFullYear()) { // TODO: add withdraws
        preData.push({ name: month, total: item.positive ? item.amount : -item.amount })
      }
    }
  })

  preData.forEach((item: any) => {
    var found = false
    data.forEach((item2: any) => {
      if (item2.name == item.name) {
        item2.total += item.total
        found = true
      }
    })

    if (!found) {
      data.push(item)
    }
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${abbreviateNumber(value)}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
