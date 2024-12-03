import CreateCard from '../Common/CreateCard'
import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { useFormFields } from '../../lib/hooksLib'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import apiLib from '../../lib/apiLib'
import { onError } from '../../lib/errorLib'
import AdaptiveDialog from '../Common/AdaptiveDialog'
import { PPShoppingList } from './ShoppingList'


export interface ItemCreateProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  shoppingList: PPShoppingList
}
export default function TransportCreate(props: ItemCreateProps) {

  const [isLoading, setIsLoading] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const [nError, setNError] = useState(false)
  const [lError, setLError] = useState(false)

  const [fields, handleFieldChange] = useFormFields({
    name: '',
    location: '',
  })

  const renderCreateItem = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
                <MUI.TextField
                required
                id="name"
                label="Item Name"
                value={fields.name}
                onChange={handleFieldChange}
              />
              <MUI.TextField
                required
                id="location"
                label="Available At"
                value={fields.location}
                onChange={handleFieldChange}
              />
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    )
  }, [fields.name, fields.location])

  const handleSubmitItem = useCallback(
    async (event: any) => {
      event.preventDefault()
      if (!pUser.ppUser) return
      try {
        const res = await apiLib.post(`/shoppingList/${props.shoppingList._id}/item`, {
          data: {
            addedBy: pUser.ppUser!._id,
            name: fields.name,
            location: fields.location
          },
        })
        if (res.data.success) {
          fields.vehicleId = ''
          fields.transportDetails = ''
        } else {
          throw new Error()
        }
      } catch (e) {
        onError('Erorr Creating Item. Please retry later!')
      }
    },
    [fields.name, fields.location, pUser.ppUser],
  )

  const validateCreateItemForm = useCallback(() => {
    const isNameValid = fields.name.length > 0
    setNError(!isNameValid)
    const isLocationValid = fields.location.length > 0
    setLError(!isLocationValid)
    return isNameValid && isLocationValid
  }, [fields.name, fields.location])

  useEffect(() => {
    validateCreateItemForm()
  }, [validateCreateItemForm])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'CreateNewItem'}
      title={'Creating a New Item'}
      children={renderCreateItem()}
      cancelEnable={true}
      confirmEnable={!nError && !lError}
      confirmButtonLabel="Add Item"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmitItem(e)
        props.setOpen(false)
      }}
    ></AdaptiveDialog>
  )
}