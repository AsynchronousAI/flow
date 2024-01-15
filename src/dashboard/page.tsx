
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Overview } from "@/dashboard/components/overview"
import { RecentSales } from "@/dashboard/components/recent-sales"
import { addTrans, connect, exportData, getTrans } from "@/lib/flow"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, set } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const FormSchema = z.object({
  dob: z.date({
    required_error: "A time is required.",
  }),
})

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}


export default function DashboardPage() {
  const [date, setDate] = React.useState<Date>()
  const [amount, setAmount] = React.useState<string>("")
  const [title, setTitle] = React.useState<string>("")
  const [source, setSource] = React.useState<string>("")
  const [type, setType] = React.useState<string>("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  var totalThisWeek = 0
  var totalThisMonth = 0
  var totalThisYear = 0
  var totalAllTime = 0
  var totalDeposits = 0
  var totalWithdrawals = 0
  var monthWithdrawals = 0
  var monthDeposits = 0
  var yearWithdrawals = 0
  var yearDeposits = 0
  var weekWithdrawals = 0
  var weekDeposits = 0
  var totalWithdrawalValue = 0
  var totalYearWithdrawalValue = 0
  var totalMonthWithdrawalValue = 0
  var totalWeekWithdrawalValue = 0
  var averageDeposit = 0
  var averageYearDeposit = 0
  var averageMonthDeposit = 0
  var averageWeekDeposit = 0
  var yearIncrease = -0
  var monthIncrease = -0
  var weekIncrease = -0

  var lastYearAlltime = 0
  var lastMonthAlltime = 0
  var lastWeekAlltime = 0

  const [rerender, setRerender] = React.useState("")

  const data = getTrans();

  data.map((item: any) => {
    const year = new Date(parseInt(item.date.replace(/,/g, ''))).getFullYear()
    const month = new Date(parseInt(item.date.replace(/,/g, ''))).getMonth()
    const week = getWeekNumber(new Date(parseInt(item.date.replace(/,/g, ''))))[1]

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentWeek = getWeekNumber(new Date())[1]

    totalAllTime += item.positive ? item.amount : -item.amount
    totalDeposits += item.positive ? 1 : 0
    totalWithdrawals += item.positive ? 0 : 1
    averageDeposit = totalAllTime / totalDeposits
    totalWithdrawalValue += item.positive ? 0 : item.amount

    if (year == currentYear - 1) {
      lastYearAlltime += item.positive ? item.amount : -item.amount
    }
    if (month == currentMonth - 1) {
      lastMonthAlltime += item.positive ? item.amount : -item.amount
    }
    if (week == currentWeek - 1) {
      lastWeekAlltime += item.positive ? item.amount : -item.amount
    }

    if (year == currentYear) {
      totalThisYear += item.positive ? item.amount : -item.amount
      yearDeposits += item.positive ? 1 : 0
      yearWithdrawals += item.positive ? 0 : 1
      averageYearDeposit = totalThisYear / yearDeposits
      totalYearWithdrawalValue += item.positive ? 0 : item.amount
      yearIncrease = (((totalThisYear - lastYearAlltime) / lastYearAlltime) * 100)
    }

    if (month == currentMonth) {
      totalThisMonth += item.positive ? item.amount : -item.amount
      monthDeposits += item.positive ? 1 : 0
      monthWithdrawals += item.positive ? 0 : 1
      averageMonthDeposit = totalThisMonth / monthDeposits
      totalMonthWithdrawalValue += item.positive ? 0 : item.amount
      monthIncrease = (((totalThisMonth - lastMonthAlltime) / lastMonthAlltime) * 100)
    }

    if (week == currentWeek) {
      totalThisWeek += item.positive ? item.amount : -item.amount
      weekDeposits += item.positive ? 1 : 0
      weekWithdrawals += item.positive ? 0 : 1
      averageWeekDeposit = totalThisWeek / weekDeposits
      totalWeekWithdrawalValue += item.positive ? 0 : item.amount
      weekIncrease = (((totalThisWeek - lastWeekAlltime) / lastWeekAlltime) * 100)
    }

    if (averageDeposit == Infinity || isNaN(averageDeposit) || averageDeposit == -Infinity) {
      averageDeposit = 0
    }
    if (averageYearDeposit == Infinity || isNaN(averageYearDeposit) || averageYearDeposit == -Infinity) {
      averageYearDeposit = 0
    }
    if (averageMonthDeposit == Infinity || isNaN(averageMonthDeposit) || averageMonthDeposit == -Infinity) {
      averageMonthDeposit = 0
    }
    if (averageWeekDeposit == Infinity || isNaN(averageWeekDeposit) || averageWeekDeposit == -Infinity) {
      averageWeekDeposit = 0
    }
    if (yearIncrease == Infinity || isNaN(yearIncrease) || yearIncrease == -Infinity) {
      yearIncrease = 0
    }
    if (monthIncrease == Infinity || isNaN(monthIncrease) || monthIncrease == -Infinity) {
      monthIncrease = 0
    }
    if (weekIncrease == Infinity || isNaN(weekIncrease) || weekIncrease == -Infinity) {
      weekIncrease = 0
    }

    //setRerender("")
  })

  return (
    <>
      {rerender}
      <br style={{ lineHeight: '0.5' }} />
      <Toaster />
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl  tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Popover open={isPopoverOpen}>
                <PopoverTrigger>
                  <Button onClick={() => {
                    setIsPopoverOpen(!isPopoverOpen);
                  }}>Add Transaction</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Add transaction</h4>
                      <p className="text-sm text-muted-foreground">
                        Add a new transaction to your account
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          placeholder="500.00"
                          className="col-span-2 h-8"
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="amount">Title</Label>
                        <Input
                          id="title"
                          placeholder="Job"
                          className="col-span-2 h-8"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="type">Type</Label>
                        <Select
                        onValueChange={(value) => setType(value)}
                        >
                          <SelectTrigger className="col-span-2 h-8">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="deposit">Deposit</SelectItem>
                              <SelectItem value="withdrawal">Withdrawal</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="height">Account</Label>
                        <Input
                          id="height"
                          placeholder="Paypal"
                          className="col-span-2 h-8"
                          onChange={(e) => setSource(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxHeight">Time</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="col-span-2 h-8"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => {
                      if (!date || !amount || !title || !source || !type || amount == "" || title == "" || source == "" || type == ""){
                        toast({
                          title: "Missing fields",
                          description: (
                            <p>Please fill out all fields</p>
                          ),
                        })
                        return
                      }
                      closePopover()
                      addTrans(date.getTime(), parseInt(amount), title, source, type == "deposit" ? true : false)

                      toast({
                        title: "Added transaction",
                        description: (
                          <p>
                            ${amount} {type == "deposit" ? "deposited" : "withdrawn"} on {date.toDateString()} in {source} from '{title}'
                          </p>
                        ),
                      })
                    }}>Add</Button>
                  </div>
                </PopoverContent>
              </Popover>
              {/*<Button onClick={exportData} variant="secondary">Export</Button>
              <Button onClick={connect} variant="secondary">Connect</Button>*/}
            </div>
          </div>
         
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      All-time
                    </CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">${totalAllTime}</div>
                    <p className="text-xs text-muted-foreground">
                      No comparison
                    </p>
                    <br />
                    <div className="text-2xl">{totalDeposits} deposits</div>
                    <p className="text-xs text-muted-foreground">
                      Average of ${averageDeposit} per deposit
                    </p>
                    <br />
                    <div className="text-2xl">{totalWithdrawals} withdrawels</div>
                    <p className="text-xs text-muted-foreground">
                      ${totalWithdrawalValue} withdrawn in total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      This year
                    </CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">${totalThisYear}</div>
                    <p className="text-xs text-muted-foreground">
                      {yearIncrease}% from last year
                    </p>
                    <br />
                    <div className="text-2xl">{yearDeposits} deposits</div>
                    <p className="text-xs text-muted-foreground">
                    Average of ${averageYearDeposit} per deposit
                    </p>
                    <br />
                    <div className="text-2xl">{yearWithdrawals} withdrawels</div>
                    <p className="text-xs text-muted-foreground">
                      ${totalYearWithdrawalValue} withdrawn in total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      This month
                    </CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">${totalThisMonth}</div>
                    <p className="text-xs text-muted-foreground">
                      {monthIncrease}% from last month
                    </p>
                    <br />
                    <div className="text-2xl">{monthDeposits} deposits</div>
                    <p className="text-xs text-muted-foreground">
                    Average of ${averageMonthDeposit} per deposit
                    </p>
                    <br />
                    <div className="text-2xl">{monthWithdrawals} withdrawels</div>
                    <p className="text-xs text-muted-foreground">
                    ${totalMonthWithdrawalValue} withdrawn in total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      This week
                    </CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">${totalThisWeek}</div>
                    <p className="text-xs text-muted-foreground">
                      {weekIncrease}% from last week
                    </p>
                    <br />
                    <div className="text-2xl">{weekDeposits} deposits</div>
                    <p className="text-xs text-muted-foreground">
                    Average of ${averageWeekDeposit} per deposit
                    </p>
                    <br />
                    <div className="text-2xl">{weekWithdrawals} withdrawels</div>
                    <p className="text-xs text-muted-foreground">
                    ${totalWeekWithdrawalValue} withdrawn in total
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Does not show withdrawels</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
        </div>
      </div>
    </>
  )
}
