export function RecentSales() {
  const testData = [
    {
      date: "2021-01-01",
      title: "Bought 1 BTC",
      price: "$45,231.89",
      positive: false,
    },
  ]
  return (
    <div className="space-y-8">
      {testData.map((item) => (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.date}
            </p>
          </div>
          <div className="ml-auto font-medium"><p style={/*{ color: item.positive ? "#adfa1d" : "#E65B63" }*/{}}>{item.positive ? "+" : "-"}{item.price}</p></div>
        </div>
      ))}
    </div>
  )
}
