"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getTrans } from "@/lib/flow"

function abbreviateNumber(value) {
  let newValue = value;
  if (value >= 1000) {
    const suffixes = ["", "k", "m", "b","t"];
    const suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = '';
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

export function Overview() {
  const numData = getTrans();
  var preData = []
  var data = []

  numData.forEach((item: any) => {
    if (item.positive) {
      const year = new Date(parseInt(item.date.replace(/,/g, ''))).getFullYear()
      const monthNum = new Date(parseInt(item.date.replace(/,/g, ''))).getMonth()
      const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthNum];

      if (year == new Date().getFullYear()) { // TODO: add withdraws
        console.log(item.positive, item.amount)
        preData.push({ name: month, total: item.amount * (item.positive ? 1 : -1) })
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
