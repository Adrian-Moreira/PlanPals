import React from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import { Marker, Popup } from "react-leaflet"
import leaflet from "leaflet"

export interface DraggableMarkerProps {
    centre: [number, number]
    setCentre: React.Dispatch<React.SetStateAction<number[]>>
}

export function DraggableMarker(props: DraggableMarkerProps) {
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(props.centre)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current as unknown as leaflet.Marker
          if (marker != null) {
            setPosition([marker.getLatLng().lat, marker.getLatLng().lng])
            props.setCentre([marker.getLatLng().lat, marker.getLatLng().lng])
          }
        },
      }),
      [],
    )
    // const toggleDraggable = useCallback(() => {
    //   setDraggable((d) => !d)
    // }, [])
  
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
        {/* <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span>
        </Popup> */}
      </Marker>
    )
  }
  