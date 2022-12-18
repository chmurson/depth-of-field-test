import React, { MouseEventHandler, useEffect, useRef, useState } from "react"
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
  const [isMagnifierOn, setIsMagnifierOn] = useState(true)
  useDisableScrollAndCloseOnEsc(onClose)
  const imgRef = useRef<HTMLImageElement>(null)
  const zoomCheckboxRef = useRef<HTMLInputElement>(null)

  const imageZoomSize = 140
  const onMouseMove: MouseEventHandler<HTMLImageElement> = (e) => {
    const parentContainer = e.currentTarget
    if (!parentContainer) {
      return
    }

    const parentConatinerRect = parentContainer.getBoundingClientRect()
    const x = e.clientX - parentConatinerRect.left
    const y = e.clientY - parentConatinerRect.top

    if (imgRef.current) {
      const { style } = imgRef.current

      const isOutsideViewPort =
        x < 0 ||
        y < 0 ||
        y > parentConatinerRect.height ||
        x > parentConatinerRect.width

      if (isOutsideViewPort || !isMagnifierOn) {
        style.display = "none"
      } else {
        style.display = "initial"
      }

      style.left = `${x - imageZoomSize / 2}px`
      style.top = `${y - imageZoomSize / 2}px`
      style.objectPosition = `${(x / parentConatinerRect.width) * 100}% ${
        (y / parentConatinerRect.height) * 100
      }%`
    }
  }

  useEffect(() => {
    function checkStuff(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "z") {
        setIsMagnifierOn((prevValue) => !prevValue)
      }
    }

    document.addEventListener("keydown", checkStuff)

    return () => document.removeEventListener("keydown", checkStuff)
  }, [zoomCheckboxRef, setIsMagnifierOn])

  return (
    <>
      <div className="image-modal-underlay" />
      <div className={"image-modal"}>
        <span className="label">
          <h3>
            F{aperture} - milk nr: {milkNr}
          </h3>
          <label>
            toggle the magnifier 🔎{" "}
            <input
              type="checkbox"
              checked={isMagnifierOn}
              onChange={(e) => setIsMagnifierOn(e.target.checked)}
            />
          </label>
        </span>
        <div className="image-modal-content">
          <div onMouseMove={onMouseMove} style={{ position: "relative" }}>
            <img
              src={imageName(aperture, milkNr, false)}
              className="main-image"
            />
            <img
              className="image-zoom"
              src={imageName(aperture, milkNr, false)}
              ref={imgRef}
            />
          </div>
        </div>
        <div className="instructions">
          <span>ESC</span> - to close <br />
          <span>Arrows</span> - to change image <br />
          <span>Z</span> - to toggle magnifier
        </div>
        <button className="close-button" onClick={onClose}>
          Close ❌
        </button>
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
