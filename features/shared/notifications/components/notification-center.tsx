'use client'

import { Fragment, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Bell, Check, CheckCheck, Filter, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/features/shared/notifications/api/mutations'
import { useNotificationAction } from '../hooks/use-notification-action'
import type { Database } from '@/lib/types/database.types'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { getChannelIcon } from '../utils/notification-icons'

type Message = Database['communication']['Tables']['messages']['Row']

type Props = {
  notifications: Message[]
}

export function NotificationCenter({ notifications }: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const tabItems = useMemo(
    () => [
      { value: 'all', label: 'All' },
      {
        value: 'unread',
        label: unreadCount > 0 ? `Unread (${unreadCount})` : 'Unread',
      },
      { value: 'read', label: 'Read' },
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'SMS' },
    ],
    [unreadCount]
  )

  const getNotificationsForTab = (tab: string) => {
    switch (tab) {
      case 'unread':
        return notifications.filter((notification) => !notification.is_read)
      case 'read':
        return notifications.filter((notification) => notification.is_read)
      case 'email':
        return notifications.filter((notification) => notification.context_type === 'email')
      case 'sms':
        return notifications.filter((notification) => notification.context_type === 'sms')
      default:
        return notifications
    }
  }

  const renderNotificationList = (items: Message[]) => {
    if (items.length === 0) {
      return (
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
      )
    }

    return (
      <ItemGroup>
        {items.map((notification, index) => (
          <Fragment key={notification.id}>
            <Item
              variant={notification.is_read ? 'outline' : 'muted'}
              size="sm"
            >
              <ItemMedia variant="icon" aria-hidden="true">
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
            {index < items.length - 1 ? (
              <ItemSeparator />
            ) : null}
          </Fragment>
        ))}
      </ItemGroup>
    )
  }

  const handleMarkAsRead = useNotificationAction(
    markNotificationAsRead,
    'Marked as read',
    'Notification has been marked as read',
    'Failed to mark notification as read'
  )

  const handleMarkAllAsRead = useNotificationAction(
    markAllNotificationsAsRead,
    'All marked as read',
    `${unreadCount} notification(s) marked as read`,
    'Failed to mark all as read'
  )

  const handleDelete = useNotificationAction(
    deleteNotification,
    'Deleted',
    'Notification has been deleted',
    'Failed to delete notification'
  )

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell className="size-5" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle>Notification Center</CardTitle>
              {unreadCount > 0 ? (
                <Badge variant="destructive" aria-label={`${unreadCount} unread notifications`}>
                  {unreadCount}
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} aria-label={`Mark all ${unreadCount} notifications as read`}>
                <CheckCheck className="size-4" aria-hidden="true" />
                <span>Mark all as read</span>
              </Button>
            ) : null}
            <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Open notification filters"
                >
                  <Filter className="size-4" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="sm:hidden">
                <SheetHeader>
                  <SheetTitle>Filter notifications</SheetTitle>
                </SheetHeader>
                <RadioGroup
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value)
                    setFilterSheetOpen(false)
                  }}
                  className="pt-4"
                >
                  {tabItems.map((tab) => (
                    <div
                      key={tab.value}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem id={`filter-${tab.value}`} value={tab.value} />
                        <Label htmlFor={`filter-${tab.value}`} className="text-sm font-medium">
                          {tab.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <CardDescription>Filter and manage your alerts in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="hidden w-full grid-cols-5 sm:grid" aria-label="Notification filters">
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabItems.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="mt-4">
                {renderNotificationList(getNotificationsForTab(tab.value))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
