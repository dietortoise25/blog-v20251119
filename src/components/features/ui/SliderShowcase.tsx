"use client"

import * as React from 'react'
import { CyberCard, CyberCardContent, CyberCardDescription, CyberCardHeader, CyberCardTitle, CyberSlider, CyberLabel } from './index'

export function SliderShowcase() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 服务端渲染时返回占位符
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ 滑块组件 ]</h2>
        <div className="text-center text-muted-foreground py-8">
          Loading components...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-primary matrix-text electron-text">[ 滑块组件 ]</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <CyberCard>
          <CyberCardHeader>
            <CyberCardTitle className="electron-text">基础滑块</CyberCardTitle>
            <CyberCardDescription className="electron-text">单值和范围滑块演示</CyberCardDescription>
          </CyberCardHeader>
          <CyberCardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <CyberLabel htmlFor="single-slider">单值滑块</CyberLabel>
                <div className="pt-4">
                  <CyberSlider
                    id="single-slider"
                    defaultValue={[50]}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <div>
                <CyberLabel htmlFor="range-slider">范围滑块</CyberLabel>
                <div className="pt-4">
                  <CyberSlider
                    id="range-slider"
                    defaultValue={[25, 75]}
                    max={100}
                    step={1}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>

        <CyberCard>
          <CyberCardHeader>
            <CyberCardTitle className="electron-text">自定义步长</CyberCardTitle>
            <CyberCardDescription className="electron-text">不同步长的滑块演示</CyberCardDescription>
          </CyberCardHeader>
          <CyberCardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <CyberLabel htmlFor="step-5">步长 5</CyberLabel>
                <div className="pt-4">
                  <CyberSlider
                    id="step-5"
                    defaultValue={[30]}
                    max={100}
                    step={5}
                  />
                </div>
              </div>

              <div>
                <CyberLabel htmlFor="step-10">步长 10</CyberLabel>
                <div className="pt-4">
                  <CyberSlider
                    id="step-10"
                    defaultValue={[60]}
                    max={100}
                    step={10}
                  />
                </div>
              </div>

              <div>
                <CyberLabel htmlFor="decimal">小数步长 0.1</CyberLabel>
                <div className="pt-4">
                  <CyberSlider
                    id="decimal"
                    defaultValue={[75]}
                    max={100}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>
      </div>

      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="electron-text">综合滑块示例</CyberCardTitle>
          <CyberCardDescription className="electron-text">带有状态控制的滑块应用场景</CyberCardDescription>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-6">
            <div>
              <CyberLabel>音量控制</CyberLabel>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-muted-foreground text-sm">🔇</span>
                <CyberSlider
                  defaultValue={[70]}
                  max={100}
                  step={1}
                />
                <span className="text-muted-foreground text-sm">🔊</span>
              </div>
            </div>

            <div>
              <CyberLabel>价格范围</CyberLabel>
              <div className="pt-4">
                <CyberSlider
                  defaultValue={[200, 800]}
                  max={1000}
                  min={0}
                  step={10}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>

            <div>
              <CyberLabel>进度指示器</CyberLabel>
              <div className="pt-4">
                <CyberSlider
                  defaultValue={[45]}
                  max={100}
                  step={1}
                  disabled
                />
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <span>当前进度: 45%</span>
              </div>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>
    </div>
  )
}