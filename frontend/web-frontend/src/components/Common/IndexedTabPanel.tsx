import * as MUI from '@mui/material'
import React from 'react'

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export default function IndexedTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        height: '100%',
      }}
    >
      {value === index && (
        <MUI.Box
          sx={{
            p: 3,
            height: 'calc(100% - 16px)',
            overflowY: 'auto',
          }}
        >
          {children}
        </MUI.Box>
      )}
    </div>
  )
}
