
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
import { addTrans, connect, exportData } from "@/lib/flow"
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
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"


const FormSchema = z.object({
  dob: z.date({
    required_error: "A time is required.",
  }),
})

export default function DashboardPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [amount, setAmount] = React.useState<string>("")
  const [title, setTitle] = React.useState<string>("")
  const [source, setSource] = React.useState<string>("")
  const [type, setType] = React.useState<string>("")

  return (
    <>
      <br style={{ lineHeight: '0.5' }} />
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger>
                  <Button>Add Transaction</Button>
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
                          placeholder="$500.00"
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
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                              Please fill out all fields
                            </pre>
                          ),
                        })
                        return
                      }
                      addTrans(date, amount, title, source, type == "deposit" ? true : false)

                      toast({
                        title: "Added transaction",
                        description: (
                          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            {title}: {amount} {type == "deposit" ? "deposited" : "withdrawn"} on {date.toDateString()} in {source} 
                          </pre>
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
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      No comparison
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 purchases</div>
                    <p className="text-xs text-muted-foreground">
                      No comparison
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 earnings</div>
                    <p className="text-xs text-muted-foreground">
                      No comparison
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
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last year
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 purchases</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last year
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 earnings</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last year
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
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 purchases</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 earnings</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
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
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last week
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 purchases</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last week
                    </p>
                    <br />
                    <div className="text-2xl font-bold">500 earnings</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last week
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Earnings</CardTitle>
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
