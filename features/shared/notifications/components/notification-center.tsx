'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, Check, CheckCheck, Trash2, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/features/shared/notifications/api/mutations'
import { useToast } from '@/lib/hooks/use-toast'
import type { Database } from '@/lib/types/database.types'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

type Message = Database['communication']['Tables']['messages']['Row']

type Props = {
  notifications: Message[]
}

export function NotificationCenter({ notifications }: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const { toast } = useToast()

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.is_read
    if (activeTab === 'read') return n.is_read
    return n.context_type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      toast({
        title: 'Marked as read',
        description: 'Notification has been marked as read',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      toast({
        title: 'All marked as read',
        description: `${unreadCount} notification(s) marked as read`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id)
      toast({
        title: 'Deleted',
        description: 'Notification has been deleted',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      })
    }
  }

  const getChannelIcon = (contextType: string | null) => {
    if (!contextType) return <Bell className="h-4 w-4" />
    if (contextType === 'email') return <Mail className="h-4 w-4" />
    if (contextType === 'sms') return <MessageSquare className="h-4 w-4" />
    if (contextType === 'push') return <Smartphone className="h-4 w-4" />
    return <Bell className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="flex flex-col gap-3 mt-4">
              {filteredNotifications.length === 0 ? (
                <Empty>
                  <EmptyMedia variant="icon">
                    <Bell className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No notifications</EmptyTitle>
                    <EmptyDescription>New alerts will show up here as they arrive.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                filteredNotifications.map((notification) => (
                  <Alert
                    key={notification.id}
                    className={!notification.is_read ? 'border-primary bg-primary/5' : ''}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getChannelIcon(notification.context_type)}
                          <AlertDescription className="font-semibold text-foreground">
                            {notification.content}
                          </AlertDescription>
                          {!notification.is_read && <Badge variant="secondary">New</Badge>}
                        </div>
                        <div className="space-y-1">
                          {notification.context_type ? (
                            <AlertDescription>
                              Type: {notification.context_type}
                            </AlertDescription>
                          ) : null}
                          <AlertDescription>
                            <time dateTime={notification.created_at}>
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </time>
                          </AlertDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.id)}
                            aria-label="Mark notification as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notification.id)}
                          aria-label="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Alert>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
