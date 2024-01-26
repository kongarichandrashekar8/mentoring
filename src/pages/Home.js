import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Card, CardContent, CircularProgress, Container, Stack } from '@mui/material';
import { Link, redirect, useNavigate } from 'react-router-dom';
import Profile from '../components/profile/Profile';
import arrow from './arrow2.gif'
import Header from './Header';
import ProfileDisplay from '../components/ProfileDisplay';
import { useSelector,useDispatch } from 'react-redux';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import endpoint from '../API/api';
import { saveLifeCycle, saveUserObj, setAuth } from '../features/UserSlice';
import Loading from '../components/Loading';
import AlertComponent from '../components/AlertComponent';
import LifeCycle from '../components/LifeCycle';
import ProfileProgressBar from './ProfileProgressBar';
export default function HomePage() {
    const navigate=useNavigate()

    const dispatch=useDispatch()
    const [userObj,setUserObj]=React.useState({})

    // const userObj=useSelector(state=>state.userObj)


    const [mentorDetails,setMentorDetails]=React.useState({})
    const [menteeList,setMenteesList]=React.useState([])
    const [detailsOf,setDetailsOf]=React.useState('')


    const handleProfilepage=()=>{
      navigate('/profile')
    }
    
    const getMentorDetails=async(signeduser)=>{
      console.log('user obj ',signeduser)
      const mentorid=signeduser.matchedWith
      console.log(mentorid)
      const obj={
        'mentorid':mentorid
      }
      try {
        const response = await axios.get(`${endpoint}/getmentordetails?mentorid=${mentorid}`);
      
            if (response.status === 200) {
              const a=true
              // dispatch(setAuth(a))
              const user=response.data.mentor
              console.log('mentor details ',user)
              if(user==null){
                setDisplayMessage('We will update, once mentor matched')
                setMatched(false)
                setLoadingmentorormentees(false)
              }
              else{
                setMentorDetails(response.data.mentor)
                
                setMatched(true)
                setLoadingmentorormentees(false)
                
              }
            } else {
              console.error('Failed to submit user data.');
              setDisplayMessage('We will update, once mentor matched')
                setMatched(false)
                setLoadingmentorormentees(false)
              }
            } catch (error) {
            console.error('Error:', error);
            setDisplayMessage('We will update, once mentor matched')
                setMatched(false)
                setLoadingmentorormentees(false)
            }

      dispatch(setAuth(true))

      setLoading(false)
      
        
      
    }

    const getMenteesDetails=async(signeduser)=>{

      const menteesids=signeduser.menteeslist
      // console.log(mentorid)
      // const obj={
      //   'mentorid':mentorid
      // }
      try {
        const response = await axios.get(`${endpoint}/getmenteesdetails?menteesids=${menteesids}`);
      
            if (response.status === 200) {
              const a=true
              // dispatch(setAuth(a))
              const user=response.data
              console.log('mentees details ',user)
              if(user==null){
                setDisplayMessage('We will update, once matched')
                setMatched(false)
                setLoadingmentorormentees(false)
              }
              else{
                setMenteesList(response.data.mentees)
                
                setMatched(true)
                setLoadingmentorormentees(false)
                
              }
            } else {
              console.error('Failed to submit user data.');
              setDisplayMessage('We will update, once mentor matched')
                setMatched(false)
                setLoadingmentorormentees(false)
              }
            } catch (error) {
            console.error('Error:', error);
            setDisplayMessage('We will update, once mentor matched')
                setMatched(false)
                setLoadingmentorormentees(false)
            }
      
        
      
    }

    const [profilePercentage,setProfilePercentage]=React.useState()
    const [completedFields,setCompletedFields]=React.useState()
    const [totalFields,setTotalFields]=React.useState()

    const getUserDetails=async()=>{

      const userid=localStorage.getItem('userid')
      setLoading(true)

      // const mentorid=userObj.matchedWith
      console.log(userid)
      const obj={
        'userid':userid
      }
      try {
        const response = await axios.get(`${endpoint}/getuserdetails?userid=${userid}`);
      
            if (response.status === 200) {
              const a=true
              // dispatch(setAuth(a))
              const user=response.data
              console.log('user details ',user)
              if(user==null){
                localStorage.setItem('userid','')
                localStorage.setItem('auth','')
                navigate('/')
              }
              else{
                setUserObj(response.data)
                dispatch(saveUserObj(response.data))
                dispatch(saveLifeCycle(response.data.lifeCycle))

                const obj=response.data
                var uncom=0
                var tot=0
                Object.keys(obj).forEach(key => {
                  const value = obj[key];
                  if(typeof value ==='object'){
                    if(Object.keys(value).length==0){
                      uncom=uncom+1
                    }
                  }else if(Array.isArray(value)){
                    if(value.length==0){
                      uncom=uncom+1
                    }
                  }else{
                    if(value==''){
                      uncom=uncom+1
                    }
                  }
                  
                  tot=tot+1
                });
                setCompletedFields(tot-uncom)
                setTotalFields(tot-4)
                const percentageCompleted = ((tot-uncom) / (tot-4)) * 100;
                setProfilePercentage(((tot-uncom) / (tot-4)) * 100)

                console.log('com',tot,uncom)

                console.log('percentageCompleted ',percentageCompleted)




                console.log('i am here')
                const mentee=response.data.mentee
                const mentor=response.data.mentor
                if(mentee=='true'){
                  setDetailsOf("Mentor ")
                  if(response.data.matched=='true'){
                    getMentorDetails(response.data)

                  }else{
                    setDisplayMessage('We will update, once the matche is made')
                    setMatched(false)
                    setLoadingmentorormentees(false)
                  }
                }
                else if(mentor=='true'){
                  setDetailsOf('Mentee(s) ')
                  const listlen=response.data.menteeslist.length
                  
                  if(listlen==0){
                    setDisplayMessage('We will update, once the matche is made')
                    setMatched(false)
                    setLoadingmentorormentees(false)

                  }else{
                    getMenteesDetails(response.data)
                  }

          }
                
                
                
              }
            } else {
              console.error('Failed to submit user data.');
              localStorage.setItem('userid','')
                localStorage.setItem('auth','')
                navigate('/')
              }
            } catch (error) {
            console.error('Error:', error);
            localStorage.setItem('userid','')
                localStorage.setItem('auth','')
                navigate('/')
            }
      setLoading(false)
        
      
    }





    React.useEffect(()=>{
      setLoading(true)


      const auth=localStorage.getItem('auth')
      console.log('auth ',auth)
      if(auth!='true'){
        navigate('/')
        return
      }
      const userid=localStorage.getItem('userid')
      console.log('userid ',userid)
      if(userid=='' || userid==null){
        navigate('/')
        return
      }
      console.log('userObj ',userObj)

      if(Object.keys(userObj).length === 0){
        getUserDetails()
      }
      else{
        setLoadingmentorormentees(true)
        if(userObj==null){
          navigate('/')
        }
        else{
          console.log('i am here')
          const mentee=userObj.mentee
          const mentor=userObj.mentor
          if(mentee=='true'){
            setDetailsOf("Mentor ")
            if(userObj.matched=='true'){
              getMentorDetails()

            }else{
              setDisplayMessage('We will update, once the matche is made')
              setMatched(false)
              setLoadingmentorormentees(false)
            }
          }
          else if(mentor=='true'){
            setDetailsOf('Mentee(s) ')
            const listlen=userObj.menteeslist.length
            
            if(listlen==0){
              setDisplayMessage('We will update, once the matche is made')
              setMatched(false)
              setLoadingmentorormentees(false)

            }else{
              getMenteesDetails()
            }

          }
        }

       
      }



    },[])

    // React.useEffect(()=>{
    //   setLoadingmentorormentees(true)
    //   if(userObj==null){
    //     navigate('/')
    //   }
    //   else{
    //     const mentee=userObj.mentee
    //     const mentor=userObj.mentor
    //     if(mentee=='true'){
    //       setDetailsOf("Mentor ")
    //       if(userObj.matched=='true'){
    //         getMentorDetails()

    //       }else{
    //         setDisplayMessage('We will update, once mentor matched')
    //         setMatched(false)
    //         setLoadingmentorormentees(false)
    //       }
    //     }
    //     else if(mentor=='true'){
    //       setDetailsOf('Mentee(s) ')
    //       const listlen=userObj.menteeslist.length
          
    //       if(listlen==0){
    //         setDisplayMessage('We will update, once matche made')
    //         setMatched(false)
    //         setLoadingmentorormentees(false)

    //       }else{
    //         getMenteesDetails()
    //       }

    //     }
    //   }

    //   console.log('user ',userObj)



    // },[])

    // const getUserData=async(userid)=>{
      
    //   try {
    //     const response = await axios.get(`${endpoint}/getuserdetails?userid=${userid}`);
      
    //         if (response.status === 200) {
    //           const a=true
    //           // dispatch(setAuth(a))
    //           const user=response.data
              
    //           console.log('user details ',user)
    //           if(user==null){
    //             localStorage.setItem('auth','false')
    //             localStorage.setItem('userId','')

    //             navigate('/')
    //           }
    //           else{
    //             dispatch(saveUserObj(response.data))
    //             setUserObj(response.data)
                
    //           }
    //         } else {
    //           console.error('Failed to submit user data.');
    //           localStorage.setItem('auth','false')
    //             localStorage.setItem('userId','')

    //             navigate('/')
    //           }
    //         } catch (error) {
    //         console.error('Error:', error);
    //         setDisplayMessage('We will update, once mentor matched')
    //             setMatched(false)
    //             setLoadingmentorormentees(false)
    //         }

    // }



    const [displayMessage,setDisplayMessage]=React.useState('')
    const [loadingmentorormentees,setLoadingmentorormentees]=React.useState(true)
    const [matched,setMatched]=React.useState(false)


    const [loading,setLoading]=React.useState(true)
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
      height: 15,
      borderRadius: 5,
      
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#006D75' : '#308fe8',
      },
      // backgroundImage:
      // 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }));

  return (<>
  
    <Loading loading={loading}/>
    
  
  
    {!loading?<>

    
      <Box sx={{ flexGrow: 1}}>
      {/* <Header/> */}
      <Stack sx={{flex:1,textAlign:'center',paddingTop:'2rem',padding:'2rem'}}>
        <Stack sx={{flex:'1',justifyContent:'center'}}>
        <Typography sx={{fontWeight:'bold',fontSize:'28px',color:'#014abf',paddingRight:'6px'}}>Welcome </Typography>
        <Typography sx={{fontWeight:'bold',fontSize:'28px',color:'#014abf',textTransform:'uppercase'}}> {userObj.firstname} {userObj.lastname}</Typography>
        </Stack>
        <Stack sx={{flex:'1',flexDirection:'row',justifyContent:'center'}}>
        {/* <Typography sx={{fontSize:'14px',color:'#8d8e8f',paddingRight:'6px'}}>Our platform is specifically targeted at students to smoothen the process of getting job </Typography> */}
        
        </Stack>

      </Stack>
      

      {/* <Stack sx={{flex:1,textAlign:'center',flexDirection:'row', justifyContent:'center',paddingTop:'1rem'}}>
        <Typography sx={{fontWeight:'bold',fontSize:'28px',paddingRight:'6px'}}>Your {detailsOf} Details </Typography>

      </Stack> */}
      {/* <Stack sx={{flex:1,textAlign:'center',flexDirection:'row', justifyContent:'center',paddingTop:'1px'}}>

         {loadingmentorormentees?<CircularProgress/> :
         <>
         {matched ?<Container  sx={{display:'flex',flexWrap:'wrap',justifyContent:'center',textAlign:'start'}}>
          {detailsOf=='Mentor '?<><ProfileDisplay userDeatils={mentorDetails}/></>:
          <>{menteeList.map((me)=>{
            return <ProfileDisplay userDeatils={me}/>
           })}</>}
         </Container>:<Typography>{displayMessage}</Typography>}
         </>
         
         }
      </Stack> */}
      {/* <Stack sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
        <Container maxWidth='sm' sx={{border:'1px solid black',borderRadius:'4px',margin:'1rem',padding:'1rem'}}>
         
         <Box sx={{paddingBottom:'5px'}}>
         <Typography sx={{fontWeight:'bold',fontSize:'24px'}}>
          ajdgaah agajd hadg
         </Typography>
         <Typography>H agda hsagd ahsgs shgda fhag</Typography>
         </Box>
        
         <Box sx={{display:'flex',flexDirection:'row'}}><BorderLinearProgress variant="determinate" value={50} sx={{flex:2}} />
         <Typography variant='caption' sx={{textDecoration:'underline',paddingLeft:'8px'}}>5/10 Completed</Typography></Box>
         

        </Container>
      </Stack> */}
      {profilePercentage<100 &&       <Stack sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
      <Card  sx={{ maxWidth:1000, borderRadius:'2px',backgroundColor:'#E9F7F6',paddingTop:'2rem',paddingLeft:'1rem',paddingBottom:'2rem',margin:'1rem'}} elevation={0}>
          <CardContent>
           
            <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent={'center'}
      alignItems="center"
    >
      <Box marginRight={{ xs: 2, md: 2 }} marginBottom={{ xs: 2, md: 0 }}>
        <Stack spacing={2}>
        <Typography variant='h6' sx={{fontSize:'24px'}}>
        Lorem ipsum dolor
        </Typography>
        <Typography variant='subtitle1' sx={{fontSize:'16px'}}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam, doloremque similique? Eum dolorum, ducimus aperiam, provident earum, dolor at ab
        </Typography>
        <Box sx={{display:'flex',flexDirection:'row',paddingTop:'1rem'}}>
          <BorderLinearProgress variant="determinate"  value={profilePercentage} sx={{flex:2}} />
         <Typography variant='caption' sx={{textDecoration:'underline',paddingLeft:'8px'}}>{completedFields}/{totalFields} Completed</Typography>
         </Box>
         
        </Stack>
        <Button onClick={handleProfilepage} sx={{marginTop:'2rem',backgroundColor:'#006D75', textTransform:'capitalize',fontSize:'16px',paddingLeft:'1rem',paddingRight:'1rem',paddingTop:'10px',paddingBottom:'10px'}} variant="contained" >Update Profile</Button>
      </Box>
      <img
        src='./profileprogress.svg'
        style={{ maxWidth: '300px', height: 'auto',textAlign:'left' }}
      />
    </Box>
  
          </CardContent>
        </Card>
        </Stack>}
        <Box sx={{}}>
      <LifeCycle/>
      </Box>
      
    </Box>
  </>:''}</>
  );
}