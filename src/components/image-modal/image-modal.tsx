import React, { MouseEventHandler, useEffect, useRef } from "react"
import { imageName } from "../../common-utils"
import "./image-modal.styl"
import ReactImageMagnify from "react-image-magnify"

export function ImageModal({
  aperture,
  milkNr,
  onClose,
}: {
  aperture: string
  milkNr: number
  onClose: () => void
}) {
  useDisableScrollAndCloseOnEsc(onClose)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {}, [])

  const imageZoomSize = 240
  const onMouseMove: MouseEventHandler<HTMLImageElement> = (e) => {
    const parentContainer = e.currentTarget.getBoundingClientRect()
    const x = e.pageX - parentContainer.x
    const y = e.pageY - parentContainer.y

    if (imgRef.current) {
      const { style } = imgRef.current

      if (x < 0 || y < 0) {
        style.display = "none"
        return
      }

      style.display = "initial"
      style.left = `${x - imageZoomSize / 2}px`
      style.top = `${y - imageZoomSize / 2}px`
      style.objectPosition = `${(x / parentContainer.width) * 100}% ${
        (y / parentContainer.height) * 100
      }%`
    }
  }

  return (
    <>
      <div className="image-modal-underlay" />
      <div className={"image-modal"}>
        <div className="image-modal-content" onMouseMove={onMouseMove}>
          <h3 className="label">
            F{aperture} - milk nr: {milkNr}
          </h3>
          {/*<img src={imageName(aperture, milkNr, true)} />*/}
          <img src={imageName(aperture, milkNr, false)} />
          <img
            className="image-zoom"
            src={imageName(aperture, milkNr, false)}
            ref={imgRef}
          />
          <div className="instructions">
            <span>ESC</span> - to close <br />
            <span>Arrows</span> - to change image
          </div>
          <button className="close-button" onClick={onClose}>
            Close ❌
          </button>
        </div>
      </div>
    </>
  )
}

function useDisableScrollAndCloseOnEsc(onClose: () => void) {
  return useEffect(() => {
    function closeOnEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    function disableScroll() {
      window.scrollTo(scrollLeft, scrollTop)
    }

    window.addEventListener("keydown", closeOnEsc)
    window.document.addEventListener("scroll", disableScroll)

    return () => {
      window.removeEventListener("keydown", closeOnEsc)
      window.document.removeEventListener("scroll", disableScroll)
    }
  }, [onClose])
}
