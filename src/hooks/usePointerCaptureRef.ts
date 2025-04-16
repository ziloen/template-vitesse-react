import type { RefCallback } from 'react'
import { useLatest } from './useLatest'
import { useMemoizedFn } from './useMemoizedFn'

type Positon = {
  /** 当前 clientX */
  x: number
  /** 当前 clientY */
  y: number
}

type MovePosition = {
  /** 离起点（pointerDown时位置）的 x */
  dx: number
  /** 离起点（pointerDown时位置）的 y */
  dy: number
} & Positon

type UsePointerCaptureOptions<T> = {
  /**
   * 开始捕获指针的回调函数，返回 `false` 来阻止此次捕获指针
   */
  onStart?: (this: T, event: PointerEvent, position: Positon) => void | false

  /**
   * 移动过程中的回调函数
   */
  onMove?: (this: T, event: PointerEvent, position: MovePosition) => void

  /**
   * 捕获结束后的回调函数
   */
  onEnd?: (this: T, event: PointerEvent, position: MovePosition) => void
}

export function usePointerCaptureRef<T extends HTMLElement>(
  options: UsePointerCaptureOptions<T>,
): RefCallback<T> {
  const optionsRef = useLatest(options)

  return useMemoizedFn((el: T | null) => {
    if (!el) return

    const ac = new AbortController()
    let startPosition = { x: 0, y: 0 }

    el.addEventListener(
      'pointerdown',
      function (downEvent) {
        const { x, y } = downEvent

        /** 如果用户取消捕获 */
        if (
          optionsRef.current.onStart?.call(this as T, downEvent, { x, y }) ===
          false
        )
          return
        /** 保存初始位置 */
        startPosition = { x, y }
        /** 阻止默认行为，防止 user-select 不为 none 时，拖动导致触发 pointercancel 事件，capture 失效() */
        downEvent.preventDefault()

        /** 使当前元素锁定 pointer */
        el.setPointerCapture(downEvent.pointerId)
        const controller = new AbortController()

        /** 转发 move 事件 */
        el.addEventListener(
          'pointermove',
          function (moveEvent) {
            optionsRef.current.onMove?.call(this as T, moveEvent, {
              x: moveEvent.x,
              y: moveEvent.y,
              dx: moveEvent.x - startPosition.x,
              dy: moveEvent.y - startPosition.y,
            })
          },
          { signal: controller.signal, passive: true },
        )

        /** pointerup 停止监听 */
        el.addEventListener(
          'pointerup',
          function (upEvent) {
            controller.abort()
            el.releasePointerCapture(upEvent.pointerId)
            optionsRef.current.onEnd?.call(this as T, upEvent, {
              x: upEvent.x,
              y: upEvent.y,
              dx: upEvent.x - startPosition.x,
              dy: upEvent.y - startPosition.y,
            })
          },
          { once: true },
        )
      },
      { signal: ac.signal },
    )

    return () => {
      ac.abort()
    }
  })
}
