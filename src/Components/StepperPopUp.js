import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import Spinner from '../spinLoader/Spinner';
import Countdown from './CountDown';
import { getApprovalStatus, getOrders } from '../Services/apiOrders'; // Your function to get Approval status from Supabase
import useSupabaseRealtime from '../Services/useSupabaseRealtime';
import supabase from '../Services/Supabase';
import { getCurrentUserId } from '../Services/apiUsers';
import { useQuery } from '@tanstack/react-query';

const steps = ['Placing Order', 'Approval', 'Completed'];

export default function StepperPopUp({setShow, setCloseReadyMessage}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const countdownRef = React.useRef(null);

  const moveToNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const userId = getCurrentUserId()


  const { data: orders } = useQuery({
    queryKey: ['Orders'],
    queryFn: getOrders,
  });

  const currentOrders = orders?.filter((order) => order.userId === userId)

  useSupabaseRealtime('Orders', 'Orders')

  React.useEffect(() => {
    if (activeStep === 0) {
      setTimeout(() => {
        moveToNextStep(); 
      }, 3000);
    }
    else if(activeStep === 2){
      setTimeout(() => {
        setShow(false)
        setCloseReadyMessage(true)
      }, 2000);
    }

  }, [activeStep]);



  React.useEffect(() => {
    const checkApprovalStatus = async () => {
      if (activeStep === 1) {
        countdownRef.current.handleStart(); // Start the countdown when in Step 2
  
        // Check if all orders have an approval status other than 'Pending'
        const allOrdersApproved = currentOrders?.every(order => order.Approval === 'Accept');

        
        if (allOrdersApproved) {
          moveToNextStep(); 
        }
      }
    };
  
    checkApprovalStatus();
  }, [activeStep, orders]);
  

  const handleCountdownComplete = () => {
    // Move to step 3 if countdown completes
    moveToNextStep();
  };

  return (
    <>
      <div className="stepperContainer">
        <div className="bgColor"></div>
        <Box className='stepperBox' sx={{ width: '100%' }}>
        <h3 style={{color: 'red'}}>Don't Close App</h3>

          <Stepper nonLinear activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton disabled>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          <Typography sx={{ mt: 2, mb: 1, py: 1, textAlign: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {activeStep === 0 && (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Placing Order...
                </Typography>
                <Spinner />
              </>
            )}
            {activeStep === 1 && (
              <>
                <p>Please Wait...</p>
                <p>ShopOwner Approval Pending</p>
                <Countdown ref={countdownRef} onComplete={handleCountdownComplete}/>
              </>
            )}
            {activeStep === 2 && (
              <Typography sx={{ mt: 2, mb: 1 }}>
                Order Approved - Completed!
              </Typography>
            )}
          </Typography>
        </Box>
      </div>
    </>
  );
}
