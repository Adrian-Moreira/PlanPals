import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect } from 'react'
import { DestinationView } from './Destinations/DestinationView'
import DestinationItem, { DestinationProps } from './Destinations/DestinationItem'
import TransportationItem, { TransportationProps } from './Transportation/TransportItem'
import IndexedTabPanel from './IndexedTabPanel'

PlannerDetailView.propTypes = {
  planner: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    destinations: PropTypes.arrayOf(PropTypes.string),
    transportations: PropTypes.arrayOf(PropTypes.string),
    createdBy: PropTypes.object.isRequired,
  }).isRequired,
}

function mkPlannerView({ currentDestination, onDismissHandler, currentUserId }) {
  return (
    currentDestination && (
      <DestinationView
        activities={currentDestination.activities}
        accommodations={currentDestination.accommodations}
        createdAt={currentDestination.createdAt}
        updatedAt={currentDestination.updatedAt}
        createdBy={currentDestination.createdBy}
        currentUserId={currentUserId}
        onDismissHandler={onDismissHandler}
        _id={currentDestination._id}
        name={currentDestination.name}
        startDate={currentDestination.startDate}
        endDate={currentDestination.endDate}
        onClickHandler={currentDestination.onClickHandler}
      ></DestinationView>
    )
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function PlannerDetailView({ className, planner, transportations, destinations, ...props }) {
  const { ppUser } = props
  const [value, setValue] = React.useState(0)
  const [currentTransport, setCurrentTransport] = React.useState(null)
  const [currentDestination, setCurrentDestination] = React.useState(null)
  const [listOfTransportation, setListOfTransportation] = React.useState([])
  const [listOfDestinations, setListOfDestinations] = React.useState([])

  const mkTransportationItems = useCallback(async () => {
    setListOfTransportation(
      transportations.map((t) => {
        return (
          <TransportationItem
            key={t._id}
            currentUserId={ppUser._id}
            _id={t._id}
            type={t.type}
            details={t.details}
            vehicleId={t.vehicleId}
            departureTime={t.departureTime}
            arrivalTime={t.arrivalTime}
            onClickHandler={() => setCurrentTransport(t)}
          ></TransportationItem>
        )
      }),
    )
  }, [transportations, setListOfTransportation, setCurrentTransport])

  const mkDestinationItems = useCallback(async () => {
    setListOfDestinations(
      destinations.map((d) => {
        return (
          <DestinationItem
            key={d._id}
            _id={d._id}
            name={d.name}
            startDate={d.startDate}
            endDate={d.endDate}
            onClickHandler={() => setCurrentDestination(d)}
          ></DestinationItem>
        )
      }),
    )
  }, [destinations, setListOfDestinations, setCurrentDestination])

  const initDestinationView = useCallback(async () => {
    if (destinations.length > 0 && !currentDestination) {
      setCurrentDestination(destinations[0])
    }
  }, [destinations, setCurrentDestination])

  useEffect(() => {
    mkDestinationItems()
    mkTransportationItems()
    initDestinationView()
  }, [destinations, mkTransportationItems, initDestinationView])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <MUI.Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '86vh',
        gap: 1,
        position: 'static',
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
      }}
    >
      <MUI.Box
        sx={{
          display: 'flex',
          width: {
            xs: '100%',
            sm: '100%',
            md: '40%',
            lg: '33%',
            xl: '28%',
          },
          flexShrink: 0,
          flexDirection: 'column',
          height: {
            xs: currentDestination ? '0%' : '100%',
            md: '100%',
          },
          position: 'sticky',
          overflow: 'hidden',
        }}
      >
        {/** Tab Bar */}
        <MUI.Box
          sx={{
            borderBottom: 0,
            borderColor: 'divider',
            flexShrink: 0,
            margin: '0 1em',
          }}
        >
          <MUI.AppBar sx={{ borderRadius: '1em', margin: 0 }} position="sticky">
            <MUI.Tabs centered value={value} onChange={handleChange} aria-label="dt-tabs">
              <MUI.Tab icon={<MUIcons.MapSharp />} iconPosition="start" label="Destinations" {...a11yProps(0)} />
              <MUI.Tab
                icon={<MUIcons.EmojiTransportation />}
                iconPosition="start"
                label="Transport"
                {...a11yProps(1)}
              />
            </MUI.Tabs>
          </MUI.AppBar>
        </MUI.Box>
        <MUI.Box
          sx={{
            margin: '-1.5em 0',
            padding: '0.5em 0',
            flexGrow: 1,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <IndexedTabPanel key={`tab-panel-0`} value={value} index={0}>
            {listOfDestinations}
          </IndexedTabPanel>
          <IndexedTabPanel key={`tab-panel-1`} value={value} index={1}>
            {listOfTransportation}
          </IndexedTabPanel>
        </MUI.Box>
      </MUI.Box>
      <MUI.Box
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {/** Planner Destination View */}
        {mkPlannerView({
          currentDestination: currentDestination,
          currentUserId: ppUser._id,
          onDismissHandler: () => setCurrentDestination(null),
        })}
      </MUI.Box>
    </MUI.Box>
  )
}
