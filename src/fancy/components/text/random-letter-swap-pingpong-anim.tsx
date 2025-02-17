"use client"

import { useState } from "react"
import { DynamicAnimationOptions, motion, useAnimate } from "motion/react"
import { debounce } from "lodash"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: DynamicAnimationOptions
  staggerDuration?: number
  className?: string
  onClick?: () => void
}

const RandomLetterSwapPingPong = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const mergeTransition = (transition: DynamicAnimationOptions, i: number) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const shuffledIndices = Array.from(
    { length: label.length },
    (_, i) => i
  ).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(
    () => {
      if (blocked) return
      setBlocked(true)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        animate(
          ".letter-" + randomIndex,
          {
            y: reverse ? "100%" : "-100%",
          },
          mergeTransition(transition, i)
        )

        animate(
          ".letter-secondary-" + randomIndex,
          {
            top: "0%",
          },
          mergeTransition(transition, i)
        )
      }
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setBlocked(false)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        animate(
          ".letter-" + randomIndex,
          {
            y: 0,
          },
          mergeTransition(transition, i)
        )

        animate(
          ".letter-secondary-" + randomIndex,
          {
            top: reverse ? "-100%" : "100%",
          },
          mergeTransition(transition, i)
        )
      }
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i} aria-hidden={true}>
            <motion.span
              className={`relative pb-2 letter-${i}`}
              style={{ top: 0 }}
            >
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary-${i}`}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export default RandomLetterSwapPingPong
