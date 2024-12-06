import React, { useCallback, useEffect, useState } from 'react';
import * as MUI from '@mui/material/';
import * as MUIcons from '@mui/icons-material';
import dayjs from 'dayjs';
import { useFormFields } from '../../lib/hooksLib';
import DatePickerValue from '../Common/DatePickerValue';
import TimePickerValue from '../Common/TimePickerValue';
import { combineDateAndTime } from '../../lib/dateLib';
import apiLib from '../../lib/apiLib';
import { onError } from '../../lib/errorLib';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { PPUser, ppUserAtom } from '../../lib/authLib';
import AdaptiveDialog from '../Common/AdaptiveDialog';
import { userMapAtom } from '../../lib/appLib';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useContext } from 'react';
import { NotificationContext } from '../../components/Notifications/notificationContext';

export interface PlannerCreateViewProps {
  handelCancel: () => void;
  hasPlanner: boolean;
  setOnReload: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlannerCreateView(props: PlannerCreateViewProps) {
  const nav = useNavigate();
  const theme = createTheme();
  const { setNotification } = useContext(NotificationContext);

  const [fields, handleFieldChange] = useFormFields({
    plannerName: '',
    plannerDescription: '',
    destinationName: '',
  });
  const today = new Date();
  const [startDate, setStartDate] = React.useState(dayjs(today));
  const [endDate, setEndDate] = React.useState(dayjs(today));
  const [startTime, setStartTime] = React.useState(dayjs(today));
  const [endTime, setEndTime] = React.useState(dayjs(today));
  const [palList, setPalList] = React.useState<PPUser[]>([]);
  const [selectedPals, setSelectedPals] = React.useState<PPUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userMap] = useAtom(userMapAtom);
  const [pUser] = useAtom(ppUserAtom);
  const [pError, setPError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const fetchPalList = useCallback(async () => {
    try {
      const res = await apiLib.get('/user/ls', {});
      const pals: PPUser[] = res.data.data;
      pals.map((p) => userMap.set(p._id, p));
      setPalList(pals);
      return res.data.success ? pals : [];
    } catch {
      console.error('No Users Fetched');
      return [];
    }
  }, []);

  const validatePlannerForm = useCallback(() => {
    const isNameValid = fields.plannerName.length > 0;
    setPError(!isNameValid);
    const isTimeValid =
      startDate.isBefore(endDate)
    setTimeError(!isTimeValid);
    return isNameValid && isTimeValid;
  }, [fields.plannerName, startDate, endDate, startTime, endTime]);

  useEffect(() => {
    fetchPalList();
  }, []);

  useEffect(() => {
    validatePlannerForm();
  }, [fields.plannerName, startDate, endDate, endTime, startTime]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiLib.post('/planner', {
        data: {
          createdBy: pUser.ppUser!._id,
          name: fields.plannerName,
          description: fields.plannerDescription,
          startDate: combineDateAndTime(startDate, startTime).toISOString(),
          endDate: combineDateAndTime(endDate, endTime).toISOString(),
          rwUsers: selectedPals.map((p) => p._id),
        },
      });
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Planner created successfully!' });
        props.setOnReload(true);
        nav(`/planner/${res.data.data._id}`);
      } else {
        setNotification({ type: 'error', message: 'Failed to create planner. Please try again.' });
      }
      setIsLoading(false);
    } catch (e) {
      setNotification({ type: 'error', message: 'An error occurred while creating the planner.' });
      onError(e);
    }
  };

  const renderCreatePlanner = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Stack spacing={2}>
            <MUI.TextField
              required
              error={pError}
              helperText={pError && 'Name cannot be blank.'}
              id="plannerName"
              label="Planner Name"
              value={fields.plannerName}
              onChange={handleFieldChange}
            />
            <MUI.TextField
              id="plannerDescription"
              label="Planner Description"
              value={fields.plannerDescription}
              onChange={handleFieldChange}
            />
            <MUI.Typography variant="h6">Select Dates</MUI.Typography>
            <MUI.Box sx={{ display: 'flex', flexGrow: 1, flexDirection: { xs: 'column', md: 'row' } }}>
              <MUI.Stack sx={{ flex: 1, m: '0.5em 0.5em' }} spacing={2}>
              {timeError && (
                <MUI.Typography color="error" variant="subtitle1">
                  Start date must be before the end date.
                </MUI.Typography>
              )}
                <DatePickerValue label={'From'} field={startDate} setField={setStartDate}></DatePickerValue>
                <TimePickerValue label={'From'} field={startTime} setField={setStartTime}></TimePickerValue>
              </MUI.Stack>
              <MUI.Stack sx={{ flex: 1, m: '0.5em 0.5em' }} spacing={2}>
                <DatePickerValue label={'To'} field={endDate} setField={setEndDate}></DatePickerValue>
                <TimePickerValue label={'To'} field={endTime} setField={setEndTime}></TimePickerValue>
              </MUI.Stack>
            </MUI.Box>
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
                    const { key, ...otherProps } = getTagProps({ index });
                    return (
                      <MUI.Chip
                        key={option._id}
                        label={option.preferredName || option.userName}
                        {...otherProps}
                        onDelete={() => {
                          const newSelected = selectedPals.filter((pal) => pal._id !== option._id);
                          setSelectedPals(newSelected);
                        }}
                      />
                    );
                  })
                }
              />
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    );
  }, [
    startDate,
    endDate,
    startTime,
    endTime,
    fields.destinationName,
    fields.plannerDescription,
    fields.plannerName,
    handleSubmit,
    props.hasPlanner,
    props.open,
    props.setOnReload,
    palList,
    selectedPals,
  ]);

  return (
        <AdaptiveDialog
          open={props.open}
          setOpen={props.setOpen}
          label={'CreateNewPlanner'}
          title={'Creating a New Planner'}
          children={renderCreatePlanner()}
          cancelEnable={props.hasPlanner}
          confirmEnable={!pError && !timeError}
          confirmButtonLabel="Save and Continue"
          confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
          cancelButtonLabel="Cancel"
          cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
          onConfirmHandler={(e) => {
            handleSubmit(e);
          }}
        ></AdaptiveDialog>
  );
}
