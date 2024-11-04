import Button from '@mui/material/Button'
import { BsArrowRepeat } from 'react-icons/bs'
import { ThemeProvider } from '@mui/material/styles'
import './LoaderButton.css'
import React from 'react'

export default function LoaderButton({ className, disabled, isLoading, theme, ...props }) {
  return (
    <ThemeProvider theme={theme}>
      <Button disabled={disabled || isLoading} className={`LoaderButton ${className}`} {...props}>
        {isLoading && <BsArrowRepeat className="spinning" />}
        {props.children}
      </Button>
    </ThemeProvider>
  )
}
