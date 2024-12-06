import * as React from 'react'
import LoginIcon from '@mui/icons-material/Login'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { ThemeProvider } from '@mui/material/styles'
import './AppBar.css'
import { PopoverVirtualElement } from '@mui/material'
const pages = ['About', 'Planners', 'Shopping Lists']
const welcome = [
  'Login',
  //, 'Signup'
]
const settings = [
  // 'Profile', 'Account',
  // 'Inbox',
  'Logout',
]

function ResponsiveAppBar({
  title,
  theme,
  handleLogout,
  handleLogin,
  handleSignup,
  handleAbout,
  handlePlanners,
  handleShoppingLists,
  handleTodoLists,
  backToHomeHandler,
  ppUser,
}) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const [anchorElWelcome, setAnchorElWelcome] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleOpenWelcomeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElWelcome(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleCloseWelcomeMenu = () => {
    setAnchorElWelcome(null)
  }

  const mkItemHandler =
    (item = '', closeMenuHandler: () => void) =>
    () => {
      switch (item) {
        case 'Profile':
        case 'Account':
        case 'Inbox':
        case 'Planners':
          handlePlanners()
          break
        case 'Shopping Lists':
          handleShoppingLists()
          break
        // case 'To-do Lists':
        //   handleTodoLists()
        //   break
        case 'About':
          handleAbout()
          break
        case 'Signup':
          handleSignup()
          break
        case 'Login':
          handleLogin()
          break
        case 'Logout':
          handleLogout()
          break
        default:
          break
      }
      closeMenuHandler()
    }

  const mkDropDownMenu = (
    navItems: string[],
    label: string,
    flexGrow: number,
    elementId: string | undefined,
    anchorElement: Element | PopoverVirtualElement | (() => Element) | (() => PopoverVirtualElement) | null | undefined,
    onClick: (event: React.MouseEvent<HTMLElement>) => any,
    onClose: () => any,
  ) => (
    <Box sx={{ flexGrow: flexGrow, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size="large"
        aria-label={label}
        aria-controls={elementId}
        aria-haspopup="true"
        onClick={onClick}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id={elementId}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElement)}
        onClose={onClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {navItems.map((item) => (
          <MenuItem key={item} onClick={mkItemHandler(item, onClose)}>
            <Typography sx={{ textAlign: 'center' }}>{item}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )

  const mkTitle = (tit: string, display, flexGrow) => (
    <Typography
      variant="h5"
      noWrap
      component="a"
      onClick={backToHomeHandler}
      sx={{
        ':hover': { cursor: 'pointer' },
        marginLeft: '1em',
        marginRight: '1em',
        display: display,
        flexGrow: flexGrow,
        fontWeight: 700,
        letterSpacing: '.1rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {tit}
    </Typography>
  )

  const mkNavMenu = (items: string[], flexGrow: number) => (
    <Box sx={{ flexGrow: flexGrow, display: { xs: 'none', md: 'flex' } }}>
      {items.map((page) => (
        <Button
          key={page}
          onClick={mkItemHandler(page, handleCloseNavMenu)}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {page}
        </Button>
      ))}
    </Box>
  )

  const mkWelcomeMenu = (
    navItems: string[],
    label: string,
    flexGrow: number,
    elementId: string | undefined,
    anchorElement: Element | (() => Element) | PopoverVirtualElement | (() => PopoverVirtualElement) | null | undefined,
    onClick: (event: React.MouseEvent<HTMLElement>) => any,
    onClose: () => any,
  ) => (
    <Box sx={{ flexGrow: flexGrow, display: { xs: 'flex', md: 'none' } }}>
      <Tooltip title="Click here to signup or login">
        <IconButton
          size="large"
          aria-label={label}
          aria-controls={elementId}
          aria-haspopup="true"
          onClick={onClick}
          color="inherit"
        >
          <LoginIcon />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '3.5em', ml: '0.5em' }}
        id={label}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        open={Boolean(anchorElement)}
        onClose={onClose}
      >
        {navItems.map((item) => (
          <MenuItem key={item} onClick={mkItemHandler(item, onClose)}>
            <Typography sx={{ textAlign: 'center' }}>{item}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )

  const renderAppBarWelcome = () => {
    return (
      <>
        {mkNavMenu(welcome, 0)}
        {mkWelcomeMenu(
          welcome,
          'PPWelcome',
          0,
          'menu-appbar-welcome',
          anchorElWelcome,
          handleOpenWelcomeMenu,
          handleCloseWelcomeMenu,
        )}
      </>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" className="PPAppBar">
        <Container maxWidth="xl">
          <Toolbar sx={{ mt: { xs: '0.2em', md: '0' } }} disableGutters={true}>
            {mkTitle(title, { xs: 'none', md: 'flex' }, 0)}
            {mkDropDownMenu(pages, 'PPMenu', 1, 'menu-appbar-nav', anchorElNav, handleOpenNavMenu, handleCloseNavMenu)}
            {mkTitle(title, { xs: 'flex', md: 'none' }, 1)}
            {mkNavMenu(pages, 1)}

            {ppUser.loggedIn ?
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="" src="" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '3.5em', ml: '0.5em' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={mkItemHandler(setting, handleCloseUserMenu)}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            : renderAppBarWelcome()}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  )
}
export default ResponsiveAppBar
