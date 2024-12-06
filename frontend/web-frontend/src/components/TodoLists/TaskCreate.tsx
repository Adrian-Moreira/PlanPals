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
import { PPTodoList } from './TodoList'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import DatePickerValue from '../Common/DatePickerValue'
import TimePickerValue from '../Common/TimePickerValue'


export interface TaskCreateProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  todoList: PPTodoList
}
export default function TaskCreate(props: TaskCreateProps) {
  const nav = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const [nError, setNError] = useState(false)
  const today = new Date();
  const [startDate, setStartDate] = React.useState(dayjs(today));
  const [startTime, setStartTime] = React.useState(dayjs(today));

  const [fields, handleFieldChange] = useFormFields({
    name: '',
  })

  const renderCreateTask = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
                <MUI.TextField
                required
                error={nError}
                helperText={nError && 'Name cannot be blank.'}
                id="name"
                label="Task Name"
                value={fields.name}
                onChange={handleFieldChange}
              />
              <DatePickerValue label={'Finish by'} field={startDate} setField={setStartDate}></DatePickerValue>
              <TimePickerValue label={'Finish by'} field={startTime} setField={setStartTime}></TimePickerValue>
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    )
  }, [fields.name, startDate, startTime, nError])

  const handleSubmitTask = useCallback(
    async (event: any) => {
      event.preventDefault()
      if (!pUser.ppUser) return
      try {
        const res = await apiLib.post(`/todoList/${props.todoList._id}/task`, {
          data: {
            createdBy: pUser.ppUser!._id,
            name: fields.name,
            dueDate: startTime,
            isCompleted: false,
            assignedTo: pUser.ppUser!._id
          },
        })
        if (res.data.success) {
          fields.name = ''
          setNError(false)
          //Hacked in fix to todo list refresh
          nav(`/todoLists`)
        } else {
          throw new Error()
        }
      } catch (e) {
        onError('Erorr Creating Task. Please retry later!')
      }
    },
    [fields.name, startTime, pUser.ppUser],
  )

  const validateCreateTaskForm = useCallback(() => {
    const isNameValid = fields.name.length > 0
    setNError(!isNameValid)
    return isNameValid
  }, [fields.name])

  useEffect(() => {
    validateCreateTaskForm()
  }, [fields.name])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'CreateNewTask'}
      title={'Creating a New Task'}
      children={renderCreateTask()}
      cancelEnable={true}
      confirmEnable={!nError}
      confirmButtonLabel="Add Task"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmitTask(e)
        props.setOpen(false)
      }}
    ></AdaptiveDialog>
  )
}