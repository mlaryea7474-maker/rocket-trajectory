import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text: string, speed = 18) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const textRef = useRef(text)

  useEffect(() => {
    textRef.current = text
    indexRef.current = 0
    setDisplay('')
    setDone(false)

    const interval = setInterval(() => {
      const next = indexRef.current + 1
      setDisplay(textRef.current.slice(0, next))
      indexRef.current = next
      if (next >= textRef.current.length) {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return { display, done }
}
