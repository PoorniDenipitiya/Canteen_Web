import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import config from '../config/appConfig';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from './MainCard';
import Transitions from './Transitions';
import { BellOutlined, MessageOutlined } from '@ant-design/icons';

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [readPairs, setReadPairs] = useState(() => {
    const stored = localStorage.getItem('readNotificationPairs');
    return stored ? JSON.parse(stored) : [];
  });
  const [statusTimes, setStatusTimes] = useState(() => {
    const stored = localStorage.getItem('notificationStatusTimes');
    return stored ? JSON.parse(stored) : {};
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserOrdersAndComplaints = async () => {
      try {
        // Fetch orders
  const resOrders = await axios.get(`${config.api_base_urls.user}/api/orders`, { withCredentials: true });
        const orders = Array.isArray(resOrders.data) ? resOrders.data : [];
        // Fetch complaints
  const resComplaints = await axios.get(`${config.api_base_urls.user}/api/complaints`, { withCredentials: true });
        const complaints = Array.isArray(resComplaints.data) ? resComplaints.data : [];

        // Track status change times for both
        let updatedStatusTimes = { ...statusTimes };
        orders.forEach(o => {
          if (!o.status || o.status.toLowerCase() === 'order placed') return;
          const key = `order_${o._id}_${o.status}`;
          if (!updatedStatusTimes[key]) {
            updatedStatusTimes[key] = Date.now();
          }
        });
        complaints.forEach(c => {
          if (!c.status || c.status.toLowerCase() === 'pending') return;
          const key = `complaint_${c._id}_${c.status}`;
          if (!updatedStatusTimes[key]) {
            updatedStatusTimes[key] = Date.now();
          }
        });
        // Save to localStorage if changed
        if (JSON.stringify(updatedStatusTimes) !== JSON.stringify(statusTimes)) {
          setStatusTimes(updatedStatusTimes);
          localStorage.setItem('notificationStatusTimes', JSON.stringify(updatedStatusTimes));
        }
        // Filter notifications for orders
        const filteredOrders = orders.filter(o => {
          if (!o.status || o.status.toLowerCase() === 'order placed') return false;
          return !readPairs.some(pair => pair.type === 'order' && pair.id === o._id && pair.status === o.status);
        }).map(o => ({ ...o, notificationType: 'order' }));
        // Filter notifications for complaints
        const filteredComplaints = complaints.filter(c => {
          if (!c.status || c.status.toLowerCase() === 'pending') return false;
          return !readPairs.some(pair => pair.type === 'complaint' && pair.id === c._id && pair.status === c.status);
        }).map(c => ({ ...c, notificationType: 'complaint' }));
        // Combine notifications
        const allNotifications = [...filteredOrders, ...filteredComplaints];
        setNotifications(allNotifications);
        setCount(allNotifications.length);
      } catch (err) {
        setNotifications([]);
        setCount(0);
      }
    };
    fetchUserOrdersAndComplaints();
    const interval = setInterval(fetchUserOrdersAndComplaints, 2000);
    return () => clearInterval(interval);
  }, [readPairs, statusTimes]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleNotificationClick = (id, status, type) => {
    const updatedReadPairs = [...readPairs, { id, status, type }];
    setReadPairs(updatedReadPairs);
    localStorage.setItem('readNotificationPairs', JSON.stringify(updatedReadPairs));
    if (type === 'order') {
      window.location.href = '/myorder';
    } else if (type === 'complaint') {
      window.location.href = '/complaint';
    }
  };
  // Remove background color change on open
  const iconBackColorOpen = 'transparent';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: '#fff', bgcolor: 'transparent' }}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={count} color="primary">
          <BellOutlined style={{ color: '#fff' }} />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows?.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {notifications.length === 0 && (
                      <ListItemButton>
                        <ListItemText primary={<Typography variant="body2">No notifications</Typography>} />
                      </ListItemButton>
                    )}
                    {notifications.map(n => (
                      <ListItemButton key={n._id} onClick={() => handleNotificationClick(n._id, n.status, n.notificationType)}>
                        <ListItemAvatar>
                          <Avatar sx={{ color: n.notificationType === 'order' ? 'primary.main' : 'secondary.main', bgcolor: n.notificationType === 'order' ? 'primary.lighter' : 'secondary.lighter' }}>
                            <MessageOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontSize: '0.95rem' }}>{n.notificationType === 'order' ? `Order ${n.orderId} - ${n.status}` : `Complaint ${n.orderId || n._id} - ${n.status}`}</Typography>}
                          secondary={<Typography variant="caption" sx={{ fontSize: '0.8rem' }}>{(() => {
                            const key = `${n.notificationType}_${n._id}_${n.status}`;
                            const time = statusTimes[key] ? new Date(statusTimes[key]) : new Date();
                            return time.toLocaleDateString();
                          })()}</Typography>}
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem' }}>
                            {(() => {
                              const key = `${n.notificationType}_${n._id}_${n.status}`;
                              const time = statusTimes[key] ? new Date(statusTimes[key]) : new Date();
                              return time.toLocaleTimeString();
                            })()}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
