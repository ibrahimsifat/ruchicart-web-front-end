import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PenLine } from "lucide-react"

interface PersonalDetailsProps {
  user: {
    name: string
    phone: string
    email: string
  }
}

export function PersonalDetails({ user }: PersonalDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Details</CardTitle>
        <Button variant="outline" size="sm" className="gap-2">
          <PenLine className="h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">User Name</div>
            <div>{user.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Phone</div>
            <div>{user.phone}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Email</div>
          <div>{user.email}</div>
        </div>
      </CardContent>
    </Card>
  )
}

