import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Avatar } from '@enorae/ui'
import { getAllUsers } from './dal/users.queries'
import { Eye, Edit, Ban, UserCheck } from 'lucide-react'

export async function AdminUsersList() {
  const users = await getAllUsers()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all platform users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {users.length} users registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <span className="text-sm">
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </span>
                      </Avatar>
                      <span>{user.full_name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      user.role === 'admin' ? 'destructive' :
                      user.role === 'business' ? 'default' :
                      'secondary'
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.last_active
                      ? new Date(user.last_active).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={`/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={`/admin/users/${user.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </a>
                      </Button>
                      {user.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-600"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}