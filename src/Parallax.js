import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"

export const Container = styled.div`
  width: ${({$width}) => $width};
  height: ${({$height}) => $height};
  overflow: hidden;
  position: relative;
`

export const Image = styled.img.attrs(({$scrollY, $offset, $nudge, $imageWidth, $imageHeight}) => ({
  style: {
    transform: `translate3d(calc(-50% + ${$imageWidth  ? "0" : "0"}px), ${($scrollY - $offset) * 0.33}px, 0px)`,
  }
}))`
  height: ${({$imageHeight}) => $imageHeight ? "100vh" : "unset"};
  width: ${({$imageWidth}) => $imageWidth ? "100vw" : "unset" };
  position: absolute;
  top: 0;
  left: 50%;
  will-change: transform;
  transform-style: preserve-3d;
  backface-visibility: hidden;
`

const Parallax = ({ height, width, img, alt, nudge, children }) => {
  const [offset, setOffset] = useState(0)
  const [imageHeight, setImageHeight] = useState(true)
  const [imageWidth, setImageWidth] = useState(false)
  const [naturalWidth, setNaturalWidth] = useState(0)
  const [naturalHeight, setNaturalHeight] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== undefined) {

      const handleScroll = () => setScrollY(window.scrollY)

      window.addEventListener("scroll", handleScroll)

      return () => window.removeEventListener("scroll", handleScroll)
    }
  })

  useEffect(() => {
    if (containerRef) {
      const resizeListener = () => {
        setOffset(containerRef.current.offsetTop)
        if (window.innerHeight / window.innerWidth > (naturalHeight / naturalWidth)) {
          // PHONE
          setImageHeight(true)
          setImageWidth(false)
        } else if (window.innerHeight / window.innerWidth < (naturalWidth /naturalHeight)) {
          // LAPTOP
          setImageHeight(false)
          setImageWidth(true)
        } else {
          // SAME
          setImageHeight(true)
          setImageWidth(false)
        }
      }

      resizeListener()

      window.addEventListener("resize", resizeListener)

      return () => window.removeEventListener("resize", resizeListener)
    }
  }, [containerRef, naturalWidth, naturalHeight])

  return (
    <Container
      $height={height}
      $width={width}
      ref={containerRef}
    >
      <Image
        onLoad={(e) => {
          setNaturalHeight(e.target.naturalWidth)
          setNaturalWidth(e.target.naturalHeight)
        }}
        src={img}
        alt={alt}
        $offset={offset}
        $scrollY={scrollY}
        $imageHeight={imageHeight}
        $imageWidth={imageWidth}
        $nudge={nudge}
      />
      {children}
    </Container>
  )
}

export default Parallax
