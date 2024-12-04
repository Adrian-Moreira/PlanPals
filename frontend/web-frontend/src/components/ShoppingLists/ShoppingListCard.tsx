import * as MUI from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

ShoppingListCard.propTypes = {
  shoppingList: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    createdBy: PropTypes.object.isRequired,
  }).isRequired,
}

export default function ShoppingListCard({ className, shoppingList, onClick, ...props }) {
  return (
    <MUI.Card
      onClick={onClick}
      sx={{ minWidth: { xs: '90vw', sm: '44vw', md: '30vw', lg: '22vw', xl: '20vw' } }}
      className={`ShoppingListCard ${className}`}
      {...props}
    >
      <MUI.CardActionArea>
        <MUI.CardContent>
          <MUI.Typography variant="h6">{shoppingList.name}</MUI.Typography>
          <MUI.Typography variant="subtitle1">{`${shoppingList.createdBy.preferredName}`}</MUI.Typography>
          <MUI.Typography>{shoppingList.description}</MUI.Typography>
        </MUI.CardContent>
      </MUI.CardActionArea>
      {props.children}
    </MUI.Card>
  )
}