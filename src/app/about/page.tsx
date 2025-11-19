"use client"

import * as React from 'react'
import { BlogLayout } from '@/components/features/layout'

export default function AboutPage() {
  return (
    <BlogLayout>
      <div className="terminal-window">
        <div className="terminal-cyan text-lg mb-6">
          $ cat about_me.txt
        </div>

        <div className="space-y-6 text-terminal-muted">
          <div className="terminal-green">
            <h2 className="text-xl font-bold mb-2">Alan Developer</h2>
            <div className="text-sm">
              <span className="terminal-cyan">$</span> whoami
            </div>
            <p className="mt-2">
              一个热爱编程的开发者，专注于前端技术和用户体验设计。
              喜欢探索新技术，分享开发经验和创意思考。
            </p>
          </div>

          <div>
            <div className="terminal-cyan text-sm mb-2">
              $ cat skills.txt
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="terminal-yellow text-sm font-mono mb-2">Frontend:</div>
                <div className="text-sm space-y-1">
                  <div>• React.js / Next.js</div>
                  <div>• TypeScript</div>
                  <div>• Tailwind CSS</div>
                  <div>• Node.js</div>
                </div>
              </div>
              <div>
                <div className="terminal-yellow text-sm font-mono mb-2">Backend:</div>
                <div className="text-sm space-y-1">
                  <div>• PostgreSQL</div>
                  <div>• Prisma ORM</div>
                  <div>• REST APIs</div>
                  <div>• Git / GitHub</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="terminal-cyan text-sm mb-2">
              $ cat interests.txt
            </div>
            <div className="text-sm">
              <p>• 赛博朋克设计与美学</p>
              <p>• 终端界面与命令行工具</p>
              <p>• 用户体验与交互设计</p>
              <p>• 开源项目与知识分享</p>
            </div>
          </div>

          <div>
            <div className="terminal-cyan text-sm mb-2">
              $ find . -name "contact.*"
            </div>
            <div className="text-sm space-y-2">
              <div>
                <span className="terminal-green">Email:</span>
                <span className="ml-2">alan@example.dev</span>
              </div>
              <div>
                <span className="terminal-green">GitHub:</span>
                <span className="ml-2">github.com/alan-developer</span>
              </div>
              <div>
                <span className="terminal-green">Location:</span>
                <span className="ml-2">Digital Space</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-terminal-border">
          <div className="terminal-cyan text-sm mb-2">
            $ echo "感谢访问我的博客！"
          </div>
          <div className="terminal-green text-sm">
            如果你喜欢这里的内容，欢迎留言交流或关注我的项目。
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}