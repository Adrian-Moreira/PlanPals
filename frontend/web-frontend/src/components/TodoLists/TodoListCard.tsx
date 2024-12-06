import * as MUI from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

TodoListCard.propTypes = {
  todoList: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    createdBy: PropTypes.object.isRequired,
  }).isRequired,
}

export default function TodoListCard({ className, todoList, onClick, ...props }) {
  return (
    <MUI.Card
      onClick={onClick}
      sx={{ minWidth: { xs: '90vw', sm: '44vw', md: '30vw', lg: '22vw', xl: '20vw' } }}
      className={`TodoListCard ${className}`}
      {...props}
    >
      <MUI.CardActionArea>
        <MUI.CardContent>
          <MUI.Typography variant="h6">{todoList.name}</MUI.Typography>
          <MUI.Typography variant="subtitle1">{`${todoList.createdBy.preferredName}`}</MUI.Typography>
          <MUI.Typography>{todoList.description}</MUI.Typography>
        </MUI.CardContent>
      </MUI.CardActionArea>
      {props.children}
    </MUI.Card>
  )
}