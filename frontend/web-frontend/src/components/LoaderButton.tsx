import Button from '@mui/material/Button'
import { BsArrowRepeat } from 'react-icons/bs'
import './LoaderButton.css'
import React from 'react'

export default function LoaderButton({ className, disabled, isLoading, ...props }) {
  return (
    <Button disabled={disabled || isLoading} className={`LoaderButton ${className}`} {...props}>
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  )
}
