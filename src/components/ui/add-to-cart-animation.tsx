"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface AddToCartAnimationProps {
  productImage: string
  productName: string
  targetRef: React.RefObject<HTMLElement>
}

export function AddToCartAnimation({ productImage, productName, targetRef }: AddToCartAnimationProps) {
  const [show, setShow] = useState(true)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!targetRef.current || !elementRef.current) return null

  const targetBounds = targetRef.current.getBoundingClientRect()
  const sourceBounds = elementRef.current.getBoundingClientRect()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={elementRef}
          className="fixed z-50 h-16 w-16 rounded-full overflow-hidden pointer-events-none"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: targetBounds.x - sourceBounds.x + targetBounds.width / 2 - sourceBounds.width / 2,
            y: targetBounds.y - sourceBounds.y + targetBounds.height / 2 - sourceBounds.height / 2,
            opacity: 0,
            scale: 0.2,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Image src={productImage || "/placeholder.svg"} alt={productName} fill className="object-cover" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

