import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom' // Import useParams to get plannerId from URL
import { BiSolidPlane } from 'react-icons/bi' // Icon for transport
import { BiSolidBed } from 'react-icons/bi' // Icon for accommodations
import { BiCalendarEvent } from 'react-icons/bi' // Icon for activities
import { BsFillPlusCircleFill, BsPencilFill, BsTrashFill, BsFillMapFill } from 'react-icons/bs'
import apiLib from '../lib/apiLib' // Import apiLib for API calls
import { useAppContext } from '../lib/contextLib'
import { getCurrentUser } from '../lib/authLib'
import './Legacy.css'
import CommentButton from '../components/Comments/CommentButton'
import VoteButtons from '../components/Votes/VoteButtons'
export const Planner = () => {
  const nav = useNavigate()
  // Retrieve plannerId and userId from URL and context
  const { plannerId, access } = useParams()
  const isReadOnly = access === 'ro' //set planner to read only if user has ro access
  const { ppUser, setCognitoUser, setPPUser } = useAppContext()

  useEffect(() => {
    async function initializeUser() {
      if (!ppUser) {
        nav('/login')
        // try {
        //   await getCurrentUser(setCognitoUser, setPPUser)
        // } catch (error) {
        //   alert(error)
        // }
      }
    }
    initializeUser()
  }, [setCognitoUser, setPPUser, ppUser])

  // State variables
  const [planner, setPlanner] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [transportations, setTransportations] = useState([])
  const [accommodations, setAccommodations] = useState([])
  const [activities, setActivities] = useState([])

  // State variables for destination form
  const [showDestinationForm, setShowDestinationForm] = useState(false)
  const [destinationName, setDestinationName] = useState('')
  const [destinationStartDate, setDestinationStartDate] = useState('')
  const [destinationEndDate, setDestinationEndDate] = useState('')
  const [editingDestinationId, setEditingDestinationId] = useState(null)

  // State variables for transportation form
  const [showTransportationForm, setShowTransportationForm] = useState(false)
  const [transportationType, setTransportationType] = useState('')
  const [transportationDetails, setTransportationDetails] = useState('')
  const [transportationDepartureTime, setTransportationDepartureTime] = useState('')
  const [transportationArrivalTime, setTransportationArrivalTime] = useState('')
  const [transportationVehicleId, setTransportationVehicleId] = useState('')
  const [editingTransportationId, setEditingTransportationId] = useState(null)

  // State variables for accommodation form
  const [showAccommodationForm, setShowAccommodationForm] = useState(false)
  const [accommodationName, setAccommodationName] = useState('')
  const [accommodationStartDate, setAccommodationStartDate] = useState('')
  const [accommodationEndDate, setAccommodationEndDate] = useState('')
  const [accommodationDestinationId, setAccommodationDestinationId] = useState('')
  const [editingAccommodationId, setEditingAccommodationId] = useState(null)

  // State variables for activity form
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [activityTime, setActivityTime] = useState('')
  const [activityDestinationId, setActivityDestinationId] = useState('')
  const [editingActivityId, setEditingActivityId] = useState(null)

  const [error, setError] = useState('') // State for error messages

  // Fetch planner and destinations when component mounts or dependencies change
  useEffect(() => {
    const fetchPlanner = async () => {
      try {
        const response = await apiLib.get(`/planner/${plannerId}`, {
          params: { userId: ppUser._id },
        })
        if (response.data.success) {
          setPlanner(response.data.data) // Set planner details if fetch is successful
        } else {
          console.error('Failed to fetch planner:', response.data.message) // Log error message
        }
      } catch (error) {
        console.error('Error fetching planner:', error) // Log error if fetch fails
      }
    }

    const fetchDestinations = async () => {
      if (plannerId) {
        try {
          const response = await apiLib.get(`/planner/${plannerId}/destination`, {
            params: { userId: ppUser._id },
          })
          if (response.data.success) {
            setDestinations(response.data.data) // Set destinations if fetch is successful
            //fetch accommodations
            try {
              for (const dest of response.data.data) {
                const AccommodationResponse = await apiLib.get(
                  `/planner/${plannerId}/destination/${dest._id}/accommodation`,
                  {
                    params: { userId: ppUser._id },
                  },
                )
                if (AccommodationResponse.data.success) {
                  for (const accommodation of AccommodationResponse.data.data) {
                    setAccommodations((prev) => [...prev, accommodation]) // Set Accommodations if fetch is successful
                  }
                } else {
                  console.error('Failed to fetch accommodations:', response.data.message) // Log error message
                }
              }
            } catch (error) {
              console.error('Error fetching accommodations:', error) // Log error if fetch fails
            }

            //fetch activities
            try {
              for (const dest of response.data.data) {
                const ActivityResponse = await apiLib.get(`/planner/${plannerId}/destination/${dest._id}/activity`, {
                  params: { userId: ppUser._id },
                })
                if (ActivityResponse.data.success) {
                  for (const activity of ActivityResponse.data.data) {
                    setActivities((prev) => [...prev, activity]) // Set activities if fetch is successful
                  }
                } else {
                  console.error('Failed to fetch activities:', response.data.message) // Log error message
                }
              }
            } catch (error) {
              console.error('Error fetching activities:', error) // Log error if fetch fails
            }
          } else {
            console.error('Failed to fetch destinations:', response.data.message) // Log error message
          }
        } catch (error) {
          console.error('Error fetching destinations:', error) // Log error if fetch fails
        }
      }
    }

    const fetchTransportations = async () => {
      if (plannerId) {
        try {
          const response = await apiLib.get(`/planner/${plannerId}/transportation`, {
            params: { userId: ppUser._id },
          })
          if (response.data.success) {
            setTransportations(response.data.data) // Set transportations if fetch is successful
          } else {
            console.error('Failed to fetch transportations:', response.data.message) // Log error message
          }
        } catch (error) {
          console.error('Error fetching transportations:', error) // Log error if fetch fails
        }
      }
    }

    // const fetchAccommodations = async () => {
    //     if (plannerId) {
    //         try {
    //             if(destinations.length > 0){
    //                 for(const dest of destinations){
    //                     const response = await apiLib.get(`/planner/${plannerId}/destination/${dest._id}/accommodation`, {
    //                         params: { userId: ppUser._id }
    //                     });
    //                     if (response.data.success) {
    //                         setAccommodations(prev => [...prev, response.data.data]); // Set Accommodations if fetch is successful
    //                     } else {
    //                         console.error("Failed to fetch accommodations:", response.data.message); // Log error message
    //                     }
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Error fetching accommodations:", error); // Log error if fetch fails
    //         }
    //     }
    // };

    fetchPlanner() // Fetch planner data
    fetchDestinations() // Fetch destinations data after fetching planner
    fetchTransportations() // Fetch transportation data after fetching planner
    //fetchAccommodations()// Fetch Accommodations data after fetching destinations
  }, [plannerId, ppUser])

  // Validate if the provided date range is within the planner's date range
  const validateDateRange = (startDate, endDate) => {
    const plannerStart = new Date(planner.startDate)
    const plannerEnd = new Date(planner.endDate)
    return startDate >= plannerStart && endDate <= plannerEnd // Return true if valid
  }

  // Handle adding a new destination
  const handleAddDestination = async (e) => {
    e.preventDefault() // Prevent default form submission
    const startDate = new Date(destinationStartDate)
    const endDate = new Date(destinationEndDate)

    // Validate input fields
    if (!destinationName || !destinationStartDate || !destinationEndDate) {
      alert('Destination name, start date, and end date are required.') // Alert if fields are empty
      return
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      setError("Destination dates must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.post(`/planner/${plannerId}/destination`, {
        data: {
          name: destinationName,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          createdBy: ppUser._id,
        },
      })

      if (response.data.success) {
        setDestinations((prev) => [...prev, response.data.data]) // Update destinations state
        resetDestinationForm() // Reset form fields after successful addition
      } else {
        console.error('Error adding destination:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error adding destination:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle editing an existing destination
  const handleEditDestination = async (e) => {
    e.preventDefault() // Prevent default form submission
    const startDate = new Date(destinationStartDate)
    const endDate = new Date(destinationEndDate)

    // Validate input fields
    if (!destinationName || !destinationStartDate || !destinationEndDate) {
      alert('Destination name, start date, and end date are required.') // Alert if fields are empty
      return
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      setError("Destination dates must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.patch(
        `/planner/${plannerId}/destination/${editingDestinationId}?userId=${ppUser._id}`,
        {
          data: { name: destinationName, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        },
      )

      if (response.data.success) {
        // Update the destinations state with edited destination data
        setDestinations((prev) =>
          prev.map((dest) =>
            dest._id === editingDestinationId ?
              { ...dest, name: destinationName, startDate: startDate.toISOString(), endDate: endDate.toISOString() }
            : dest,
          ),
        )
        resetDestinationForm() // Reset form fields after successful edit
      } else {
        console.error('Error editing destination:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error editing destination:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle deleting a destination
  const handleDeleteDestination = async (destinationId) => {
    try {
      const response = await apiLib.delete(`/planner/${plannerId}/destination/${destinationId}`, {
        params: { userId: ppUser._id },
      })
      if (response.data.success) {
        setDestinations((prev) => prev.filter((dest) => dest._id !== destinationId)) // Update destinations state after deletion
        setError('') // Clear error message
      } else {
        console.error('Error deleting destination:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error deleting destination:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Reset destination form fields
  const resetDestinationForm = () => {
    setEditingDestinationId(null)
    setDestinationName('')
    setDestinationStartDate('')
    setDestinationEndDate('')
    setError('') // Clear any error messages
    setShowDestinationForm(false)
  }

  // Handle adding a new transportation
  const handleAddTransportation = async (e) => {
    e.preventDefault() // Prevent default form submission
    const startDate = new Date(transportationDepartureTime)
    const endDate = new Date(transportationArrivalTime)

    // Validate input fields
    if (
      !transportationType ||
      !transportationDetails ||
      !transportationDepartureTime ||
      !transportationArrivalTime ||
      !transportationVehicleId
    ) {
      alert('Transportation type, details, departure time, arrival time, and vehicle ID are required.') // Alert if fields are empty
      return
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      setError("Transportation dates must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.post(`/planner/${plannerId}/transportation`, {
        data: {
          type: transportationType,
          details: transportationDetails,
          departureTime: startDate.toISOString(),
          arrivalTime: endDate.toISOString(),
          vehicleId: transportationVehicleId,
          createdBy: ppUser._id,
        },
      })

      if (response.data.success) {
        setTransportations((prev) => [...prev, response.data.data]) // Update transportations state
        resetTransportationForm() // Reset form fields after successful addition
      } else {
        console.error('Error adding transportation:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error adding transportation:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle editing an existing transportation
  const handleEditTransportation = async (e) => {
    e.preventDefault() // Prevent default form submission
    const startDate = new Date(transportationDepartureTime)
    const endDate = new Date(transportationArrivalTime)

    // Validate input fields
    if (
      !transportationType ||
      !transportationDetails ||
      !transportationDepartureTime ||
      !transportationArrivalTime ||
      !transportationVehicleId
    ) {
      alert('Transportation type, details, departure time, arrival time, and vehicle ID are required.') // Alert if fields are empty
      return
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      setError("Transportation dates must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.patch(
        `/planner/${plannerId}/transportation/${editingTransportationId}?userId=${ppUser._id}`,
        {
          data: {
            type: transportationType,
            details: transportationDetails,
            departureTime: startDate.toISOString(),
            arrivalTime: endDate.toISOString(),
            vehicleId: transportationVehicleId,
          },
        },
      )

      if (response.data.success) {
        // Update the transportations state with edited transportation data
        setTransportations((prev) =>
          prev.map((transport) =>
            transport._id === editingTransportationId ?
              {
                ...transport,
                type: transportationType,
                details: transportationDetails,
                departureTime: startDate.toISOString(),
                arrivalTime: endDate.toISOString(),
                vehicleId: transportationVehicleId,
              }
            : transport,
          ),
        )
        resetTransportationForm() // Reset form fields after successful edit
      } else {
        console.error('Error editing transportation:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error editing transportation:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle deleting a transportation
  const handleDeleteTransportation = async (transportationId) => {
    try {
      const response = await apiLib.delete(`/planner/${plannerId}/transportation/${transportationId}`, {
        params: { userId: ppUser._id },
      })
      if (response.data.success) {
        setTransportations((prev) => prev.filter((transport) => transport._id !== transportationId)) // Update transportations state after deletion
        setError('') // Clear error message
      } else {
        console.error('Error deleting transportation:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error deleting transportation:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Reset destination form fields
  const resetTransportationForm = () => {
    setEditingTransportationId(null)
    setTransportationType('')
    setTransportationDetails('')
    setTransportationDepartureTime('')
    setTransportationArrivalTime('')
    setTransportationVehicleId('')
    setError('') // Clear any error messages
    setShowTransportationForm(false)
  }

  // Handle adding an accommodation
  const handleAddAccommodation = async (e) => {
    e.preventDefault() // Prevent default form submission
    const startDate = new Date(accommodationStartDate)
    const endDate = new Date(accommodationEndDate)

    // Validate input fields
    if (!accommodationName || !accommodationStartDate || !accommodationEndDate || !accommodationDestinationId) {
      alert('All fields are required for accommodation.') // Alert if fields are empty
      return
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      setError("Accommodation dates must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.post(
        `/planner/${plannerId}/destination/${accommodationDestinationId}/accommodation`,
        {
          data: {
            name: accommodationName,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            createdBy: ppUser._id, // Include the userId of the creator
            location: accommodationDestinationId, // Include the destination ID
          },
        },
      )

      if (response.data.success) {
        setAccommodations((prev) => [...prev, response.data.data]) // Update accommodations state
        resetAccommodationForm() // Reset form fields after successful addition
      } else {
        console.error('Error adding accommodation:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error adding accommodation:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle editing an existing accommodation
  const handleEditAccommodation = async (e) => {
    e.preventDefault() // Prevent default form submission
    const startDate = new Date(accommodationStartDate)
    const endDate = new Date(accommodationEndDate)

    // Validate input fields
    if (!accommodationName || !accommodationStartDate || !accommodationEndDate || !accommodationDestinationId) {
      alert('All fields are required for accommodation.') // Alert if fields are empty
      return
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      setError("Accommodation dates must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.patch(
        `/planner/${plannerId}/destination/${accommodationDestinationId}/accommodation/${editingAccommodationId}?userId=${ppUser._id}`,
        {
          data: {
            name: accommodationName,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            location: accommodationDestinationId,
          }, // Include the destination ID
        },
      )

      if (response.data.success) {
        // Update the accommodations state with edited accommodation data
        setAccommodations((prev) =>
          prev.map((accommodation) =>
            accommodation._id === editingAccommodationId ?
              {
                ...accommodation,
                name: accommodationName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                location: accommodationDestinationId,
              }
            : accommodation,
          ),
        )
        resetAccommodationForm() // Reset form fields after successful edit
      } else {
        console.error('Error editing accommodation:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error editing accommodation:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle deleting an accommodation
  const handleDeleteAccommodation = async (accommodationId, accommodationDestId) => {
    try {
      const response = await apiLib.delete(
        `/planner/${plannerId}/destination/${accommodationDestId}/accommodation/${accommodationId}`,
        {
          params: { userId: ppUser._id },
        },
      )
      if (response.data.success) {
        setAccommodations((prev) => prev.filter((accommodation) => accommodation._id !== accommodationId)) // Update accommodations state after deletion
        setError('') // Clear error message
      } else {
        console.error('Error deleting accommodation:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error deleting accommodation:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Reset accommodation form fields
  const resetAccommodationForm = () => {
    setEditingAccommodationId(null)
    setAccommodationName('')
    setAccommodationStartDate('')
    setAccommodationEndDate('')
    setAccommodationDestinationId('')
    setError('') // Clear any error messages
    setShowAccommodationForm(false)
  }

  const getDestinationName = (destinationId) => {
    const destination = destinations.find((dest) => dest._id === destinationId)
    return destination ? destination.name : 'No Location'
  }

  // Handle adding an activity
  const handleAddActivity = async (e) => {
    e.preventDefault() // Prevent default form submission
    const selectedDate = new Date(activityDate)

    // Validate input fields
    if (!activityName || !activityDate || !activityTime || !activityDestinationId) {
      alert('All fields are required for the activity.') // Alert if fields are empty
      return
    }

    // Validate that the activity date is within the planner's date range
    if (!validateDateRange(selectedDate, selectedDate)) {
      setError("Activity date must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.post(`/planner/${plannerId}/destination/${activityDestinationId}/activity`, {
        data: {
          name: activityName,
          startDate: selectedDate.toISOString(),
          duration: Number(activityTime),
          createdBy: ppUser._id, // Include the userId of the creator,
          location: activityDestinationId,
        }, // Include the destination ID
      })

      if (response.data.success) {
        setActivities((prev) => [...prev, response.data.data]) // Update activities state
        resetActivityForm() // Reset form fields after successful addition
      } else {
        console.error('Error adding activity:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error adding activity:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle editing an existing activity
  const handleEditActivity = async (e) => {
    e.preventDefault() // Prevent default form submission
    const selectedDate = new Date(activityDate)

    // Validate input fields
    if (!activityName || !activityDate || !activityTime || !activityDestinationId) {
      alert('All fields are required for the activity.') // Alert if fields are empty
      return
    }

    // Validate that the activity date is within the planner's date range
    if (!validateDateRange(selectedDate, selectedDate)) {
      setError("Activity date must be within the planner's date range.") // Set error message
      return
    }

    try {
      const response = await apiLib.patch(
        `/planner/${plannerId}/destination/${activityDestinationId}/activity/${editingActivityId}?userId=${ppUser._id}`,
        {
          data: {
            name: activityName,
            startDate: selectedDate.toISOString(),
            duration: Number(activityTime),
            location: activityDestinationId,
          }, // Include the destination ID
        },
      )

      if (response.data.success) {
        // Update the activity state with edited activity data
        setActivities((prev) =>
          prev.map((activity) =>
            activity._id === editingActivityId ?
              {
                ...activity,
                name: activityName,
                startDate: selectedDate.toISOString(),
                duration: Number(activityTime),
                location: activityDestinationId,
              }
            : activity,
          ),
        )
        resetActivityForm() // Reset form fields after successful edit
      } else {
        console.error('Error editing activity:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error editing activity:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle deleting an activity
  const handleDeleteActivity = async (activityId, activityDestId) => {
    try {
      const response = await apiLib.delete(
        `/planner/${plannerId}/destination/${activityDestId}/activity/${activityId}`,
        {
          params: { userId: ppUser._id },
        },
      )
      if (response.data.success) {
        setActivities((prev) => prev.filter((activity) => activity._id !== activityId)) // Update activities state after deletion
        setError('') // Clear error message
      } else {
        console.error('Error deleting activity:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error deleting activity:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Reset accommodation form fields
  const resetActivityForm = () => {
    setEditingActivityId(null)
    setActivityName('')
    setActivityDate('')
    setActivityTime('')
    setActivityDestinationId('')
    setError('') // Clear any error messages
    setShowActivityForm(false)
  }

  // Display loading message while fetching planner data
  if (!planner) {
    return <p>Loading...</p>
  }

  return (
    <div className="Page-color">
      <div className="List">
        <p />
        <h1>{planner.name}</h1>
        <div className="List-subheader">
          {planner.description}
          <p />
          {`${new Date(planner.startDate).toLocaleDateString()} To ${new Date(planner.endDate).toLocaleDateString()}`}
        </div>
        {/* <header className="Page-header">


                <button onClick={() => setShowAccommodationForm(!showAccommodationForm)}>
                    {showAccommodationForm ? "❌ Cancel" : "➕ Add Accommodation"}
                </button>
                {showAccommodationForm && (
                    <form onSubmit={handleAddAccommodation}>
                        <select 
                            onChange={(e) => setAccommodationDestinationId(e.target.value)} 
                            required
                        >
                            <option value="">Select Destination</option>
                            {destinations.map(dest => (
                                <option key={dest._id} value={dest._id}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={accommodationName}
                            onChange={(e) => setAccommodationName(e.target.value)}
                            placeholder="Accommodation Name"
                            required
                        />
                        <input
                            type="date"
                            value={accommodationStartDate}
                            onChange={(e) => setAccommodationStartDate(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            value={accommodationEndDate}
                            onChange={(e) => setAccommodationEndDate(e.target.value)}
                            required
                        />
                        <button type="submit">Add Accommodation</button>
                    </form>
                )}


                <button onClick={() => setShowActivityForm(!showActivityForm)}>
                    {showActivityForm ? "❌ Cancel" : "➕ Add Activity"}
                </button>
                {showActivityForm && (
                    <form onSubmit={handleAddActivity}>
                        <select 
                            onChange={(e) => setActivityDestinationId(e.target.value)} 
                            required
                        >
                            <option value="">Select Destination</option>
                            {destinations.map(dest => (
                                <option key={dest.destinationId} value={dest.destinationId}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            placeholder="Activity Name"
                            required
                        />
                        <input
                            type="date"
                            value={activityDate}
                            onChange={(e) => setActivityDate(e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            value={activityTime}
                            onChange={(e) => setActivityTime(e.target.value)}
                            required
                        />
                        <button type="submit">Add Activity</button>
                    </form>
                )}

                <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> 
            </header> */}

        <p />
        <div className="List-header">
          <BsFillMapFill /> Destinations
        </div>
        {
          destinations.length > 0 ?
            destinations.map((dest) => (
              <div className="List-item" key={dest._id}>
                <div>
                  <h3>{dest.name}</h3>
                  <h4>
                    {`${new Date(dest.startDate).toLocaleDateString()} To ${new Date(dest.endDate).toLocaleDateString()}`}
                  </h4>

                  {!isReadOnly && (
                    <div>
                      <button
                        className="Icon-button"
                        onClick={() => {
                          setEditingDestinationId(dest._id)
                          setDestinationName(dest.name)
                          setDestinationStartDate(dest.startDate.split('T')[0]) // Format date for input
                          setDestinationEndDate(dest.endDate.split('T')[0]) // Format date for input
                          setShowDestinationForm(true) // Show form for editing
                        }}
                      >
                        <BsPencilFill />
                      </button>
                      <button className="Icon-button" onClick={() => handleDeleteDestination(dest._id)}>
                        <BsTrashFill />
                      </button>
                      <VoteButtons id={dest._id} type="Destination" userId={ppUser._id} />
                      <CommentButton id={dest._id} type="Destination" userId={ppUser._id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          : <p>No destinations available.</p> // Display message if no destinations
        }

        {!isReadOnly && (
          <div>
            <button
              className="Icon-button"
              onClick={() => {
                setShowDestinationForm(true)
              }}
            >
              <BsFillPlusCircleFill />
            </button>
          </div>
        )}

        {showDestinationForm && (
          //create/edit destination modal
          <div className="modal">
            <div className="modal-content">
              <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
              <form
                onSubmit={editingDestinationId ? handleEditDestination : handleAddDestination}
                onReset={resetDestinationForm}
              >
                Destination Name:
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  placeholder="Destination Name"
                  required
                />
                <p />
                Start Date:
                <input
                  type="date"
                  value={destinationStartDate}
                  onChange={(e) => setDestinationStartDate(e.target.value)}
                  required
                />
                <p />
                End Date:
                <input
                  type="date"
                  value={destinationEndDate}
                  onChange={(e) => setDestinationEndDate(e.target.value)}
                  required
                />
                <p />
                <button type="reset">Cancel</button>
                <button type="submit">{editingDestinationId ? 'Update Destination' : 'Add Destination'}</button>
              </form>
            </div>
          </div>
        )}
        <p />

        <div className="List-header">
          <BiSolidPlane /> Transportation
        </div>
        {
          transportations.length > 0 ?
            transportations.map((transport) => (
              <div className="List-item" key={transport._id}>
                <div>
                  <h3>{transport.type}</h3>
                  <h4>
                    {transport.details}
                    <br />
                    {`Departure: ${new Date(transport.departureTime).toLocaleDateString()} at ${new Date(transport.departureTime).toLocaleTimeString()}`}
                    <br />
                    {`Arrival: ${new Date(transport.arrivalTime).toLocaleDateString()} at ${new Date(transport.arrivalTime).toLocaleTimeString()}`}
                    <br />
                    Vehicle ID: {transport.vehicleId}
                  </h4>

                  {!isReadOnly && (
                    <div>
                      <button
                        className="Icon-button"
                        onClick={() => {
                          setEditingTransportationId(transport._id)
                          setTransportationType(transport.type)
                          setTransportationDetails(transport.details)
                          setEditingTransportationId(transport._id)
                          setTransportationDepartureTime(transport.departureTime.split(':00.000Z')[0]) // Format date for input
                          setTransportationArrivalTime(transport.arrivalTime.split(':00.000Z')[0]) // Format date for input
                          setTransportationVehicleId(transport.vehicleId)
                          setShowTransportationForm(true) // Show form for editing
                        }}
                      >
                        <BsPencilFill />
                      </button>
                      <button className="Icon-button" onClick={() => handleDeleteTransportation(transport._id)}>
                        <BsTrashFill />
                      </button>
                      <VoteButtons id={transport._id} type="Transport" userId={ppUser._id} />
                      <CommentButton id={transport._id} type="Transport" userId={ppUser._id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          : <p>No transportation available.</p> // Display message if no transportation
        }

        {!isReadOnly && (
          <div>
            <button
              className="Icon-button"
              onClick={() => {
                setShowTransportationForm(true)
              }}
            >
              <BsFillPlusCircleFill />
            </button>
          </div>
        )}

        {showTransportationForm && (
          //create/edit transportation modal
          <div className="modal">
            <div className="modal-content">
              <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
              <form
                onSubmit={editingTransportationId ? handleEditTransportation : handleAddTransportation}
                onReset={resetTransportationForm}
              >
                Transportation Type:
                <input
                  type="text"
                  value={transportationType}
                  onChange={(e) => setTransportationType(e.target.value)}
                  placeholder="Transportation Type"
                  required
                />
                <p />
                Details:
                <input
                  type="text"
                  value={transportationDetails}
                  onChange={(e) => setTransportationDetails(e.target.value)}
                  placeholder="Transportation Details"
                  required
                />
                <p />
                Departure Time:
                <input
                  type="datetime-local"
                  value={transportationDepartureTime}
                  onChange={(e) => setTransportationDepartureTime(e.target.value)}
                  required
                />
                <p />
                Arrival Time:
                <input
                  type="datetime-local"
                  value={transportationArrivalTime}
                  onChange={(e) => setTransportationArrivalTime(e.target.value)}
                  required
                />
                <p />
                Vehicle ID:
                <input
                  type="text"
                  value={transportationVehicleId}
                  onChange={(e) => setTransportationVehicleId(e.target.value)}
                  placeholder="Vehicle ID"
                  required
                />
                <p />
                <button type="reset">Cancel</button>
                <button type="submit">
                  {editingTransportationId ? 'Update Transportation' : 'Add Transportation'}
                </button>
              </form>
            </div>
          </div>
        )}
        <p />

        <div className="List-header">
          <BiSolidBed /> Accommodations
        </div>
        {
          accommodations.length > 0 ?
            accommodations.map((accommodation) => (
              <div className="List-item" key={accommodation._id}>
                <div>
                  <h3>{accommodation.name}</h3>
                  <h4>
                    Location: {getDestinationName(accommodation.location)}
                    <br />
                    {`Check In: ${new Date(accommodation.startDate).toLocaleDateString()} at ${new Date(accommodation.startDate).toLocaleTimeString()}`}
                    <br />
                    {`Check Out: ${new Date(accommodation.endDate).toLocaleDateString()} at ${new Date(accommodation.endDate).toLocaleTimeString()}`}
                  </h4>

                  {!isReadOnly && (
                    <div>
                      <button
                        className="Icon-button"
                        onClick={() => {
                          setEditingAccommodationId(accommodation._id)
                          setAccommodationName(accommodation.name)
                          setAccommodationStartDate(accommodation.startDate.split(':00.000Z')[0]) // Format date for input
                          setAccommodationEndDate(accommodation.endDate.split(':00.000Z')[0]) // Format date for input
                          setAccommodationDestinationId(accommodation.location)
                          setShowAccommodationForm(true) // Show form for editing
                        }}
                      >
                        <BsPencilFill />
                      </button>
                      <button
                        className="Icon-button"
                        onClick={() => handleDeleteAccommodation(accommodation._id, accommodation.location)}
                      >
                        <BsTrashFill />
                      </button>
                      <VoteButtons id={accommodation._id} type="Accommodation" userId={ppUser._id} />
                      <CommentButton id={accommodation._id} type="Accommodation" userId={ppUser._id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          : <p>No accommodations available.</p> // Display message if no accommodations
        }

        {!isReadOnly && (
          <div>
            <button
              className="Icon-button"
              onClick={() => {
                setShowAccommodationForm(true)
              }}
            >
              <BsFillPlusCircleFill />
            </button>
          </div>
        )}

        {showAccommodationForm && (
          //create/edit accommodation modal
          <div className="modal">
            <div className="modal-content">
              <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
              <form
                onSubmit={editingAccommodationId ? handleEditAccommodation : handleAddAccommodation}
                onReset={resetAccommodationForm}
              >
                Accommodation Name:
                <input
                  type="text"
                  value={accommodationName}
                  onChange={(e) => setAccommodationName(e.target.value)}
                  placeholder="Accommodation Name"
                  required
                />
                <p />
                {!editingAccommodationId && (
                  <div>
                    Destination:
                    <select
                      onChange={(e) => setAccommodationDestinationId(e.target.value)}
                      value={accommodationDestinationId}
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((dest) => (
                        <option key={dest._id} value={dest._id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                    <p />
                  </div>
                )}
                Check In:
                <input
                  type="datetime-local"
                  value={accommodationStartDate}
                  onChange={(e) => setAccommodationStartDate(e.target.value)}
                  required
                />
                <p />
                Check Out:
                <input
                  type="datetime-local"
                  value={accommodationEndDate}
                  onChange={(e) => setAccommodationEndDate(e.target.value)}
                  required
                />
                <p />
                <button type="reset">Cancel</button>
                <button type="submit">{editingAccommodationId ? 'Update Accommodation' : 'Add Accommodation'}</button>
              </form>
            </div>
          </div>
        )}
        <p />

        <div className="List-header">
          <BiCalendarEvent /> Activities
        </div>
        {
          activities.length > 0 ?
            activities.map((activity) => (
              <div className="List-item" key={activity._id}>
                <div>
                  <h3>{activity.name}</h3>
                  <h4>
                    Location: {getDestinationName(activity.location)}
                    <br />
                    {`${new Date(activity.startDate).toLocaleDateString()} at ${new Date(activity.startDate).toLocaleTimeString()}`}
                    <br />
                    For {activity.duration} Hours
                  </h4>

                  {!isReadOnly && (
                    <div>
                      <button
                        className="Icon-button"
                        onClick={() => {
                          setEditingActivityId(activity._id)
                          setActivityName(activity.name)
                          setActivityDate(activity.startDate.split(':00.000Z')[0]) // Format date for input
                          setActivityTime(activity.duration)
                          setActivityDestinationId(activity.location)
                          setShowActivityForm(true) // Show form for editing
                        }}
                      >
                        <BsPencilFill />
                      </button>
                      <button
                        className="Icon-button"
                        onClick={() => handleDeleteActivity(activity._id, activity.location)}
                      >
                        <BsTrashFill />
                      </button>
                      <VoteButtons id={activity._id} type="Activity" userId={ppUser._id} />
                      <CommentButton id={activity._id} type="Activity" userId={ppUser._id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          : <p>No activities available.</p> // Display message if no activities
        }

        {!isReadOnly && (
          <div>
            <button
              className="Icon-button"
              onClick={() => {
                setShowActivityForm(true)
              }}
            >
              <BsFillPlusCircleFill />
            </button>
          </div>
        )}

        {showActivityForm && (
          //create/edit activity modal
          <div className="modal">
            <div className="modal-content">
              <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
              <form onSubmit={editingActivityId ? handleEditActivity : handleAddActivity} onReset={resetActivityForm}>
                Activity Name:
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Activity Name"
                  required
                />
                <p />
                {!editingActivityId && (
                  <div>
                    Destination:
                    <select
                      onChange={(e) => setActivityDestinationId(e.target.value)}
                      value={activityDestinationId}
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((dest) => (
                        <option key={dest._id} value={dest._id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                    <p />
                  </div>
                )}
                Start Time:
                <input
                  type="datetime-local"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  required
                />
                <p />
                Duration:
                <input
                  type="number"
                  value={activityTime}
                  onChange={(e) => setActivityTime(e.target.value)}
                  required
                />{' '}
                Hours
                <p />
                <button type="reset">Cancel</button>
                <button type="submit">{editingActivityId ? 'Update Activity' : 'Add Activity'}</button>
              </form>
            </div>
          </div>
        )}
        <p />
      </div>
      <p />
    </div>
  )
}

export default Planner // Export Planner component for use in other parts of the application
