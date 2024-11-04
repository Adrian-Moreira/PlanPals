import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsFillPlusCircleFill, BsPencilFill, BsTrashFill } from 'react-icons/bs'
import apiLib from '../lib/apiLib'
import { useAppContext } from '../lib/contextLib'
import { getCurrentUser } from '../lib/authLib'
import './Legacy.css'

const Planners = () => {
  const nav = useNavigate()
  const [plannerList, setPlannerList] = useState([])
  const [name, setName] = useState('') // State for planner name
  const [description, setDescription] = useState('') // State for planner description
  const [startDate, setStartDate] = useState('') // State for start date
  const [endDate, setEndDate] = useState('') // State for end date
  const [showForm, setShowForm] = useState(false) // State to toggle the form visibility
  const [editingPlannerId, setEditingPlannerId] = useState(null)
  const { ppUser, setCognitoUser, setPPUser } = useAppContext()
  const [fetchedPlanners, setFetchedPlanners] = useState(false)

  const fetchPlanners = useCallback(async () => {
    if (!ppUser || fetchedPlanners) return
    try {
      const response = await apiLib.get('/planner', { params: { userId: ppUser._id } })
      setPlannerList(response.data.data ?? [])
      setFetchedPlanners(true)
    } catch (error) {
      console.error('Error fetching planners:', error)
    }
  }, [ppUser, fetchedPlanners])

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

  useEffect(() => {
    fetchPlanners()
  }, [fetchPlanners])

  // Function to handle creating a new planner
  const handleCreatePlanner = async (e) => {
    e.preventDefault() // Prevent default form submission
    if (!name || !startDate || !endDate) {
      alert('Planner name, start date, and end date are required.')
      return
    }

    try {
      const response = await apiLib.post('/planner', {
        data: {
          createdBy: ppUser._id, // Use the logged-in user's ID
          name,
          description,
          startDate: new Date(startDate).toISOString(), // Convert to ISO string
          endDate: new Date(endDate).toISOString(), // Convert to ISO string
          destinations: [], // Optional
          transportations: [], // Optional
          roUsers: [], // Optional: Add if needed
          rwUsers: [],
        }, // Optional: Add if needed
      })

      if (response.data.success) {
        setPlannerList((prevPlanners) => [...prevPlanners, response.data.data]) // Append newly created planner to list
        // Reset the form fields
        resetForm()
      } else {
        console.error('Error creating planner:', response.data.message)
      }
    } catch (error) {
      console.error('Error creating planner:', error.response ? error.response.data : error.message)
    }
  }

  // Handle editing an existing planner
  const handleEditPlanner = async (e) => {
    e.preventDefault() // Prevent default form submission
    const plannerStartDate = new Date(startDate)
    const plannerEndDate = new Date(endDate)

    // Validate input fields
    if (!name || !startDate || !endDate) {
      alert('Planner name, start date, and end date are required.')
      return
    }

    try {
      const response = await apiLib.patch(`/planner/${editingPlannerId}?userId=${ppUser._id}`, {
        data: {
          name: name,
          description: description,
          startDate: plannerStartDate.toISOString(),
          endDate: plannerEndDate.toISOString(),
        },
      })

      if (response.data.success) {
        // Update the planners state with edited planner data
        setPlannerList((prev) =>
          prev.map((plan) =>
            plan._id === editingPlannerId ?
              {
                ...plan,
                name: name,
                description: description,
                startDate: plannerStartDate.toISOString(),
                endDate: plannerStartDate.toISOString(),
              }
            : plan,
          ),
        )
        resetForm() // Reset form fields after successful edit
      } else {
        console.error('Error editing planner:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error editing planner:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Handle deleting a planner
  const handleDeletePlanner = async (plannerId) => {
    try {
      const response = await apiLib.delete(`/planner/${plannerId}`, {
        params: { userId: ppUser._id },
      })
      if (response.data.success) {
        setPlannerList((prev) => prev.filter((plan) => plan._id !== plannerId)) // Update destinations state after deletion
      } else {
        console.error('Error deleting planner:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error deleting planner:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  // Reset form fields
  const resetForm = () => {
    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setShowForm(false)
  }

  return (
    <div>
      <header className="Page-header">
        <p>Your Planners:</p>
      </header>

      {showForm && ( // Show form only when `showForm` is true
        //create/edit planner modal
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={editingPlannerId ? handleEditPlanner : handleCreatePlanner} onReset={resetForm}>
              Planner Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Planner Name"
                required
              />
              <p />
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <p />
              Start Date:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <p />
              End Date:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              <p />
              <button type="reset">Cancel</button>
              <button type="submit">{editingPlannerId ? 'Update Planner' : 'Add Planner'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="List">
        <button
          className="List-button"
          onClick={() => {
            setShowForm(true)
          }}
        >
          Create Planner <BsFillPlusCircleFill />
        </button>
        {plannerList.length > 0 ?
          plannerList.map((planner) => (
            <div key={planner._id}>
              <Link className="List-button" to={`/planner/rw/${planner._id}`}>
                {planner.name}
              </Link>
              <button
                className="Icon-button"
                onClick={() => {
                  setName('')
                  setDescription('')
                  setStartDate('')
                  setEndDate('')
                  setEditingPlannerId(planner._id)
                  setName(planner.name)
                  setDescription(planner.description)
                  setStartDate(planner.startDate.split('T')[0]) // Format date for input
                  setEndDate(planner.endDate.split('T')[0]) // Format date for input
                  setShowForm(true) // Show form for editing
                }}
              >
                <BsPencilFill />
              </button>
              <button className="Icon-button" onClick={() => handleDeletePlanner(planner._id)}>
                <BsTrashFill />
              </button>
            </div>
          ))
        : <p>No planners available.</p>}
      </div>
    </div>
  )
}

export default Planners
