import React from 'react'
import { useEffect, useState } from 'react'
import DestinationItem from './DestinationItem'

export interface DestinationItemsProps {
  destinationList: any[]
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentDestination: React.Dispatch<React.SetStateAction<any>>
}

export default function DestinationItems(props: DestinationItemsProps) {
  const [listOfDestination, setListOfDestination] = useState([<></>])
  useEffect(() => {
    setListOfDestination(
      props.destinationList.map((d) => (
        <DestinationItem
          key={d._id}
          _id={d._id}
          name={d.name}
          startDate={d.startDate}
          endDate={d.endDate}
          onClickHandler={() => props.setCurrentDestination(d)}
        />
      )),
    )
  }, [props.destinationList])
  return <> {...listOfDestination}</>
}
