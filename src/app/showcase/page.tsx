"use client"

import { CyberButton, CyberCard, CyberCardContent, CyberCardDescription, CyberCardFooter, CyberCardHeader, CyberCardTitle, CyberCheckbox, CyberInput, GlitchText, LoadingSpinner, ThemeToggle, WaterfallContainer, WaterfallItem, SliderShowcase } from '@/components/features/ui'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Rocket } from 'lucide-react'
import { toast } from 'sonner'

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background cyber-grid p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题区域 */}
        <div className="text-center space-y-4">
          {/* 主题切换按钮 */}
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <GlitchText
            text="CYBER BLOG SYSTEM"
            className="text-6xl font-bold pixel-text"
            intensity="high"
          />
          <p className="text-muted-foreground text-lg matrix-text electron-text">
            [ 柠檬绿 + 故障美学 + 霓虹蓝撞色 ]
          </p>
          <Badge variant="secondary" className="text-primary electron-text">
            v1.0.0
          </Badge>
        </div>

        <Separator className="border-primary/20" />

        {/* 设计语言概述 */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-primary matrix-text electron-text text-center">[ 设计语言系统 ]</h2>

          <div className="bg-card p-8 rounded-lg border border-primary/15">
            <h3 className="text-xl font-bold text-primary mb-4 electron-text">赛博朋克终端美学</h3>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground electron-text space-y-4">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-primary electron-text">核心哲学</h4>
                <p className="text-sm leading-relaxed">
                  融合现代 LCD 护眼绿色调与赛博朋克故障美学，创造既舒适又具有强烈科技感的视觉体验。
                  设计语言注重用户体验，通过统一字体系统和电子屏效果，营造沉浸式数字环境。
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-primary electron-text">色彩体系</h4>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><span className="text-primary font-mono">LCD 护眼绿</span> - 主色调，舒适且具科技感</li>
                  <li><span className="text-accent font-mono">霓虹蓝</span> - 撞色强调，形成强烈对比</li>
                  <li><span className="text-muted-foreground font-mono">深蓝背景</span> - 营造深邃数字空间</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-primary electron-text">字体系统</h4>
                <p className="text-sm leading-relaxed">
                  统一采用 JetBrains Mono 等宽字体，确保中英文视觉一致性。
                  配合电子屏发光效果和像素化渲染，强化终端美学氛围。
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-primary electron-text">交互体验</h4>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>像素边框多样化 - 点状、交叉线、扫描线</li>
                  <li>故障动画效果 - 文字抖动、屏幕闪烁</li>
                  <li>电子屏纹理 - 扫描线、噪点、发光</li>
                  <li>响应式瀑布流 - 适配各种设备</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Separator className="border-primary/20" />

        {/* 组件展示 */}
        <div className="space-y-8">
          {/* 按钮组件展示 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ 按钮组件 ]</h2>
            <div className="flex flex-wrap gap-4">
              <CyberButton variant="default">主要按钮</CyberButton>
              <CyberButton variant="secondary">次要按钮</CyberButton>
              <CyberButton variant="outline">轮廓按钮</CyberButton>
              <CyberButton variant="ghost">幽灵按钮</CyberButton>
            </div>
            <div className="flex flex-wrap gap-4">
              <CyberButton size="sm">小按钮</CyberButton>
              <CyberButton>默认按钮</CyberButton>
              <CyberButton size="lg">大按钮</CyberButton>
              <CyberButton size="icon"><Rocket /></CyberButton>
            </div>
          </section>

          {/* 卡片组件展示 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ 数据卡片 ]</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <CyberCard>
                <CyberCardHeader>
                  <CyberCardTitle className="electron-text">系统状态</CyberCardTitle>
                  <CyberCardDescription className="electron-text">实时监控系统运行状态</CyberCardDescription>
                </CyberCardHeader>
                <CyberCardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground electron-text">CPU 使用率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-primary animate-pulse"></div>
                        </div>
                        <span className="text-sm text-primary electron-text">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground electron-text">内存使用</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-primary animate-pulse"></div>
                        </div>
                        <span className="text-sm text-primary electron-text">50%</span>
                      </div>
                    </div>
                  </div>
                </CyberCardContent>
                <CyberCardFooter>
                  <CyberButton variant="ghost" size="sm">查看详情</CyberButton>
                </CyberCardFooter>
              </CyberCard>

              <CyberCard glitch>
                <CyberCardHeader>
                  <CyberCardTitle>故障检测</CyberCardTitle>
                  <CyberCardDescription>系统异常监控面板</CyberCardDescription>
                </CyberCardHeader>
                <CyberCardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                      <span className="text-destructive">数据包丢失</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-accent">连接超时</span>
                    </div>
                  </div>
                  <LoadingSpinner size="sm" />
                </CyberCardContent>
                <CyberCardFooter>
                  <CyberButton variant="secondary" size="sm">清除警报</CyberButton>
                </CyberCardFooter>
              </CyberCard>
            </div>
          </section>

          {/* 瀑布流展示 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ 瀑布流布局 ]</h2>
            <WaterfallContainer>
              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">故障艺术效果</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  采用CSS动画实现的故障失真效果，为界面添加赛博朋克风格。包括文字抖动、屏幕闪烁和数字噪点效果。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">CSS</Badge>
                  <Badge variant="secondary" className="electron-text">动画</Badge>
                  <Badge variant="secondary" className="electron-text">故障美学</Badge>
                </div>
              </WaterfallItem>

              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">瀑布流布局</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  适合普通读者的博客布局，支持响应式设计。内容自动排列，提升阅读体验，让内容发现更容易。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">响应式</Badge>
                  <Badge variant="secondary" className="electron-text">Masonry</Badge>
                  <Badge variant="secondary" className="electron-text">用户体验</Badge>
                </div>
              </WaterfallItem>

              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">交互体验优先</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  注重用户交互体验，提供流畅的动画过渡效果。所有交互元素都有视觉反馈，增强用户参与度。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">交互设计</Badge>
                  <Badge variant="secondary" className="electron-text">动画</Badge>
                  <Badge variant="secondary" className="electron-text">用户体验</Badge>
                </div>
              </WaterfallItem>

              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">LCD 护眼绿色</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  采用现代电子屏幕的护眼绿色调，既保持赛博朋克的科技感，又提供舒适的长时间阅读体验。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">设计系统</Badge>
                  <Badge variant="secondary" className="electron-text">色彩</Badge>
                  <Badge variant="secondary" className="electron-text">护眼设计</Badge>
                </div>
              </WaterfallItem>

              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">终端美学</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  统一采用 JetBrains Mono 等宽字体，营造专业的终端界面感。像素化渲染和电子屏效果，增强科技氛围。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">字体设计</Badge>
                  <Badge variant="secondary" className="electron-text">终端</Badge>
                  <Badge variant="secondary" className="electron-text">统一字体</Badge>
                </div>
              </WaterfallItem>

              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">像素边框系统</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  多样化的像素边框样式，包括点状、交叉线、扫描线等效果。与霓虹蓝形成撞色对比，强化视觉层次。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">边框设计</Badge>
                  <Badge variant="secondary" className="electron-text">像素化</Badge>
                  <Badge variant="secondary" className="electron-text">撞色对比</Badge>
                </div>
              </WaterfallItem>

              <WaterfallItem>
                <h3 className="text-lg font-bold text-primary mb-2 electron-text">电子屏发光</h3>
                <p className="text-muted-foreground mb-4 text-sm electron-text">
                  所有文字元素都配备微弱的电子屏发光效果，配合扫描线和噪点纹理，营造沉浸式数字环境。
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="electron-text">发光效果</Badge>
                  <Badge variant="secondary" className="electron-text">扫描线</Badge>
                  <Badge variant="secondary" className="electron-text">数字质感</Badge>
                </div>
              </WaterfallItem>
            </WaterfallContainer>
          </section>

          <SliderShowcase />

          {/* Toast 组件展示 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ Toast 通知 ]</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <CyberCard>
                <CyberCardHeader>
                  <CyberCardTitle className="electron-text">基础通知</CyberCardTitle>
                  <CyberCardDescription className="electron-text">不同类型的 Toast 通知演示</CyberCardDescription>
                </CyberCardHeader>
                <CyberCardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <CyberButton
                      onClick={() => toast.success('操作成功！', {
                        description: '文件已保存到本地'
                      })}
                      variant="default"
                    >
                      成功通知
                    </CyberButton>
                    <CyberButton
                      onClick={() => toast.error('操作失败！', {
                        description: '请检查网络连接'
                      })}
                      variant="outline"
                    >
                      错误通知
                    </CyberButton>
                    <CyberButton
                      onClick={() => toast.info('系统提示', {
                        description: '新版本已可用'
                      })}
                      variant="secondary"
                    >
                      信息通知
                    </CyberButton>
                    <CyberButton
                      onClick={() => toast.warning('注意', {
                        description: '磁盘空间不足'
                      })}
                      variant="outline"
                    >
                      警告通知
                    </CyberButton>
                  </div>
                </CyberCardContent>
              </CyberCard>

              <CyberCard>
                <CyberCardHeader>
                  <CyberCardTitle className="electron-text">高级通知</CyberCardTitle>
                  <CyberCardDescription className="electron-text">带操作和持续时间的通知</CyberCardDescription>
                </CyberCardHeader>
                <CyberCardContent className="space-y-4">
                  <div className="space-y-3">
                    <CyberButton
                      onClick={() => {
                        toast.loading('正在上传...', {
                          duration: 2000
                        })
                        setTimeout(() => {
                          toast.success('上传完成！')
                        }, 2000)
                      }}
                      variant="secondary"
                      className="w-full"
                    >
                      模拟上传进度
                    </CyberButton>
                    <CyberButton
                      onClick={() => {
                        const toastId = toast('连接中...', {
                          description: '正在建立安全连接',
                          action: {
                            label: '取消',
                            onClick: () => toast.dismiss(toastId)
                          }
                        })
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      带操作的通知
                    </CyberButton>
                    <CyberButton
                      onClick={() => {
                        toast.success('✨ 主题已切换', {
                          description: '已适配到新的配色方案',
                          icon: '🎨',
                          duration: 5000
                        })
                      }}
                      className="w-full"
                    >
                      自定义图标
                    </CyberButton>
                  </div>
                </CyberCardContent>
              </CyberCard>
            </div>

            <CyberCard>
              <CyberCardHeader>
                <CyberCardTitle className="electron-text">消息队列演示</CyberCardTitle>
                <CyberCardDescription className="electron-text">一次性显示多个通知的队列效果</CyberCardDescription>
              </CyberCardHeader>
              <CyberCardContent>
                <div className="flex gap-3 justify-center">
                  <CyberButton
                    onClick={() => {
                      toast.success('系统已启动', { description: '所有服务正常运行' })
                      setTimeout(() => toast.info('数据库连接成功', { description: '响应时间: 12ms' }), 500)
                      setTimeout(() => toast.info('缓存已预热', { description: '命中率: 98%' }), 1000)
                      setTimeout(() => toast.success('准备就绪', { description: '系统可以正常使用' }), 1500)
                    }}
                  >
                    启动系统序列
                  </CyberButton>
                  <CyberButton
                    onClick={() => {
                      toast.error('⚠️ 系统异常', { description: '检测到异常数据流' })
                      setTimeout(() => toast.warning('启动安全扫描', { description: '正在检查系统完整性' }), 500)
                      setTimeout(() => toast.info('修复中...', { description: '自动恢复程序已启动' }), 1000)
                      setTimeout(() => toast.success('✅ 系统已恢复', { description: '所有功能正常' }), 2000)
                    }}
                    variant="outline"
                  >
                    故障恢复序列
                  </CyberButton>
                </div>
              </CyberCardContent>
            </CyberCard>
          </section>

          {/* 综合效果展示 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ 综合效果 ]</h2>
            <CyberCard>
              <CyberCardContent className="text-center space-y-4">
                <GlitchText
                  text="SYSTEM READY"
                  className="text-3xl font-bold"
                  intensity="high"
                />
                <p className="matrix-text text-lg">
                  [ 赛博朋克博客系统已就绪 ]
                </p>
                <div className="flex justify-center gap-4">
                  <CyberButton>启动系统</CyberButton>
                  <CyberButton variant="outline">配置参数</CyberButton>
                </div>
                <div className="cyber-border p-4 bg-background/50">
                  <div className="text-sm font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">状态:</span>
                      <span className="text-primary terminal-cursor">ONLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">延迟:</span>
                      <span className="text-primary">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">数据流:</span>
                      <span className="text-primary data-stream">正常</span>
                    </div>
                  </div>
                </div>
              </CyberCardContent>
            </CyberCard>
          </section>
        </div>
      </div>
    </div>
  )
}