import { Types } from 'mongoose'
import { LocationSchema, LocationModel } from '../models/Location'

interface LocationParams {
    _id: Types.ObjectId
    name: string
    address: string
    plannerId: Types.ObjectId
    createdBy: string
    createdAt: string
    updatedAt: string
}

  /**
   * Create a new location and return the created location with the id.
   * @param {Object} location - the location object to be created
   * @param {string} location.plannerId - the id of the planner
   * @param {string} location.name - the name of the location
   * @param {string} [location.address] - the address of the location
   * @param {string} location.createdBy - the id of the user who created the location
   * @returns {Promise<Object>} the created location with the id
   */
export async function createLocation({
  plannerId,
  name,
  address,
  createdBy,
}: LocationParams): Promise<object> {
  const location = {
    name: name,
    address: address,
    plannerId: plannerId,
    createdBy: createdBy,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  const createdLocation = await LocationModel.create(
    LocationSchema.parse(location),
  )

  return { id: createdLocation._id.toString(), ...createLocation }
}
  /**
   * Update a location and return the updated location with the id.
   * @param {Object} location - the location object to be updated
   * @param {string} location._id - the id of the location
   * @param {string} location.name - the new name of the location
   * @param {string} [location.address] - the new address of the location
   * @param {string} location.plannerId - the id of the planner
   * @param {string} location.createdBy - the id of the user who created the location
   * @returns {Promise<Object>} the updated location with the id
   */

  export async function updateLocation({
  _id,
  name,
  address,
  plannerId,
  createdBy,
}: LocationParams): Promise<object> {
  const location = {
    name: name,
    address: address,
    plannerId: plannerId,
    createdBy: createdBy,
    updatedAt: new Date().toISOString(),
  };

  const updatedLocation = await LocationModel.findOneAndUpdate(
    { _id },
    LocationSchema.parse(location),
    { new: true },
  )

  return { id: updatedLocation?._id.toString(), ...updatedLocation }
}

export async function deleteLocation({ _id }: LocationParams) {
  await LocationModel.deleteOne({ _id })
}
