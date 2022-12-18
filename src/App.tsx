import React, { useEffect, useState } from "react"
import { ImageModal } from "./components/image-modal"
import "./App.css"
import { imageName } from "./common-utils"

const apertures = ["1.4", "2", "2.8", "4", "5.6", "8", "11", "16"]
const milks = [1, 2, 3, 4, 5, 6]

const stateValues = {
  aperture: apertures,
  milkNr: milks,
}

function milkNrToString(milkNr: number) {
  if (milkNr === 1) {
    return ""
  }
  return ` ${milkNr - 1}`
}

type State = { aperture: string; milkNr: number }

function App() {
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState<undefined | State>(undefined)

  function onChange(what: keyof State, howMuch: number) {
    if (selected == null) {
      return
    }

    // @ts-ignore
    const index = stateValues[what].indexOf(selected[what])
    const newIndex = Math.max(
      Math.min(index + howMuch, stateValues[what].length - 1),
      0,
    )
  }

  console.log(selected)

  useEffect(() => {
    function changeSelected(e: KeyboardEvent) {
      if (!selected) {
        return
      }
      console.log(e.key)

      function modArrayIndex<T>(array: T[], currentValue: T, mod: number) {
        const index = array.indexOf(currentValue) || 0
        const newIndex = Math.min(Math.max(index + mod, 0), array.length - 1)
        return array[newIndex]
      }

      const operations: Record<string, (() => void) | undefined> = {
        ArrowUp: () =>
          setSelected((prevState) =>
            prevState
              ? {
                  milkNr: prevState.milkNr,
                  aperture: modArrayIndex(apertures, prevState.aperture, -1),
                }
              : undefined,
          ),
        ArrowDown: () =>
          setSelected((prevState) =>
            prevState
              ? {
                  milkNr: prevState.milkNr,
                  aperture: modArrayIndex(apertures, prevState.aperture, 1),
                }
              : undefined,
          ),
        ArrowLeft: () =>
          setSelected((prevState) =>
            prevState
              ? {
                  milkNr: modArrayIndex(milks, prevState.milkNr, -1),
                  aperture: prevState.aperture,
                }
              : undefined,
          ),
        ArrowRight: () =>
          setSelected((prevState) =>
            prevState
              ? {
                  milkNr: modArrayIndex(milks, prevState.milkNr, 1),
                  aperture: prevState.aperture,
                }
              : undefined,
          ),
      }

      const operation = operations[e.key]
      operation?.()
    }

    document.addEventListener("keydown", changeSelected)

    return () => document.removeEventListener("keydown", changeSelected)
  }, [selected])

  return (
    <>
      <div className="container">
        <h2>Testing depth of field</h2>
        <ul>
          <li>
            📏 Distance between milks is 0.5m; distance of camera to fist milk
            1.2m
          </li>
          <li>📸 Fuji X-E3 with 33m lens</li>
        </ul>
        <p></p>
        <div>
          {apertures.map((aperture) => (
            <>
              <h4>F{aperture}</h4>
              <div>
                {milks.map((milk) => (
                  <div className="image-button-wrapper">
                    <span className="milk-number-text">{milk}</span>
                    <button
                      className="clear-button image-button"
                      onClick={() => setSelected({ aperture, milkNr: milk })}
                    >
                      <img
                        className={"image-thumb"}
                        src={imageName(aperture, milk, true)}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
      {selected && (
        <ImageModal {...selected} onClose={() => setSelected(undefined)} />
      )}
    </>
  )
}

export default App
