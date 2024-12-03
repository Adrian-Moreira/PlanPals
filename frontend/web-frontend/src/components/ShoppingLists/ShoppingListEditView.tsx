import React, { useCallback, useEffect, useInsertionEffect, useState } from 'react'
import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import { useFormFields } from '../../lib/hooksLib'
import apiLib from '../../lib/apiLib'
import { onError } from '../../lib/errorLib'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { PPUser, ppUserAtom } from '../../lib/authLib'
import AdaptiveDialog from '../Common/AdaptiveDialog'
import { userMapAtom } from '../../lib/appLib'
import { PPShoppingList } from './ShoppingList'

export interface ShoppingListEditViewProps {
  handelCancel: () => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  shoppingList: PPShoppingList
}

export default function ShoppingListCreateView(props: ShoppingListEditViewProps) {
  const nav = useNavigate()

  const [fields, handleFieldChange] = useFormFields({
    shoppingListName: props.shoppingList.name,
    shoppingListDescription: props.shoppingList.description,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [userMap] = useAtom(userMapAtom)
  const [pUser] = useAtom(ppUserAtom)
  const [pError, setPError] = useState(false)

  const validateShoppingListForm = useCallback(() => {
    const isNameValid = fields.shoppingListName.length > 0
    const isDescValid = fields.shoppingListDescription.length > 0
    setPError(!(isNameValid && isDescValid))
    return isNameValid && isDescValid
  }, [fields.shoppingListName, fields.shoppingListDescription])

  useEffect(() => {
    validateShoppingListForm()
  }, [validateShoppingListForm])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const res = await apiLib.patch(`/shoppingList/${props.shoppingList._id}`, {
        data: {
          name: fields.shoppingListName,
          description: fields.shoppingListDescription,
        },
      })

      if (res.data.success) {
        nav(`/shoppingList/${res.data.data._id}`)
      }
      setIsLoading(false)
    } catch (e) {
      onError(e)
    }
  }

  const renderEditShoppingList = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Stack spacing={2}>
            <MUI.TextField
              required
              id="shoppingListName"
              label="Shopping List Name"
              value={fields.shoppingListName}
              onChange={handleFieldChange}
            />
            <MUI.TextField
              id="shoppingListDescription"
              label="Shopping List Description"
              value={fields.shoppingListDescription}
              onChange={handleFieldChange}
            />
          </MUI.Stack>
        </MUI.Box>
      </MUI.Box>
    )
  }, [
    fields.shoppingListDescription,
    fields.shoppingListName,
    handleSubmit,
    props.open,
  ])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'EditShoppingList'}
      title={'Editing a Shopping List'}
      children={renderEditShoppingList()}
      cancelEnable={true}
      confirmEnable={true}
      confirmButtonLabel="Save and Continue"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmit(e)
        props.setOpen(false)
      }}
    ></AdaptiveDialog>
  )
}
