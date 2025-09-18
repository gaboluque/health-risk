'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Settings, Database, Users, Shield, Bell, Download, Trash2, RefreshCw } from 'lucide-react'

interface AdminSettingsProps {
  user: {
    id: string
    email: string
    role: 'admin' | 'superadmin'
  }
  systemStats: {
    totalUsers: number
    totalSubmissions: number
    adminUsers: number
  }
}

export function AdminSettings({ user, systemStats }: AdminSettingsProps) {
  const isSuperAdmin = user.role === 'superadmin'

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>Current system status and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Total Users</Label>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registered patients and staff</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Total Submissions</Label>
              <div className="text-2xl font-bold">
                {systemStats.totalSubmissions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Completed assessments</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Admin Users</Label>
              <div className="text-2xl font-bold">{systemStats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Profile
          </CardTitle>
          <CardDescription>Your administrative account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant={isSuperAdmin ? 'destructive' : 'default'}>
                  {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-id">User ID</Label>
            <Input id="user-id" value={user.id} disabled className="font-mono text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions & Access
          </CardTitle>
          <CardDescription>Your current administrative permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Data Access</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>View Users</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>View Submissions</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Manage Questionnaires</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Analytics</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Administrative Actions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Export Data</span>
                    <Badge variant="default">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Manage Users</span>
                    <Badge variant={isSuperAdmin ? 'default' : 'secondary'}>
                      {isSuperAdmin ? 'Granted' : 'Limited'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Settings</span>
                    <Badge variant={isSuperAdmin ? 'default' : 'secondary'}>
                      {isSuperAdmin ? 'Granted' : 'Restricted'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>User Management</span>
                    <Badge variant={isSuperAdmin ? 'default' : 'secondary'}>
                      {isSuperAdmin ? 'Full Access' : 'View Only'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Actions
          </CardTitle>
          <CardDescription>Administrative tools and system maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Data Export */}
            <div className="space-y-3">
              <h4 className="font-medium">Data Management</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export User Data
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Submissions
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Analytics
                </Button>
              </div>
            </div>

            <Separator />

            {/* System Maintenance */}
            <div className="space-y-3">
              <h4 className="font-medium">System Maintenance</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Test Notifications
                </Button>
                {isSuperAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    System Cleanup
                  </Button>
                )}
              </div>
            </div>

            {isSuperAdmin && (
              <>
                <Separator />

                {/* Super Admin Only */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Super Admin Actions</h4>
                    <Badge variant="destructive" className="text-xs">
                      Super Admin Only
                    </Badge>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-3">
                      These actions can significantly impact the system. Use with caution.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        <Shield className="mr-2 h-4 w-4" />
                        Manage Admin Users
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        <Database className="mr-2 h-4 w-4" />
                        Database Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Frequently used administrative tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin">
                <Database className="mr-2 h-4 w-4" />
                PayloadCMS Admin
              </Link>
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="mr-2 h-4 w-4" />
              System Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
