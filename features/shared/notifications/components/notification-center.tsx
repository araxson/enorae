'use client'

import { Fragment, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Check, CheckCheck, Trash2, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/features/shared/notifications/api/mutations'
import { useToast } from '@/lib/hooks/use-toast'
import type { Database } from '@/lib/types/database.types'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

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
    if (!contextType) return <Bell className="size-4" />
    if (contextType === 'email') return <Mail className="size-4" />
    if (contextType === 'sms') return <MessageSquare className="size-4" />
    if (contextType === 'push') return <Smartphone className="size-4" />
    return <Bell className="size-4" />
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="flex items-center gap-3">
          <Bell className="size-5" />
          <ItemTitle>Notification Center</ItemTitle>
          {unreadCount > 0 ? (
            <Badge variant="destructive">{unreadCount}</Badge>
          ) : null}
        </div>
        {unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="size-4" />
            <span>Mark all as read</span>
          </Button>
        ) : null}
      </ItemHeader>
      <ItemContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="grid w-full grid-cols-5">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount > 0 ? `(${unreadCount})` : null}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            <div className="mt-4">
              {filteredNotifications.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Bell className="size-6" aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>No notifications</EmptyTitle>
                    <EmptyDescription>
                      New alerts will show up here as they arrive.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup>
                  {filteredNotifications.map((notification, index) => (
                    <Fragment key={notification.id}>
                      <Item
                        variant={notification.is_read ? 'outline' : 'muted'}
                        size="sm"
                      >
                        <ItemMedia variant="icon">
                          {getChannelIcon(notification.context_type)}
                        </ItemMedia>
                        <div className="min-w-0 flex-1">
                          <ItemContent>
                            <ItemTitle>
                              <span className="truncate">{notification.content}</span>
                              {!notification.is_read ? (
                                <Badge variant="secondary">New</Badge>
                              ) : null}
                            </ItemTitle>
                            {notification.context_type ? (
                              <ItemDescription>
                                Type: {notification.context_type}
                              </ItemDescription>
                            ) : null}
                            <ItemDescription>
                              <time dateTime={notification.created_at}>
                                {formatDistanceToNow(new Date(notification.created_at), {
                                  addSuffix: true,
                                })}
                              </time>
                            </ItemDescription>
                          </ItemContent>
                        </div>
                        <div className="flex-none">
                          <ItemActions>
                            <ButtonGroup>
                              {!notification.is_read ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  aria-label="Mark notification as read"
                                >
                                  <Check className="size-4" />
                                </Button>
                              ) : null}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(notification.id)}
                                aria-label="Delete notification"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </ButtonGroup>
                          </ItemActions>
                        </div>
                      </Item>
                      {index < filteredNotifications.length - 1 ? (
                        <ItemSeparator />
                      ) : null}
                    </Fragment>
                  ))}
                </ItemGroup>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </ItemContent>
    </Item>
  )
}
