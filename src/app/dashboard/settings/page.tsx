"use client"

import * as React from 'react'
import { CyberButton } from '@/components/features/ui'

export default function SettingsPage() {
  const [mounted, setMounted] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [settings, setSettings] = React.useState({
    siteName: 'Cyber Blog',
    siteDescription: '技术与创意的交汇点',
    authorName: 'Alan Developer',
    postsPerPage: '10',
    allowComments: 'true',
    enableAnalytics: 'true',
    theme: 'cyberpunk'
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // 模拟保存设置
    setTimeout(() => {
      console.log('保存设置:', settings)
      setIsSaving(false)
      alert('设置已保存')
    }, 1000)
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="terminal-window">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="terminal-window">
        <div className="terminal-cyan font-mono text-lg mb-4">
          $ sudo nano /etc/config/settings.conf
        </div>
        <div className="terminal-green font-mono text-2xl font-bold mb-2">
          System Settings
        </div>
        <div className="terminal-muted font-mono text-sm">
          配置博客系统参数
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 基本设置 */}
          <div className="space-y-6">
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-lg mb-4">
                $ basic_settings
              </div>
              <div className="space-y-4">
                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    site_name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    site_description
                  </label>
                  <textarea
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    author_name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={settings.authorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

            {/* 显示设置 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-lg mb-4">
                $ display_settings
              </div>
              <div className="space-y-4">
                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    posts_per_page
                  </label>
                  <select
                    name="postsPerPage"
                    value={settings.postsPerPage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    disabled={isSaving}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>

                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    theme
                  </label>
                  <select
                    name="theme"
                    value={settings.theme}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    disabled={isSaving}
                  >
                    <option value="cyberpunk">Cyberpunk Terminal</option>
                    <option value="minimal">Minimal</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 功能设置 */}
          <div className="space-y-6">
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-lg mb-4">
                $ feature_settings
              </div>
              <div className="space-y-4">
                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    enable_comments
                  </label>
                  <select
                    name="allowComments"
                    value={settings.allowComments}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    disabled={isSaving}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="terminal-green font-mono text-sm block mb-2">
                    enable_analytics
                  </label>
                  <select
                    name="enableAnalytics"
                    value={settings.enableAnalytics}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    disabled={isSaving}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 系统信息 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-lg mb-4">
                $ system_info
              </div>
              <div className="terminal-muted font-mono text-xs space-y-1">
                <div>• Version: 1.0.0</div>
                <div>• Framework: Next.js 16</div>
                <div>• Runtime: Node.js</div>
                <div>• Database: PostgreSQL</div>
                <div>• Last Backup: 2025-01-18</div>
                <div>• Storage: 2.3GB used</div>
              </div>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="terminal-window">
          <div className="terminal-cyan font-mono text-lg mb-4">
            $ save_config
          </div>
          <div className="flex gap-4">
            <CyberButton
              type="submit"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">saving...</span>
                  <span className="terminal-cursor">_</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>$ apply_settings</span>
                  <span className="terminal-cursor">_</span>
                </span>
              )}
            </CyberButton>

            <button
              type="button"
              disabled={isSaving}
              className="terminal-command px-6 py-3 border border-border rounded hover:border-primary transition-colors terminal-muted font-mono text-sm"
            >
              $ reset
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}