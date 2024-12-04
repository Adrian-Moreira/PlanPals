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
  const [palList, setPalList] = React.useState<PPUser[]>([])
  const [selectedPals, setSelectedPals] = React.useState<PPUser[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [userMap] = useAtom(userMapAtom)
  const [pUser] = useAtom(ppUserAtom)
  const [pError, setPError] = useState(false)

  const fetchPalList = useCallback(async () => {
    try {
      const res = await apiLib.get('/user/ls', {})
      const pals: PPUser[] = res.data.data
      pals.map((p) => userMap.set(p._id, p))
      setPalList(pals)
      return res.data.success ? pals : []
    } catch {
      console.error('No Users Fetched')
      return []
    }
  }, [])

  const validateShoppingListForm = useCallback(() => {
    const isNameValid = fields.shoppingListName.length > 0
    const isDescValid = fields.shoppingListDescription.length > 0
    setPError(!(isNameValid && isDescValid))
    return isNameValid && isDescValid
  }, [fields.shoppingListName, fields.shoppingListDescription])

  useEffect(() => {
    fetchPalList();
    validateShoppingListForm()
  }, [validateShoppingListForm])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setIsLoading(true)
    if(selectedPals.length > 0){
      try {
        const res = await apiLib.post(`/shoppingList/${props.shoppingList._id}/invite`, {
          data: {
            userIds: selectedPals.map((p) => p._id)
          },
        })
        if (res.data.success) {
          setSelectedPals([])
        }
      } catch (e) {
        onError(e)
      }
    }
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
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>

              <MUI.Typography variant="h6">Add Pals to plan together!</MUI.Typography>
              <MUI.Autocomplete
                multiple
                id="pals-selection"
                options={palList.filter((user) => user._id !== pUser.ppUser?._id)}
                value={selectedPals}
                onChange={(_, newValue) => setSelectedPals(newValue)}
                getOptionLabel={(option) => option.preferredName || option.userName}
                renderInput={(params) => (
                  <MUI.TextField {...params} variant="outlined" label="Select Pals" placeholder="Search pals..." />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const { key, ...otherProps } = getTagProps({ index })
                    return (
                      <MUI.Chip
                        key={option._id} // Use explicit key
                        label={option.preferredName || option.userName}
                        {...otherProps}
                        onDelete={() => {
                          const newSelected = selectedPals.filter((pal) => pal._id !== option._id)
                          setSelectedPals(newSelected)
                        }}
                      />
                    )
                  })
                }
              />
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    )
  }, [
    fields.shoppingListDescription,
    fields.shoppingListName,
    handleSubmit,
    props.open,
    palList,
    selectedPals,
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
